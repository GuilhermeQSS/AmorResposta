<<<<<<< HEAD
=======
import connection from "../db/connection.js";
>>>>>>> devMain
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOCUMENTOS_DIR = path.join(__dirname, "..", "public", "uploads", "doacoes");
<<<<<<< HEAD

class Doacao {
    constructor(id, doadorNome, dataEntrega, origem, formaEntrega, tipo, quantidadeItens, observacao, documento = null) {
=======
let colunasDocumentosCache = null;

class Doacao {
    constructor(id, doadorNome, dataEntrega, origem, formaEntrega, tipo, quantidadeItens, observacao, detalhes = null, documento = null) {
>>>>>>> devMain
        this.id = id;
        this.doadorNome = Doacao.normalizarDoadorNome(doadorNome);
        this.dataEntrega = dataEntrega;
        this.origem = Doacao.normalizarTextoLivre(origem);
        this.formaEntrega = formaEntrega;
        this.tipo = tipo;
        this.quantidadeItens = Doacao.normalizarQuantidadeItens(quantidadeItens);
        this.observacao = Doacao.normalizarTextoLivre(observacao);
<<<<<<< HEAD
=======
        this.detalhes = Doacao.normalizarDetalhes(detalhes);
>>>>>>> devMain
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

<<<<<<< HEAD
=======
    static normalizarDetalhes(detalhes) {
        if (!detalhes) {
            return null;
        }

        if (typeof detalhes === "string") {
            try {
                return JSON.parse(detalhes);
            } catch {
                return null;
            }
        }

        if (typeof detalhes === "object" && !Array.isArray(detalhes)) {
            return detalhes;
        }

        return null;
    }

>>>>>>> devMain
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

<<<<<<< HEAD
    static async salvarDocumento(connection, documento) {
=======
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

        if (colunasDocumentos.has("doc_dataCriacao")) {
            campos.push("doc_dataCriacao");
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

        if (colunasDocumentos.has("doc_caminho")) {
            campos.push("doc_caminho");
            valores.push(caminhoRelativo);
        }

        if (campos.length > 0) {
            const placeholders = campos.map(() => "?").join(", ");
            const queryString = `insert into documentos(${campos.join(", ")}) values (${placeholders});`;
            const [resultadoDocumento] = await connection.query(queryString, valores);
            return resultadoDocumento;
        }

        throw new Error("Tabela documentos sem colunas compativeis para salvar anexos.");
    }

    static async salvarDocumento(documento) {
>>>>>>> devMain
        await fs.mkdir(DOCUMENTOS_DIR, { recursive: true });

        const extensao = Doacao.obterExtensaoDocumento(documento.nomeArquivo);
        const nomeSalvo = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}${extensao}`;
        const caminhoRelativo = `uploads/doacoes/${nomeSalvo}`;
        const caminhoCompleto = path.join(DOCUMENTOS_DIR, nomeSalvo);
        const conteudo = Buffer.from(documento.conteudoBase64, "base64");

        await fs.writeFile(caminhoCompleto, conteudo);

        try {
<<<<<<< HEAD
            const [resultadoDocumento] = await connection.query(
                "insert into documentos(doc_caminho) values (?);",
                [caminhoRelativo]
            );
=======
            const resultadoDocumento = await Doacao.inserirRegistroDocumento(documento, caminhoRelativo);
>>>>>>> devMain

            return {
                documentoId: resultadoDocumento.insertId,
                caminhoCompleto
            };
        } catch (error) {
            await fs.unlink(caminhoCompleto).catch(() => null);
            throw error;
        }
    }

<<<<<<< HEAD
    static async listar(connection, filtro, tipoFiltro = "doador") {
        let queryString = "select * from doacoes";
        const params = [];

        if (filtro) {
=======
    static async listar(filtro, tipoFiltro = "doador", dataInicial = null, dataFinal = null) {
        let queryString = "select * from doacoes";
        const params = [];

        if (tipoFiltro === "periodo" && dataInicial && dataFinal) {
            queryString += " where doa_dataEntrega between ? and ?";
            params.push(dataInicial, dataFinal);
        } else if (filtro) {
>>>>>>> devMain
            if (tipoFiltro === "data") {
                queryString += " where doa_dataEntrega = ?";
                params.push(filtro);
            } else {
                queryString += " where coalesce(doa_doadorNome, 'anonimo') like ?";
                params.push(`%${filtro}%`);
            }
        }

        queryString += " order by doa_dataEntrega asc, doa_id asc";

        const [doacoes] = await connection.query(queryString, params);
        return doacoes.map((d) => new Doacao(
            d.doa_id,
            d.doa_doadorNome,
            d.doa_dataEntrega,
            d.doa_origem,
            d.doa_formaEntrega,
            d.doa_tipo,
            d.doa_quantidadeItens,
<<<<<<< HEAD
            d.doa_observacao
=======
            d.doa_observacao,
            d.doa_detalhes
>>>>>>> devMain
        ));
    }

    static async buscarPorId(connection, id) {
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
<<<<<<< HEAD
            doacao.doa_observacao
        );
    }

    async gravar(connection) {
=======
            doacao.doa_observacao,
            doacao.doa_detalhes
        );
    }

    async gravar() {
>>>>>>> devMain
        let documentoPersistido = null;

        await connection.beginTransaction();

        try {
            if (this.documento) {
<<<<<<< HEAD
                documentoPersistido = await Doacao.salvarDocumento(connection, this.documento);
=======
                documentoPersistido = await Doacao.salvarDocumento(this.documento);
>>>>>>> devMain
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
<<<<<<< HEAD
                    doc_id
                ) values (?, ?, ?, ?, ?, ?, ?, ?);
=======
                    doa_detalhes,
                    doc_id
                ) values (?, ?, ?, ?, ?, ?, ?, ?, ?);
>>>>>>> devMain
            `;

            const [resultado] = await connection.query(queryString, [
                this.doadorNome,
                this.dataEntrega,
                this.origem,
                this.formaEntrega,
                this.tipo,
                this.quantidadeItens,
                this.observacao,
<<<<<<< HEAD
=======
                this.detalhes ? JSON.stringify(this.detalhes) : null,
>>>>>>> devMain
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

    async alterar(connection) {
        const queryString = `
            update doacoes set
                doa_doadorNome = ?,
                doa_dataEntrega = ?,
                doa_origem = ?,
                doa_formaEntrega = ?,
                doa_tipo = ?,
                doa_quantidadeItens = ?,
<<<<<<< HEAD
                doa_observacao = ?
=======
                doa_observacao = ?,
                doa_detalhes = ?
>>>>>>> devMain
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
<<<<<<< HEAD
=======
            this.detalhes ? JSON.stringify(this.detalhes) : null,
>>>>>>> devMain
            this.id
        ]);

        return resultado;
    }

    async excluir(connection) {
        const queryString = "delete from doacoes where doa_id = ?";
        const [resultado] = await connection.query(queryString, [this.id]);
        return resultado;
    }
}

export default Doacao;
