import Documento from "../models/documentoModel.js";

class DocumentoController {
    static async listar(req, res) {
        try {
            let resp = await Documento.listar(req.query.filtroTitulo, req.query.filtroTipo);
            return res.status(200).json(resp);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ Erro: "Aconteceu um erro na hora de listar documentos" });
        }
    }

    static async buscarPorId(req, res) {
        try {
            let resp = await Documento.buscarPorId(req.query.id);
            if (!resp) {
                return res.status(404).json({ Erro: `Nao existe documento com id ${req.query.id}` });
            } else {
                return res.status(200).json(resp);
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ Erro: "Aconteceu um erro na hora de buscar documento" });
        }
    }

    static async cadastrar(req, res) {
        try {
            const { titulo, tipo, dataCriacao, descricao, link } = req.body;
            if (!titulo || !tipo) {
                return res.status(400).json({ Erro: "Título e Tipo são obrigatórios" });
            }
            let documento = new Documento(
                0,
                titulo,
                tipo,
                dataCriacao,
                descricao,
                link
            );
            let resp = await documento.gravar();
            return res.status(201).json(resp);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ Erro: "Aconteceu um erro na hora de gravar documento" });
        }
    }

    static async alterar(req, res) {
        try {
            const { id, titulo, tipo, dataCriacao, descricao, link } = req.body;
            if (!id || !titulo || !tipo) {
                return res.status(400).json({ Erro: "ID, Título e Tipo são obrigatórios" });
            }
            const documento = new Documento(
                id,
                titulo,
                tipo,
                dataCriacao,
                descricao,
                link
            );
            const resultado = await documento.alterar();
            res.status(200).json(resultado);
        } catch (err) {
            console.error(err);
            res.status(500).json({ Erro: "Erro ao alterar documento" });
        }
    }

    static async excluir(req, res) {
        try {
            const { id } = req.body;
            if (!id) {
                return res.status(400).json({ Erro: "ID é obrigatório para exclusão" });
            }
            const documento = new Documento(id);
            const resultado = await documento.excluir();
            res.status(200).json(resultado);
        } catch (err) {
            console.error(err);
            res.status(500).json({ Erro: "Erro ao excluir documento" });
        }
    }
}

export default DocumentoController;
