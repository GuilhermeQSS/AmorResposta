import SingletonDB from "../db/SingletonDB.js";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOCUMENTOS_DIR = path.join(__dirname, "..", "public", "uploads", "documentos");
const TEXTO_REGEX = /^[A-Za-zÀ-ÿ0-9\s.,;:!?ºª°'"()/_-]{3,255}$/;
const NOME_ARQUIVO_REGEX = /^[A-Za-zÀ-ÿ0-9\s._()-]+\.[A-Za-z0-9]{1,10}$/;
const TAMANHO_MAXIMO_ARQUIVO = 10 * 1024 * 1024;
const TIPOS_DOCUMENTO = new Set(["PDF", "DOCX", "XLSX", "IMAGEM", "CONTRATO", "TERMO", "COMPROVANTE", "OUTRO", "TXT"]);

const connection = {
    async query(...args) {
        const db = await SingletonDB.getConnection();
        return db.query(...args);
    }
};

function mapDocumento(row) {
    return new Documento(
        row.doc_id,
        row.doc_titulo || row.doc_nome || row.doc_descricao,
        row.doc_tipo,
        row.doc_data_criacao || row.doc_dataCriacao,
        row.doc_descricao,
        row.doc_link || row.doc_caminho
    );
}

class Documento {
    constructor(id, titulo, tipo, dataCriacao, descricao, link) {
        this.id = id;
        this.titulo = titulo;
        this.tipo = tipo;
        this.dataCriacao = dataCriacao;
        this.descricao = descricao;
        this.link = link;
    }

    static async listar(filtroTitulo, filtroTipo) {
        let queryString = `select * from documentos`;
        const conditions = [];
        const params = [];

        if (filtroTitulo) {
            conditions.push(`coalesce(doc_titulo, doc_nome, doc_descricao, '') like ?`);
            params.push(`%${filtroTitulo}%`);
        }
        if (filtroTipo) {
            conditions.push(`doc_tipo like ?`);
            params.push(`%${filtroTipo}%`);
        }
        if (conditions.length > 0) {
            queryString += ` where ` + conditions.join(' and ');
        }
        queryString += ` order by coalesce(doc_data_criacao, doc_dataCriacao) desc, doc_id desc`;

        const [documentos] = await connection.query(queryString, params);
        return documentos.map(mapDocumento);
    }

    static async buscarPorId(id) {
        let queryString = `select * from documentos where doc_id = ?`
        const [[documento]] = await connection.query(queryString, [id]);
        if (!documento) {
            return null;
        } else {
            return mapDocumento(documento);
        }
    }

    static normalizarArquivo(arquivo) {
        if (!arquivo) {
            return null;
        }

        const nomeArquivo = String(arquivo.nomeArquivo || "").trim();
        const conteudoBase64 = String(arquivo.conteudoBase64 || "").trim();
        const tipoMime = String(arquivo.tipoMime || "").trim() || null;
        const tamanho = Number(arquivo.tamanho || arquivo.size || 0);

        if (!nomeArquivo || !conteudoBase64) {
            return null;
        }

        return { nomeArquivo, conteudoBase64, tipoMime, tamanho };
    }

    static normalizarFonte(link) {
        const fonte = String(link || "").trim();
        if (!fonte) {
            return "";
        }

        if (fonte.startsWith("uploads/")) {
            return fonte.replace(/\\/g, "/");
        }

        try {
            const url = new URL(fonte);
            url.hash = "";
            url.hostname = url.hostname.toLowerCase();
            return url.href.replace(/\/$/, "");
        } catch {
            return fonte;
        }
    }

    static normalizarDados({ titulo, tipo, dataCriacao, descricao, link, arquivo }) {
        return {
            titulo: String(titulo || "").trim(),
            tipo: String(tipo || "").trim().toUpperCase(),
            dataCriacao: dataCriacao || null,
            descricao: String(descricao || "").trim(),
            link: Documento.normalizarFonte(link),
            arquivo: Documento.normalizarArquivo(arquivo),
        };
    }

    static validarDados(dados, exigirFonte = true) {
        const erros = {};

        if (!dados.titulo) erros.titulo = "Titulo obrigatorio";
        if (dados.titulo && !TEXTO_REGEX.test(dados.titulo)) {
            erros.titulo = "Titulo invalido";
        }
        if (!dados.tipo) erros.tipo = "Tipo obrigatorio";
        if (dados.tipo && !TIPOS_DOCUMENTO.has(dados.tipo)) {
            erros.tipo = "Tipo invalido";
        }
        if (!dados.dataCriacao) erros.dataCriacao = "Data obrigatoria";
        if (dados.dataCriacao) {
            const dataCriacao = new Date(`${dados.dataCriacao}T00:00:00`);
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            if (Number.isNaN(dataCriacao.getTime()) || dataCriacao > hoje) {
                erros.dataCriacao = "Data invalida";
            }
        }
        if (!dados.descricao) erros.descricao = "Descricao obrigatoria";
        if (dados.descricao && !TEXTO_REGEX.test(dados.descricao)) {
            erros.descricao = "Descricao invalida";
        }
        if (exigirFonte && !dados.link && !dados.arquivo) {
            erros.link = "Informe um link ou envie um arquivo";
        }

        if (dados.link && !dados.arquivo && !dados.link.startsWith("uploads/")) {
            try {
                const url = new URL(dados.link);
                if (!["http:", "https:"].includes(url.protocol)) {
                    erros.link = "Use um link iniciado por http:// ou https://";
                }
            } catch {
                erros.link = "Informe uma URL valida";
            }
        }

        if (dados.arquivo) {
            if (!NOME_ARQUIVO_REGEX.test(dados.arquivo.nomeArquivo)) {
                erros.link = "Nome de arquivo invalido";
            }

            const tamanhoBuffer = Buffer.from(dados.arquivo.conteudoBase64, "base64").length;
            if (tamanhoBuffer <= 0 || tamanhoBuffer > TAMANHO_MAXIMO_ARQUIVO) {
                erros.link = "Arquivo deve ter ate 10MB";
            }
        }

        if (Object.keys(erros).length > 0) {
            const erro = new Error("Revise os dados do documento");
            erro.status = 400;
            erro.campos = erros;
            throw erro;
        }
    }

    static obterExtensaoArquivo(nomeArquivo) {
        const extensao = path.extname(nomeArquivo || "").replace(/[^a-zA-Z0-9.]/g, "").toLowerCase();
        return extensao || ".bin";
    }

    static obterNomeSeguro(nomeArquivo) {
        const base = path.basename(nomeArquivo || "documento").replace(/[^a-zA-Z0-9._-]/g, "_");
        return base || "documento";
    }

    static async salvarArquivo(arquivo) {
        await fs.mkdir(DOCUMENTOS_DIR, { recursive: true });

        const extensao = Documento.obterExtensaoArquivo(arquivo.nomeArquivo);
        const nomeBase = Documento.obterNomeSeguro(arquivo.nomeArquivo).replace(/\.[^.]+$/, "");
        const nomeSalvo = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${nomeBase}${extensao}`;
        const caminhoCompleto = path.join(DOCUMENTOS_DIR, nomeSalvo);
        const caminhoRelativo = `uploads/documentos/${nomeSalvo}`;
        const conteudo = Buffer.from(arquivo.conteudoBase64, "base64");

        await fs.writeFile(caminhoCompleto, conteudo);
        return { caminhoRelativo, caminhoCompleto };
    }

    static obterHashBuffer(buffer) {
        return crypto.createHash("sha256").update(buffer).digest("hex");
    }

    static async buscarDuplicadoPorFonte(link, ignorarId = null) {
        const fonteNormalizada = Documento.normalizarFonte(link);
        if (!fonteNormalizada) {
            return null;
        }

        let queryString = `
            select *
            from documentos
            where coalesce(doc_link, doc_caminho, '') <> ''
        `;
        const params = [];

        if (ignorarId) {
            queryString += ` and doc_id <> ?`;
            params.push(ignorarId);
        }

        const [documentos] = await connection.query(queryString, params);
        const duplicado = documentos.find((documento) => {
            const fonteAtual = documento.doc_link || documento.doc_caminho;
            return Documento.normalizarFonte(fonteAtual).toLowerCase() === fonteNormalizada.toLowerCase();
        });

        return duplicado ? mapDocumento(duplicado) : null;
    }

    static async buscarDuplicadoPorArquivo(arquivo, ignorarId = null) {
        if (!arquivo) {
            return null;
        }

        const conteudo = Buffer.from(arquivo.conteudoBase64, "base64");
        const hashNovo = Documento.obterHashBuffer(conteudo);
        let queryString = `
            select *
            from documentos
            where coalesce(doc_link, doc_caminho, '') like 'uploads/documentos/%'
        `;
        const params = [];

        if (ignorarId) {
            queryString += ` and doc_id <> ?`;
            params.push(ignorarId);
        }

        const [documentos] = await connection.query(queryString, params);
        for (const documento of documentos) {
            const link = documento.doc_link || documento.doc_caminho;
            const nomeArquivo = path.basename(link || "");
            if (!nomeArquivo) {
                continue;
            }

            const caminho = path.join(DOCUMENTOS_DIR, nomeArquivo);
            try {
                const conteudoExistente = await fs.readFile(caminho);
                if (Documento.obterHashBuffer(conteudoExistente) === hashNovo) {
                    return mapDocumento(documento);
                }
            } catch {
                continue;
            }
        }

        return null;
    }

    static async garantirSemDuplicidade(dados, ignorarId = null) {
        const duplicadoFonte = await Documento.buscarDuplicadoPorFonte(dados.link, ignorarId);
        if (duplicadoFonte) {
            const erro = new Error(`Documento ja cadastrado com este link ou arquivo: #${duplicadoFonte.id}`);
            erro.status = 400;
            erro.campos = { link: "Ja existe um documento com esta fonte" };
            throw erro;
        }

        const duplicadoArquivo = await Documento.buscarDuplicadoPorArquivo(dados.arquivo, ignorarId);
        if (duplicadoArquivo) {
            const erro = new Error(`Documento ja cadastrado com este arquivo: #${duplicadoArquivo.id}`);
            erro.status = 400;
            erro.campos = { link: "Ja existe um documento com este arquivo" };
            throw erro;
        }
    }

    static async removerArquivoLocal(link) {
        if (!link || !String(link).startsWith("uploads/documentos/")) {
            return;
        }

        const nomeArquivo = path.basename(link);
        await fs.unlink(path.join(DOCUMENTOS_DIR, nomeArquivo)).catch(() => null);
    }

    async gravar() {
        let queryString = `insert into documentos(
            doc_titulo,
            doc_nome,
            doc_tipo,
            doc_data_criacao,
            doc_dataCriacao,
            doc_descricao,
            doc_link,
            doc_caminho
        ) values (?, ?, ?, ?, ?, ?, ?, ?);`;
        const [resultado] = await connection.query(queryString, [
            this.titulo,
            this.titulo,
            this.tipo,
            this.dataCriacao,
            this.dataCriacao,
            this.descricao,
            this.link,
            this.link
        ]);
        return resultado;
    }

    async alterar() {
        let queryString = `
            update documentos set
                doc_titulo = ?,
                doc_nome = ?,
                doc_tipo = ?,
                doc_data_criacao = ?,
                doc_dataCriacao = ?,
                doc_descricao = ?,
                doc_link = ?,
                doc_caminho = ?
            where doc_id = ?;
        `;
        const [resultado] = await connection.query(queryString, [
            this.titulo,
            this.titulo,
            this.tipo,
            this.dataCriacao,
            this.dataCriacao,
            this.descricao,
            this.link,
            this.link,
            this.id
        ]);
        return resultado;
    }

    async excluir() {
        let queryString = `delete from documentos where doc_id = ?`;
        const [resultado] = await connection.query(queryString, [this.id]);
        return resultado;
    }
}

export default Documento;
