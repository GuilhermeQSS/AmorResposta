import FuncionarioController from '../controllers/funcionarioController.js';
import e from "express";
const router = e.Router();

router.get("/listar",FuncionarioController.listar);
router.post("/gravar",FuncionarioController.cadastrar);

export default router;