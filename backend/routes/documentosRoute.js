import DocumentoController from "../controllers/documentoController.js";
import e from "express";

const router = e.Router();

router.get("/listar", DocumentoController.listar);
router.get("/buscar", DocumentoController.buscarPorId);
router.post("/gravar", DocumentoController.cadastrar);
router.put("/alterar", DocumentoController.alterar);
router.delete("/excluir", DocumentoController.excluir);

export default router;
