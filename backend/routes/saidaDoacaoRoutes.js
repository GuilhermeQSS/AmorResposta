import { Router } from "express";
import SaidaDoacaoControl from "../controllers/saidaDoacaoControl.js";

const router = Router();

router.get("/listar", SaidaDoacaoControl.listar);
router.get("/buscar/:id", SaidaDoacaoControl.buscarPorId);
router.post("/cadastrar", SaidaDoacaoControl.cadastrar);
router.put("/alterar/:id", SaidaDoacaoControl.alterar);
router.delete("/excluir/:id", SaidaDoacaoControl.excluir);

export default router;