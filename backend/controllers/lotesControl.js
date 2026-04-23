import Lotes from "../models/lotesModel.js";
import SingletonDB from "../db/SingletonDB.js";

class lotesControl {
    static async listar(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            const resp = await Lotes.listar(connection, req.query.idItem, req.query.data);
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ err: err.message });
        }
    }

    static async listarComItens(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            const resp = await Lotes.listarComItens(connection, req.query.nome, req.query.data);
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ err: err.message });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            const resp = await Lotes.buscarPorId(connection, req.query.id);
            if (!resp) {
                throw new Error(`Não existe lote com id = ${req.query.id}`);
            }
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ err: err.message });
        }
    }

    static async alterar(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            const { id, idItem, unidadeMed, data, quantidade } = req.body;

            const loteOriginal = await Lotes.buscarPorId(connection, id);
            if (!loteOriginal)
                throw new Error("Id não existe");

            const lote = new Lotes(id, idItem, unidadeMed, data, quantidade);
            const resultado = await lote.alterar(connection);
            return res.status(200).json(resultado);
        } catch (err) {
            return res.status(500).json({ err: err.message });
        }
    }

    static async excluir(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            const lote = await Lotes.buscarPorId(connection, req.query.id);
            if (!lote)
                throw new Error(`Não existe lote com id = ${req.query.id}`);

            const resultado = await lote.excluir(connection);
            return res.status(200).json(resultado);
        } catch (err) {
            return res.status(500).json({ err: err.message });
        }
    }

    static async cadastrar(req, res) {
        try {
            const { idItem, unidadeMed, data, quantidade } = req.body;

            const lote = new Lotes(0, idItem, unidadeMed, data, quantidade);
            const connection = await SingletonDB.getConnection();
            const resp = await lote.gravar(connection);
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ err: err.message });
        }
    }
}

export default lotesControl;