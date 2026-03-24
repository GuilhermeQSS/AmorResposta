import ItensController from '../controllers/itensController.js';
import e from "express";
const router = e.Router();

router.get("/listar",ItensController.listar);
router.post("/gravar",ItensController.cadastrar);
router.get("/buscar",ItensController.buscarPorId);
router.put("/alterar", ItensController.alterar);
router.delete("/excluir", ItensController.excluir);

export default router;