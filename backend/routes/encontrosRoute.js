<<<<<<< HEAD
import EncontroController from '../controllers/encontroControl.js';
=======
import EncontroController from '../controllers/encontroController.js';
>>>>>>> devMain
import e from "express";
const router = e.Router();

router.get("/listar",EncontroController.listar);
<<<<<<< HEAD
router.post("/gravar",EncontroController.cadastrar);
router.get("/buscar",EncontroController.buscarPorId);
router.put("/alterar", EncontroController.alterar);
router.delete("/excluir", EncontroController.excluir);

export default router;
=======
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
>>>>>>> devMain
