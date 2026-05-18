import { Router } from "express";
import SaidaDoacaoControl from "../controllers/saidaDoacaoControl.js";

const router = Router();

router.get("/listar", SaidaDoacaoControl.listar);
router.get("/buscar", SaidaDoacaoControl.buscarPorId);
router.post("/cadastrar", SaidaDoacaoControl.cadastrar);
router.put("/alterar", SaidaDoacaoControl.alterar);
router.delete("/excluir", SaidaDoacaoControl.excluir);
router.get("/buscarLotes/:id", SaidaDoacaoControl.buscarLotesPorSaida);

export default router;