import itensControl from '../controllers/itensControl.js';
import e from "express";
const router = e.Router();

router.get("/listar",itensControl.listar);
router.post("/gravar",itensControl.cadastrar);
router.get("/buscar",itensControl.buscarPorId);
router.put("/alterar", itensControl.alterar);
router.delete("/excluir", itensControl.excluir);

export default router;