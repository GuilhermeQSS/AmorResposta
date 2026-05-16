import SaidaDoacao from "../models/saidaDoacaoModel.js";
import SingletonDB from "../db/SingletonDB.js";

class SaidaDoacaoControl {

    static async cadastrar(req, res) {
        let connection = null;
        try {
            console.log(req.body);
            const { benId, listaLotes, data } = req.body;
            connection = await SingletonDB.getConnection();
            await SaidaDoacao.sdCadastro(connection, benId, listaLotes, data);
            return res.status(200).json({ msg: "Saída de doação cadastrada com sucesso!" });
        } catch (err) {
            if (connection) await connection.rollback();
            return res.status(500).json({ err: err.message });
        }
    }

    static async listar(req, res) {
        try {
            const { benNome, data } = req.query;
            const connection = await SingletonDB.getConnection();
            const resp = await SaidaDoacao.sdListar(connection, benNome, data);
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ err: err.message });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const connection = await SingletonDB.getConnection();
            const resp = await SaidaDoacao.buscarPorId(connection, id);
            if (!resp)
                return res.status(404).json({ err: "Saída de doação não encontrada" });
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ err: err.message });
        }
    }

    static async excluir(req, res) {
        let connection = null;
        try {
            const { id } = req.params;
            connection = await SingletonDB.getConnection();
            const saidaDoacao = await SaidaDoacao.buscarPorId(connection, id);
            if (!saidaDoacao)
                return res.status(404).json({ err: "Saída de doação não encontrada" });
            const resp = await saidaDoacao.sdExclui(connection);
            return res.status(200).json(resp);
        } catch (err) {
            if (connection) await connection.rollback();
            return res.status(500).json({ err: err.message });
        }
    }

    static async alterar(req, res) {
        let connection = null;
        try {
            const { id } = req.params;
            const { benId, data, listaOld, listaNew } = req.body;
            connection = await SingletonDB.getConnection();

            const saidaDoacao = await SaidaDoacao.buscarPorId(connection, id);
            if (!saidaDoacao)
                return res.status(404).json({ err: "Saída de doação não encontrada" });

            // Atualiza os campos do objeto antes de alterar
            saidaDoacao.benId = benId;
            saidaDoacao.data = data;

            await saidaDoacao.sdAlterar(connection, listaOld, listaNew);
            return res.status(200).json({ msg: "Saída de doação alterada com sucesso!" });
        } catch (err) {
            if (connection) await connection.rollback();
            return res.status(500).json({ err: err.message });
        }
    }
}

export default SaidaDoacaoControl;