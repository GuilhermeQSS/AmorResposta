import Despesa from "../models/despesaModel.js";
import SingletonDB from "../db/SingletonDB.js";

function campoVazio(valor) {
    return !valor || !String(valor).trim();
}

class DespesaController {
    static async listar(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            const resp = await Despesa.listar(connection, req.query.filtro);
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ erro: "Aconteceu um erro na hora de listar despesas" });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            const resp = await Despesa.buscarPorId(connection, req.query.id);

            if (!resp) {
                return res.status(404).json({ erro: `Nao existe despesa com id ${req.query.id}` });
            }

            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ erro: "Aconteceu um erro na hora de buscar a despesa" });
        }
    }

    static async cadastrar(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            const { descricao, categoria } = req.body;

            if (campoVazio(descricao) || campoVazio(categoria)) {
                return res.status(400).json({
                    err: "Preencha os campos obrigatorios corretamente",
                    campos: {
                        des_descricao: campoVazio(descricao),
                        des_categoria: campoVazio(categoria)
                    }
                });
            }

            const despesa = new Despesa(0, descricao, categoria);
            const resp = await despesa.gravar(connection);
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ erro: "Aconteceu um erro na hora de gravar a despesa" });
        }
    }

    static async alterar(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            const { id, descricao, categoria } = req.body;

            if (campoVazio(descricao) || campoVazio(categoria)) {
                return res.status(400).json({
                    err: "Preencha os campos obrigatorios corretamente",
                    campos: {
                        des_descricao: campoVazio(descricao),
                        des_categoria: campoVazio(categoria)
                    }
                });
            }

            const despesa = new Despesa(id, descricao, categoria);
            const resp = await despesa.alterar(connection);
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ erro: "Aconteceu um erro na hora de alterar a despesa" });
        }
    }

    static async excluir(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            const { id } = req.body;
            const despesa = new Despesa(id);
            const resp = await despesa.excluir(connection);
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ erro: "Aconteceu um erro na hora de excluir a despesa" });
        }
    }
}

export default DespesaController;
