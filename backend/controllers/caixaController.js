import Caixa from "../models/caixaModel.js";
import SingletonDB from "../db/SingletonDB.js";

function campoVazio(valor) {
    return valor === undefined || valor === null || !String(valor).trim();
}

function numeroInvalido(valor) {
    return campoVazio(valor) || Number.isNaN(Number(valor)) || Number(valor) < 0;
}

class CaixaController {
    static async listar(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            const resp = await Caixa.listar(connection, req.query.filtro);
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ erro: "Aconteceu um erro na hora de listar caixas" });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            const resp = await Caixa.buscarPorId(connection, req.query.id);

            if (!resp) {
                return res.status(404).json({ erro: `Nao existe caixa com id ${req.query.id}` });
            }

            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ erro: "Aconteceu um erro na hora de buscar o caixa" });
        }
    }

    static async cadastrar(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            const { data, turno, suprimentoInicial } = req.body;

            if (campoVazio(data) || campoVazio(turno) || numeroInvalido(suprimentoInicial)) {
                return res.status(400).json({
                    err: "Preencha os campos obrigatorios corretamente",
                    campos: {
                        cai_data: campoVazio(data),
                        cai_turno: campoVazio(turno),
                        cai_suprimentoInicial: numeroInvalido(suprimentoInicial)
                    }
                });
            }

            const caixa = new Caixa(0, data, turno, Number(suprimentoInicial), "aberto");
            const resp = await caixa.gravar(connection);
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ erro: "Aconteceu um erro na hora de abrir o caixa" });
        }
    }

    static async alterar(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            const { id, data, turno, suprimentoInicial, status } = req.body;

            if (campoVazio(id) || campoVazio(data) || campoVazio(turno) || numeroInvalido(suprimentoInicial)) {
                return res.status(400).json({
                    err: "Preencha os campos obrigatorios corretamente",
                    campos: {
                        cai_data: campoVazio(data),
                        cai_turno: campoVazio(turno),
                        cai_suprimentoInicial: numeroInvalido(suprimentoInicial)
                    }
                });
            }

            const caixa = new Caixa(id, data, turno, Number(suprimentoInicial), status || "aberto");
            const resp = await caixa.alterar(connection);
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ erro: "Aconteceu um erro na hora de alterar o caixa" });
        }
    }
}

export default CaixaController;
