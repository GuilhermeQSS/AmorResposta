import CaixaController from "../controllers/caixaController.js";
import e from "express";

const router = e.Router();

router.get("/listar", CaixaController.listar);
router.post("/gravar", CaixaController.cadastrar);
router.get("/buscar", CaixaController.buscarPorId);
router.put("/alterar", CaixaController.alterar);

export default router;
