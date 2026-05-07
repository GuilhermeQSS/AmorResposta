import Encontro from "../models/encontroModel.js";
import SingletonDB from "../db/SingletonDB.js";
import Beneficiario from "../models/beneficiarioModel.js";

class EncontroControl {
    static async listar(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            let resp = await Encontro.listar(connection, req.query.titulo, req.query.dataInicio, req.query.dataFim);
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ err: err.message });
        }
    }

    static async listarComoBeneficiario(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            const idBeneficiario = req.usuarioLogado.id;
            
            let resp = await Encontro.listarComoBeneficiario(
                connection,
                req.query.titulo,
                req.query.dataInicio,
                req.query.dataFim,
                idBeneficiario
            );
            
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ err: err.message });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            let resp = await Encontro.buscarPorId(connection, req.query.id);
            if (!resp) {
                return res.status(404).json({ err: `Não existe encontro com id = ${req.query.id}` });
            } else {
                return res.status(200).json(resp);
            }
        } catch (err) {
            return res.status(500).json({ err: err.message });
        }
    }

    static async cadastrarBeneficiario(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            
            const idBeneficiario = req.usuarioLogado.id;
            const idEncontro = req.query.idEncontro;

            let beneficiario = await Beneficiario.buscarPorId(connection, idBeneficiario);
            if (!beneficiario) {
                return res.status(404).json({ err: `Beneficiário não encontrado.` });
            }

            let encontro = await Encontro.buscarPorId(connection, idEncontro);
            if (!encontro) {
                return res.status(404).json({ err: `Encontro não encontrado.` });
            }

            const resultado = await encontro.cadastrarBeneficiario(connection, beneficiario);
            await encontro.incrementarParticipantes(connection);
            return res.status(200).json(resultado);
        } catch (err) {
            return res.status(500).json({ err: err.message });
        }
    }

    static async retirarBeneficiario(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            
            const idBeneficiario = req.usuarioLogado.id;
            const idEncontro = req.query.idEncontro;

            let beneficiario = await Beneficiario.buscarPorId(connection, idBeneficiario);
            if (!beneficiario) {
                return res.status(404).json({ err: `Beneficiário não encontrado.` });
            }

            let encontro = await Encontro.buscarPorId(connection, idEncontro);
            if (!encontro) {
                return res.status(404).json({ err: `Encontro não encontrado.` });
            }
            
            const resultado = await encontro.retirarBeneficiario(connection, beneficiario);
            await encontro.decrementarParticipantes(connection);
            return res.status(200).json(resultado);
        } catch (err) {
            return res.status(500).json({ err: err.message });
        }
    }
}

export default EncontroControl;