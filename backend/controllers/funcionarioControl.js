import Funcionario from "../models/funcionarioModel.js";
import SingletonDB from "../db/SingletonDB.js";

const CARGO_ADMIN = "Administrador";

const ERROS_VALIDACAO = [
    "Todos os campos são obrigatórios",
    "CPF inválido",
    "Telefone inválido (deve conter 10 ou 11 dígitos numéricos)"
];

function isErroValidacao(message) {
    return ERROS_VALIDACAO.some(e => message?.includes(e));
}

function isErroDuplicado(errno) {
    return errno === 1062;
}

class FuncionarioControl {
    static async listar(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            let resp = await Funcionario.listar(connection, req.query.nome, req.query.usuario);
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
            let resp = await Funcionario.buscarPorId(connection, req.query.id);
            if (!resp) {
                return res.status(404).json({ err: `Não existe funcionario com id = ${req.query.id}` });
            }
            return res.status(200).json(resp);
        } catch (err) {
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

            const { id, nome, usuario, senha, cargo, cpf, telefone } = req.body;
            const funcionario = new Funcionario(id, nome, cargo, cpf, telefone, usuario, senha);
            const resp = await funcionario.alterar(connection);

            await connection.commit();
            return res.status(200).json(resp);
        } catch (err) {
            await connection.rollback();
            if (isErroValidacao(err.message)) {
                return res.status(400).json({ err: err.message });
            }
            if (isErroDuplicado(err.errno)) {
                return res.status(400).json({ err: "CPF ou usuário já cadastrado no sistema." });
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

            let funcionario = await Funcionario.buscarPorId(connection, req.query.id);
            if (!funcionario) {
                await connection.rollback();
                return res.status(404).json({ err: `Não existe funcionario com id = ${req.query.id}` });
            }

            if (funcionario.cargo === CARGO_ADMIN) {
                const todosAdmins = await Funcionario.listar(connection, null, null);
                const qtdAdmins = todosAdmins.filter(f => f.cargo === CARGO_ADMIN).length;
                if (qtdAdmins <= 1) {
                    await connection.rollback();
                    return res.status(400).json({ err: "Não é possível excluir o único administrador do sistema." });
                }
            }

            const resp = await funcionario.excluir(connection);

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

    static async cadastrar(req, res) {
        const connection = await SingletonDB.getConnection();
        try {
            await connection.beginTransaction();

            const { nome, usuario, senha, cargo, cpf, telefone } = req.body;
            let funcionario = new Funcionario(-1, nome, cargo, cpf, telefone, usuario, senha);
            const resp = await funcionario.gravar(connection);

            await connection.commit();
            return res.status(201).json(resp);
        } catch (err) {
            await connection.rollback();
            if (isErroValidacao(err.message)) {
                return res.status(400).json({ err: err.message });
            }
            if (isErroDuplicado(err.errno)) {
                return res.status(400).json({ err: "CPF ou usuário já cadastrado no sistema." });
            }
            return res.status(500).json({
                errno: err.errno,
                message: err.message
            });
        }
    }
}

export default FuncionarioControl;