import lotesControl from '../controllers/lotesControl.js';
import e from "express";
const router = e.Router();

router.post("/gravar", lotesControl.cadastrar);
router.get("/buscar", lotesControl.buscarPorId);
router.put("/alterar", lotesControl.alterar);
router.delete("/excluir", lotesControl.excluir);
router.get("/listarComItens", lotesControl.listarComItens);
router.post("/saida-doacao",lotesControl.sairDoacao);

export default router;