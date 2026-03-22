import DoacaoController from "../controllers/doacaoController.js";
import e from "express";

const router = e.Router();

router.get("/listar", DoacaoController.listar);
router.post("/gravar", DoacaoController.cadastrar);

export default router;