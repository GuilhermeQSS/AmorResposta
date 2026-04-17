import FuncionarioControl from '../controllers/funcionarioControl.js';
import e from "express";
const router = e.Router();

router.get("/listar",FuncionarioControl.listar);
router.post("/gravar",FuncionarioControl.cadastrar);
router.get("/buscar",FuncionarioControl.buscarPorId);
router.put("/alterar", FuncionarioControl.alterar);
router.delete("/excluir", FuncionarioControl.excluir);

export default router;