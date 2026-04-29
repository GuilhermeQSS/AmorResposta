import Beneficiario from "../models/beneficiarioModel.js";
import SingletonDB from "../db/SingletonDB.js";

class BeneficiarioControl {
    static async listarEncontros(req, res) {
        try {
            const connection = await SingletonDB.getConnection();
            const beneficiario = Beneficiario.buscarPorId(connection,res.query.idBeneficiario);
            if (!beneficiario) {
                return res.status(404).json({ err: `Não existe esse beneficiario`});
            }
            const resp = beneficiario.listarEncontros(connection);
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
}

export default BeneficiarioControl;