import EncontroControl from '../controllers/encontroControl.js';
import { autenticarBeneficiario,autenticarAdmin } from '../middlewares/authMiddleware.js';
import e from "express";
const router = e.Router();

router.get("/listar",autenticarAdmin,EncontroControl.listar);
//router.post("/gravar",autenticarAdmin,EncontroControl.cadastrar);
router.get("/buscar",autenticarAdmin,EncontroControl.buscarPorId);
//router.put("/alterar",autenticarAdmin, EncontroControl.alterar);
//router.delete("/excluir",autenticarAdmin, EncontroControl.excluir);
router.post("/cadastrar-beneficiario",autenticarBeneficiario,EncontroControl.cadastrarBeneficiario);
router.post("/retirar-beneficiario",autenticarBeneficiario,EncontroControl.retirarBeneficiario);

export default router;