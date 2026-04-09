import DespesaController from "../controllers/despesaController.js";
import e from "express";

const router = e.Router();

router.get("/listar", DespesaController.listar);
router.post("/gravar", DespesaController.cadastrar);
router.get("/buscar", DespesaController.buscarPorId);
router.put("/alterar", DespesaController.alterar);
router.delete("/excluir", DespesaController.excluir);

export default router;
