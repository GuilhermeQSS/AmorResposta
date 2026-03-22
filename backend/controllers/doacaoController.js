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
}

export default DoacaoController;
