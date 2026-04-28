import FuncionarioControl from '../controllers/funcionarioControl.js';
import { autenticarAdmin } from '../middlewares/authMiddleware.js';
import e from "express";
const router = e.Router();

router.get("/listar",autenticarAdmin,FuncionarioControl.listar);
router.post("/gravar",autenticarAdmin,FuncionarioControl.cadastrar);
router.get("/buscar",autenticarAdmin,FuncionarioControl.buscarPorId);
router.put("/alterar",autenticarAdmin, FuncionarioControl.alterar);
router.delete("/excluir",autenticarAdmin, FuncionarioControl.excluir);

export default router;