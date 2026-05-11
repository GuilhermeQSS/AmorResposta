import BeneficiarioControl from '../controllers/beneficiarioControl.js';
import { autenticarAdmin } from '../middlewares/authMiddleware.js';
import e from "express";

const router = e.Router();

router.get("/listar", autenticarAdmin, BeneficiarioControl.listar);
router.post("/gravar", autenticarAdmin, BeneficiarioControl.cadastrar);
router.get("/buscar", autenticarAdmin, BeneficiarioControl.buscarPorId);
router.put("/alterar", autenticarAdmin, BeneficiarioControl.alterar);
router.delete("/excluir", autenticarAdmin, BeneficiarioControl.excluir);

export default router;