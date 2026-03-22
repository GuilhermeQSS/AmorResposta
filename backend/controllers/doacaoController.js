import Doacao from "../models/doacaoModel.js";

class DoacaoController {
    static async listar(req, res) {
        try {
            const resp = await Doacao.listar(req.query.filtro);
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ erro: "Aconteceu um erro na hora de listar doacoes" });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const resp = await Doacao.buscarPorId(req.query.id);

            if (!resp) {
                return res.status(404).json({ erro: `Nao existe doacao com id ${req.query.id}` });
            }

            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ erro: "Aconteceu um erro na hora de buscar a doacao" });
        }
    }

    static async cadastrar(req, res) {
        try {
            const { doadorNome, dataEntrega, origem, formaEntrega, tipo, observacao } = req.body;

            if (!dataEntrega || !formaEntrega || !tipo) {
                return res.status(400).json({
                    erro: "Data, forma de entrega e tipo sao obrigatorios"
                });
            }

            const doacao = new Doacao(
                0,
                doadorNome,
                dataEntrega,
                origem,
                formaEntrega,
                tipo,
                observacao
            );

            const resp = await doacao.gravar();
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ erro: "Aconteceu um erro na hora de gravar a doacao" });
        }
    }

    static async alterar(req, res) {
        try {
            const { id, doadorNome, dataEntrega, origem, formaEntrega, tipo, observacao } = req.body;

            if (!dataEntrega || !formaEntrega || !tipo) {
                return res.status(400).json({
                    erro: "Data, forma de entrega e tipo sao obrigatorios"
                });
            }

            const doacao = new Doacao(
                id,
                doadorNome,
                dataEntrega,
                origem,
                formaEntrega,
                tipo,
                observacao
            );

            const resp = await doacao.alterar();
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ erro: "Aconteceu um erro na hora de alterar a doacao" });
        }
    }

    static async excluir(req, res) {
        try {
            const { id } = req.body;
            const doacao = new Doacao(id);
            const resp = await doacao.excluir();
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ erro: "Aconteceu um erro na hora de excluir a doacao" });
        }
    }
}

export default DoacaoController;
