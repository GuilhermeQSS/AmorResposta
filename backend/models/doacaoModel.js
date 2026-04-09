import connection from "../db/connection.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOCUMENTOS_DIR = path.join(__dirname, "..", "public", "uploads", "doacoes");
let colunasDocumentosCache = null;

class Doacao {
    constructor(id, doadorNome, dataEntrega, origem, formaEntrega, tipo, quantidadeItens, observacao, documento = null) {
        this.id = id;
        this.doadorNome = Doacao.normalizarDoadorNome(doadorNome);
        this.dataEntrega = dataEntrega;
        this.origem = Doacao.normalizarTextoLivre(origem);
        this.formaEntrega = formaEntrega;
        this.tipo = tipo;
        this.quantidadeItens = Doacao.normalizarQuantidadeItens(quantidadeItens);
        this.observacao = Doacao.normalizarTextoLivre(observacao);
        this.documento = Doacao.normalizarDocumento(documento);
    }

    static normalizarDoadorNome(doadorNome) {
        const nome = String(doadorNome || "").trim();
        return nome || "anonimo";
    }

    static normalizarTextoLivre(valor) {
        const texto = String(valor || "").trim();
        return texto || null;
    }

    static normalizarQuantidadeItens(quantidadeItens) {
        const quantidade = Number(quantidadeItens);
        return Number.isInteger(quantidade) && quantidade > 0 ? quantidade : null;
    }

    static normalizarDocumento(documento) {
        if (!documento) {
            return null;
        }

        const nomeArquivo = String(documento.nomeArquivo || "").trim();
        const conteudoBase64 = String(documento.conteudoBase64 || "").trim();
        const tipoMime = String(documento.tipoMime || "").trim() || null;

        if (!nomeArquivo || !conteudoBase64) {
            return null;
        }

        return {
            nomeArquivo,
            conteudoBase64,
            tipoMime
        };
    }

    static obterExtensaoDocumento(nomeArquivo) {
        const extensaoOriginal = path.extname(nomeArquivo || "").replace(/[^a-zA-Z0-9.]/g, "").toLowerCase();
        return extensaoOriginal || ".bin";
    }

    static obterTipoDocumento(documento) {
        if (documento.tipoMime) {
            return documento.tipoMime;
        }

        const extensao = Doacao.obterExtensaoDocumento(documento.nomeArquivo).replace(".", "");
        return extensao || "arquivo";
    }

    static async obterColunasDocumentos() {
        if (colunasDocumentosCache) {
            return colunasDocumentosCache;
        }

        const [colunas] = await connection.query("SHOW COLUMNS FROM documentos");
        colunasDocumentosCache = new Set(colunas.map((coluna) => coluna.Field));
        return colunasDocumentosCache;
    }

    static async inserirRegistroDocumento(documento, caminhoRelativo) {
        const colunasDocumentos = await Doacao.obterColunasDocumentos();

        if (
            colunasDocumentos.has("doc_titulo") ||
            colunasDocumentos.has("doc_tipo") ||
            colunasDocumentos.has("doc_link")
        ) {
            const dataCriacao = new Date().toISOString().slice(0, 10);
            const descricao = `Arquivo anexado automaticamente a uma doacao: ${documento.nomeArquivo}`;
            const campos = [];
            const valores = [];

            if (colunasDocumentos.has("doc_titulo")) {
                campos.push("doc_titulo");
                valores.push(documento.nomeArquivo);
            }

            if (colunasDocumentos.has("doc_tipo")) {
                campos.push("doc_tipo");
                valores.push(Doacao.obterTipoDocumento(documento));
            }

            if (colunasDocumentos.has("doc_data_criacao")) {
                campos.push("doc_data_criacao");
                valores.push(dataCriacao);
            }

            if (colunasDocumentos.has("doc_descricao")) {
                campos.push("doc_descricao");
                valores.push(descricao);
            }

            if (colunasDocumentos.has("doc_link")) {
                campos.push("doc_link");
                valores.push(caminhoRelativo);
            }

            const placeholders = campos.map(() => "?").join(", ");
            const queryString = `insert into documentos(${campos.join(", ")}) values (${placeholders});`;
            const [resultadoDocumento] = await connection.query(queryString, valores);
            return resultadoDocumento;
        }

        if (colunasDocumentos.has("doc_caminho")) {
            const [resultadoDocumento] = await connection.query(
                "insert into documentos(doc_caminho) values (?);",
                [caminhoRelativo]
            );

            return resultadoDocumento;
        }

        throw new Error("Tabela documentos sem colunas compativeis para salvar anexos.");
    }

    static async salvarDocumento(documento) {
        await fs.mkdir(DOCUMENTOS_DIR, { recursive: true });

        const extensao = Doacao.obterExtensaoDocumento(documento.nomeArquivo);
        const nomeSalvo = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}${extensao}`;
        const caminhoRelativo = `uploads/doacoes/${nomeSalvo}`;
        const caminhoCompleto = path.join(DOCUMENTOS_DIR, nomeSalvo);
        const conteudo = Buffer.from(documento.conteudoBase64, "base64");

        await fs.writeFile(caminhoCompleto, conteudo);

        try {
            const resultadoDocumento = await Doacao.inserirRegistroDocumento(documento, caminhoRelativo);

            return {
                documentoId: resultadoDocumento.insertId,
                caminhoCompleto
            };
        } catch (error) {
            await fs.unlink(caminhoCompleto).catch(() => null);
            throw error;
        }
    }

    static async listar(filtro, tipoFiltro = "doador") {
        let queryString = "select * from doacoes";
        const params = [];

        if (filtro) {
            if (tipoFiltro === "data") {
                queryString += " where doa_dataEntrega = ?";
                params.push(filtro);
            } else {
                queryString += " where coalesce(doa_doadorNome, 'anonimo') like ?";
                params.push(`%${filtro}%`);
            }
        }

        queryString += " order by doa_dataEntrega desc, doa_id desc";

        const [doacoes] = await connection.query(queryString, params);
        return doacoes.map((d) => new Doacao(
            d.doa_id,
            d.doa_doadorNome,
            d.doa_dataEntrega,
            d.doa_origem,
            d.doa_formaEntrega,
            d.doa_tipo,
            d.doa_quantidadeItens,
            d.doa_observacao
        ));
    }

    static async buscarPorId(id) {
        const queryString = "select * from doacoes where doa_id = ?";
        const [[doacao]] = await connection.query(queryString, [id]);

        if (!doacao) {
            return null;
        }

        return new Doacao(
            doacao.doa_id,
            doacao.doa_doadorNome,
            doacao.doa_dataEntrega,
            doacao.doa_origem,
            doacao.doa_formaEntrega,
            doacao.doa_tipo,
            doacao.doa_quantidadeItens,
            doacao.doa_observacao
        );
    }

    async gravar() {
        let documentoPersistido = null;

        await connection.beginTransaction();

        try {
            if (this.documento) {
                documentoPersistido = await Doacao.salvarDocumento(this.documento);
            }

            const queryString = `
                insert into doacoes(
                    doa_doadorNome,
                    doa_dataEntrega,
                    doa_origem,
                    doa_formaEntrega,
                    doa_tipo,
                    doa_quantidadeItens,
                    doa_observacao,
                    doc_id
                ) values (?, ?, ?, ?, ?, ?, ?, ?);
            `;

            const [resultado] = await connection.query(queryString, [
                this.doadorNome,
                this.dataEntrega,
                this.origem,
                this.formaEntrega,
                this.tipo,
                this.quantidadeItens,
                this.observacao,
                documentoPersistido?.documentoId || null
            ]);

            await connection.commit();
            return resultado;
        } catch (error) {
            await connection.rollback();

            if (documentoPersistido?.caminhoCompleto) {
                await fs.unlink(documentoPersistido.caminhoCompleto).catch(() => null);
            }

            throw error;
        }
    }

    async alterar() {
        const queryString = `
            update doacoes set
                doa_doadorNome = ?,
                doa_dataEntrega = ?,
                doa_origem = ?,
                doa_formaEntrega = ?,
                doa_tipo = ?,
                doa_quantidadeItens = ?,
                doa_observacao = ?
            where doa_id = ?;
        `;

        const [resultado] = await connection.query(queryString, [
            this.doadorNome,
            this.dataEntrega,
            this.origem,
            this.formaEntrega,
            this.tipo,
            this.quantidadeItens,
            this.observacao,
            this.id
        ]);

        return resultado;
    }

    async excluir() {
        const queryString = "delete from doacoes where doa_id = ?";
        const [resultado] = await connection.query(queryString, [this.id]);
        return resultado;
    }
}

export default Doacao;
