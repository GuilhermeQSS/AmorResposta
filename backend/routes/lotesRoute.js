import lotesControl from '../controllers/lotesControl.js';
import e from "express";
const router = e.Router();

router.get("/listar", lotesControl.listar);
router.post("/gravar", lotesControl.cadastrar);
router.get("/buscar", lotesControl.buscarPorId);
router.put("/alterar", lotesControl.alterar);
router.delete("/excluir", lotesControl.excluir);
router.get("/listarComItens", lotesControl.listarComItens);

export default router;