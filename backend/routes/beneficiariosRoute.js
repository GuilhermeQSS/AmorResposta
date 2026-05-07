import BeneficiarioController from '../controllers/beneficiarioController.js';
import BeneficiarioControl from '../controllers/beneficiarioControl.js';
import { autenticarBeneficiario,autenticarAdmin } from '../middlewares/authMiddleware.js';
import e from "express";
const router = e.Router();

router.get("/listar",BeneficiarioController.listar);
router.post("/gravar",BeneficiarioController.cadastrar);
router.get("/buscar",BeneficiarioController.buscarPorId);
router.put("/alterar", BeneficiarioController.alterar);
router.delete("/excluir", BeneficiarioController.excluir);
router.get("/listar-encontros",autenticarBeneficiario,BeneficiarioControl.listarEncontros);

export default router;
