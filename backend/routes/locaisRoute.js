import LocalControl from '../controllers/localControl.js';
import { autenticarAdmin } from '../middlewares/authMiddleware.js';
import e from "express";

const router = e.Router();

router.get("/listar", autenticarAdmin, LocalControl.listar);
router.post("/gravar", autenticarAdmin, LocalControl.cadastrar);
router.get("/buscar", autenticarAdmin, LocalControl.buscarPorId);
router.put("/alterar", autenticarAdmin, LocalControl.alterar);
router.delete("/excluir", autenticarAdmin, LocalControl.excluir);

export default router;