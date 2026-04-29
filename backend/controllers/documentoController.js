import Documento from "../models/documentoModel.js";
import SingletonDB from "../db/SingletonDB.js";

class DocumentoController {
    static async listar(req, res) {
        try {
            const resp = await Documento.listar(req.query.filtroTitulo, req.query.filtroTipo);
            return res.status(200).json(resp);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ Erro: "Aconteceu um erro na hora de listar documentos" });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const resp = await Documento.buscarPorId(req.query.id);
            if (!resp) {
                return res.status(404).json({ Erro: `Nao existe documento com id ${req.query.id}` });
            }

            return res.status(200).json(resp);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ Erro: "Aconteceu um erro na hora de buscar documento" });
        }
    }

    static async cadastrar(req, res) {
        let arquivoSalvo = null;

        try {
            const dados = Documento.normalizarDados(req.body);
            Documento.validarDados(dados);
            await Documento.garantirSemDuplicidade(dados);

            if (dados.arquivo) {
                arquivoSalvo = await Documento.salvarArquivo(dados.arquivo);
                dados.link = arquivoSalvo.caminhoRelativo;
            }

            const documento = new Documento(
                0,
                dados.titulo,
                dados.tipo,
                dados.dataCriacao,
                dados.descricao,
                dados.link
            );

            const resp = await documento.gravar();
            return res.status(201).json(resp);
        } catch (err) {
            if (arquivoSalvo?.caminhoRelativo) {
                await Documento.removerArquivoLocal(arquivoSalvo.caminhoRelativo);
            }

            console.error(err);
            return res.status(err.status || 500).json({
                Erro: err.message || "Aconteceu um erro na hora de gravar documento",
                campos: err.campos || {},
            });
        }
    }

    static async alterar(req, res) {
        let arquivoSalvo = null;

        try {
            const { id } = req.body;
            const dados = Documento.normalizarDados(req.body);

            if (!id) {
                return res.status(400).json({ Erro: "ID obrigatorio" });
            }

            const documentoAtual = await Documento.buscarPorId(id);
            if (!documentoAtual) {
                return res.status(404).json({ Erro: `Nao existe documento com id ${id}` });
            }

            Documento.validarDados(dados, !documentoAtual.link);

            if (dados.arquivo) {
                await Documento.garantirSemDuplicidade(dados, id);
                arquivoSalvo = await Documento.salvarArquivo(dados.arquivo);
                dados.link = arquivoSalvo.caminhoRelativo;
            } else if (dados.link) {
                await Documento.garantirSemDuplicidade(dados, id);
            } else {
                dados.link = documentoAtual.link;
            }

            const documento = new Documento(
                id,
                dados.titulo,
                dados.tipo,
                dados.dataCriacao,
                dados.descricao,
                dados.link
            );

            const resultado = await documento.alterar();
            if (dados.arquivo) {
                await Documento.removerArquivoLocal(documentoAtual.link);
            }

            return res.status(200).json(resultado);
        } catch (err) {
            if (arquivoSalvo?.caminhoRelativo) {
                await Documento.removerArquivoLocal(arquivoSalvo.caminhoRelativo);
            }

            console.error(err);
            return res.status(err.status || 500).json({
                Erro: err.message || "Erro ao alterar documento",
                campos: err.campos || {},
            });
        }
    }

    static async excluir(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            const { id } = req.body;
            if (!id) {
                return res.status(400).json({ Erro: "ID obrigatorio para exclusao" });
            }

            const documentoAtual = await Documento.buscarPorId(id);
            if (!documentoAtual) {
                return res.status(404).json({ Erro: `Nao existe documento com id ${id}` });
            }

            const documento = new Documento(id);
            const resultado = await documento.excluir();
            await Documento.removerArquivoLocal(documentoAtual.link);
            return res.status(200).json(resultado);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ Erro: "Erro ao excluir documento" });
        }
    }
}

export default DocumentoController;
