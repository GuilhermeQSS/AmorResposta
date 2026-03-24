import EstoqueController from '../controllers/estoqueController.js';
import e from "express";
const router = e.Router();

router.get("/listar",EstoqueController.listar);
router.post("/gravar",EstoqueController.cadastrar);
router.get("/buscar",EstoqueController.buscarPorId);
router.put("/alterar", EstoqueController.alterar);
router.delete("/excluir", EstoqueController.excluir);

export default router;