import DoacaoController from "../controllers/doacaoController.js";
import e from "express";

const router = e.Router();

router.get("/listar", DoacaoController.listar);
router.get("/buscar", DoacaoController.buscarPorId);
router.post("/gravar", DoacaoController.cadastrar);
router.put("/alterar", DoacaoController.alterar);
router.delete("/excluir", DoacaoController.excluir);

export default router;
