import Encontro from "../models/encontroModel.js";
import SingletonDB from "../db/SingletonDB.js";

class EncontroControl {
    static async listar(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            let resp = await Encontro.listar(connection, req.query.titulo, req.query.status, req.query.data);
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ errno: err.errno, message: err.message });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            let resp = await Encontro.buscarPorId(connection, req.query.id);
            if (!resp) {
                return res.status(404).json({ err: `Não existe encontro com id = ${req.query.id}` });
            }
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ errno: err.errno, message: err.message });
        }
    }

    static async cadastrar(req, res) {
        const connection = await SingletonDB.getConnection();
        try {
            await connection.beginTransaction();

            const {
                data, horaInicio, horaFim, status, qtdeMax, qtde,
                titulo, descricao, motivoCancelamento, voluntariosAfetados,
                lotesAfetados, beneficiariosAfetados, locId
            } = req.body;

            let encontro = new Encontro(
                -1, data, horaInicio, horaFim, status ?? "a", qtdeMax, qtde ?? 0,
                titulo, descricao, motivoCancelamento, voluntariosAfetados,
                lotesAfetados, beneficiariosAfetados, locId
            );
            
            const resp = await encontro.gravar(connection);
            
            await connection.commit();
            return res.status(201).json(resp);
        } catch (err) {
            await connection.rollback();
            return res.status(500).json({ errno: err.errno, message: err.message });
        }
    }

    static async alterar(req, res) {
        const connection = await SingletonDB.getConnection();
        try {
            await connection.beginTransaction();

            const {
                id, data, horaInicio, horaFim, status, qtdeMax, qtde,
                titulo, descricao, motivoCancelamento, voluntariosAfetados,
                lotesAfetados, beneficiariosAfetados, locId
            } = req.body;

            const encontro = new Encontro(
                id, data, horaInicio, horaFim, status, qtdeMax, qtde,
                titulo, descricao, motivoCancelamento, voluntariosAfetados,
                lotesAfetados, beneficiariosAfetados, locId
            );
            
            const resp = await encontro.alterar(connection);
            
            await connection.commit();
            return res.status(200).json(resp);
        } catch (err) {
            await connection.rollback();
            return res.status(500).json({ errno: err.errno, message: err.message });
        }
    }

    static async excluir(req, res) {
        const connection = await SingletonDB.getConnection();
        try {
            await connection.beginTransaction();

            let encontro = await Encontro.buscarPorId(connection, req.query.id);
            if (!encontro) {
                await connection.rollback();
                return res.status(404).json({ err: `Não existe encontro com id = ${req.query.id}` });
            }
            
            const resp = await encontro.excluir(connection);
            
            await connection.commit();
            return res.status(200).json(resp);
        } catch (err) {
            await connection.rollback();
            return res.status(500).json({ errno: err.errno, message: err.message });
        }
    }

    static async listarComoBeneficiario(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            // CORRIGIDO: usando req.usuarioLogado
            const benId = req.usuarioLogado.id; 
            const { titulo, dataInicio, dataFim } = req.query;

            let resp = await Encontro.listarComoBeneficiario(connection, benId, titulo, dataInicio, dataFim);
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ errno: err.errno, message: err.message });
        }
    }

    static async cadastrarBeneficiario(req, res) {
        const connection = await SingletonDB.getConnection();
        try {
            await connection.beginTransaction(); 
            
            // CORRIGIDO: usando req.usuarioLogado
            const benId = req.usuarioLogado.id; 
            const encId = req.query.idEncontro;

            await Encontro.inscreverBeneficiario(connection, encId, benId);
            
            await connection.commit();
            return res.status(200).json({ message: "Inscrição realizada com sucesso." });
        } catch (err) {
            await connection.rollback();
            return res.status(400).json({ err: err.message });
        }
    }

    static async retirarBeneficiario(req, res) {
        const connection = await SingletonDB.getConnection();
        try {
            await connection.beginTransaction(); 
            
            // CORRIGIDO: usando req.usuarioLogado
            const benId = req.usuarioLogado.id; 
            const encId = req.query.idEncontro;

            await Encontro.cancelarInscricaoBeneficiario(connection, encId, benId);
            
            await connection.commit();
            return res.status(200).json({ message: "Inscrição cancelada com sucesso." });
        } catch (err) {
            await connection.rollback();
            return res.status(400).json({ err: err.message });
        }
    }
}

export default EncontroControl;