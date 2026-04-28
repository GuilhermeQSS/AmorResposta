import Despesa from "../models/despesaModel.js";

function campoVazio(valor) {
    return !valor || !String(valor).trim();
}

function valorInvalido(valor) {
    if (valor === "" || valor === null || valor === undefined) {
        return true;
    }

    const numero = Number(valor);
    return !Number.isFinite(numero) || numero < 0;
}

class DespesaController {
    static async listar(req, res) {
        try {
            const resp = await Despesa.listar(req.query.filtro, req.query.valor);
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ erro: "Aconteceu um erro na hora de listar despesas" });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const resp = await Despesa.buscarPorId(req.query.id);

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
            const { valor, descricao } = req.body;

            if (valorInvalido(valor) || campoVazio(descricao)) {
                return res.status(400).json({
                    err: "Preencha os campos obrigatorios corretamente",
                    campos: {
                        des_valor: valorInvalido(valor),
                        des_descricao: campoVazio(descricao)
                    }
                });
            }

            const despesa = new Despesa(0, valor, descricao);
            const resp = await despesa.gravar();
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ erro: "Aconteceu um erro na hora de gravar a despesa" });
        }
    }

    static async alterar(req, res) {
        try {
            const { id, valor, descricao } = req.body;

            if (valorInvalido(valor) || campoVazio(descricao)) {
                return res.status(400).json({
                    err: "Preencha os campos obrigatorios corretamente",
                    campos: {
                        des_valor: valorInvalido(valor),
                        des_descricao: campoVazio(descricao)
                    }
                });
            }

            const despesa = new Despesa(id, valor, descricao);
            const resp = await despesa.alterar();
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ erro: "Aconteceu um erro na hora de alterar a despesa" });
        }
    }

    static async excluir(req, res) {
        try {
            const { id } = req.body;
            const despesa = new Despesa(id);
            const resp = await despesa.excluir();
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ erro: "Aconteceu um erro na hora de excluir a despesa" });
        }
    }
}

export default DespesaController;
