import FuncionarioController from '../controllers/funcionarioControl.js';
import e from "express";
const router = e.Router();

router.get("/listar",FuncionarioController.listar);
router.post("/gravar",FuncionarioController.cadastrar);
router.get("/buscar",FuncionarioController.buscarPorId);
router.put("/alterar", FuncionarioController.alterar);
router.delete("/excluir", FuncionarioController.excluir);

export default router;