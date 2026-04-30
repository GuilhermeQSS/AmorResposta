import EncontroController from '../controllers/encontroController.js';
import EncontroControl from '../controllers/encontroControl.js'
import { autenticarBeneficiario,autenticarAdmin } from '../middlewares/authMiddleware.js';
import e from "express";
const router = e.Router();

router.get("/listar",EncontroController.listar);
router.get("/listar-como-beneficiario",autenticarBeneficiario,EncontroControl.listarComoBeneficiario);//
router.get("/buscar",EncontroController.buscarPorId);
router.get("/impacto", EncontroController.impacto);
router.get("/responsaveis", EncontroController.listarResponsaveis);
router.get("/substitutos", EncontroController.listarSubstitutos);
router.get("/funcionarios-disponiveis", EncontroController.listarFuncionariosDisponiveis);
router.post("/gravar",EncontroController.cadastrar);
router.post("/cancelar", EncontroController.cancelar);
router.post("/finalizar", EncontroController.finalizar);
router.post("/substituir-tutor", EncontroController.substituirTutor);
router.put("/alterar", EncontroController.alterar);
router.delete("/excluir", EncontroController.excluir);
router.post("/cadastrar-beneficiario",autenticarBeneficiario,EncontroControl.cadastrarBeneficiario);//
router.post("/retirar-beneficiario",autenticarBeneficiario,EncontroControl.retirarBeneficiario);//

export default router;
