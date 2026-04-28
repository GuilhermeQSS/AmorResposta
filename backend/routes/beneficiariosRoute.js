import BeneficiarioController from '../controllers/beneficiarioController.js';
import e from "express";
const router = e.Router();

router.get("/listar",BeneficiarioController.listar);
router.post("/gravar",BeneficiarioController.cadastrar);
router.get("/buscar",BeneficiarioController.buscarPorId);
router.put("/alterar", BeneficiarioController.alterar);
router.delete("/excluir", BeneficiarioController.excluir);

export default router;
