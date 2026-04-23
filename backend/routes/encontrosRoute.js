import EncontroControl from '../controllers/encontroControl.js';
import { autenticarUsuario,autenticarAdmin } from '../middlewares/authMiddleware.js';
import e from "express";
const router = e.Router();

router.get("/listar",autenticarAdmin,EncontroControl.listar);
//router.post("/gravar",autenticarAdmin,EncontroControl.cadastrar);
router.get("/buscar",autenticarAdmin,EncontroControl.buscarPorId);
//router.put("/alterar",autenticarAdmin, EncontroControl.alterar);
//router.delete("/excluir",autenticarAdmin, EncontroControl.excluir);
router.post("/confirmar-participacao",autenticarUsuario,EncontroControl.confirmarParticipacao);
router.post("/cancelar-participacao",autenticarUsuario,EncontroControl.confirmarParticipacao);

export default router;