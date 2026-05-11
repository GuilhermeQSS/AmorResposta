import Local from "../models/localModel.js";
import SingletonDB from "../db/SingletonDB.js";

const ERROS_VALIDACAO = [
    "Todos os campos são obrigatórios",
    "Nome do local deve ter no máximo 100 caracteres"
];

function isErroValidacao(message) {
    return ERROS_VALIDACAO.some(e => message?.includes(e));
}

function isErroDuplicado(errno) {
    return errno === 1062;
}

class LocalControl {
    static async listar(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            let resp = await Local.listar(connection, req.query.nome);
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({
                errno: err.errno,
                message: err.message
            });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            let resp = await Local.buscarPorId(connection, req.query.id);
            if (!resp) {
                return res.status(404).json({ err: `Não existe local com id = ${req.query.id}` });
            }
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({
                errno: err.errno,
                message: err.message
            });
        }
    }

    static async cadastrar(req, res) {
        const connection = await SingletonDB.getConnection();
        try {
            await connection.beginTransaction();

            const { nome } = req.body;
            let local = new Local(-1, nome);
            const resp = await local.gravar(connection);

            await connection.commit();
            return res.status(201).json(resp);
        } catch (err) {
            await connection.rollback();
            if (isErroValidacao(err.message)) {
                return res.status(400).json({ err: err.message });
            }
            if (isErroDuplicado(err.errno)) {
                return res.status(400).json({ err: "Já existe um local com esse nome." });
            }
            return res.status(500).json({
                errno: err.errno,
                message: err.message
            });
        }
    }

    static async alterar(req, res) {
        const connection = await SingletonDB.getConnection();
        try {
            await connection.beginTransaction();

            const { id, nome } = req.body;
            const local = new Local(id, nome);
            const resp = await local.alterar(connection);

            await connection.commit();
            return res.status(200).json(resp);
        } catch (err) {
            await connection.rollback();
            if (isErroValidacao(err.message)) {
                return res.status(400).json({ err: err.message });
            }
            if (isErroDuplicado(err.errno)) {
                return res.status(400).json({ err: "Já existe um local com esse nome." });
            }
            return res.status(500).json({
                errno: err.errno,
                message: err.message
            });
        }
    }

    static async excluir(req, res) {
        const connection = await SingletonDB.getConnection();
        try {
            await connection.beginTransaction();

            let local = await Local.buscarPorId(connection, req.query.id);
            if (!local) {
                await connection.rollback();
                return res.status(404).json({ err: `Não existe local com id = ${req.query.id}` });
            }

            const resp = await local.excluir(connection);

            await connection.commit();
            return res.status(200).json(resp);
        } catch (err) {
            await connection.rollback();
            return res.status(500).json({
                errno: err.errno,
                message: err.message
            });
        }
    }
}

export default LocalControl;