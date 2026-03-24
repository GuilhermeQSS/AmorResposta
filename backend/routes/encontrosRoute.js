import EncontroController from '../controllers/encontroController.js';
import e from "express";
const router = e.Router();

router.get("/listar",EncontroController.listar);
router.post("/gravar",EncontroController.cadastrar);
router.get("/buscar",EncontroController.buscarPorId);
router.put("/alterar", EncontroController.alterar);
router.delete("/excluir", EncontroController.excluir);

export default router;