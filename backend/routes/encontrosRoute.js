import EncontroController from '../controllers/encontroController.js';
import e from "express";
const router = e.Router();

router.get("/listar",EncontroController.listar);
router.get("/buscar",EncontroController.buscarPorId);
router.get("/impacto", EncontroController.impacto);
router.get("/responsaveis", EncontroController.listarResponsaveis);
router.get("/substitutos", EncontroController.listarSubstitutos);
router.get("/funcionarios-disponiveis", EncontroController.listarFuncionariosDisponiveis);
router.post("/gravar",EncontroController.cadastrar);
router.post("/cancelar", EncontroController.cancelar);
router.post("/substituir-tutor", EncontroController.substituirTutor);
router.put("/alterar", EncontroController.alterar);
router.delete("/excluir", EncontroController.excluir);

export default router;
