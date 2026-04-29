import e from "express";
import funcionarioRoutes from "./funcionariosRoute.js"
import loginRoutes from "./loginRoute.js"
import encontroRoutes from "./encontrosRoute.js"
import { autenticarAdminOuVoluntario } from "../middlewares/authMiddleware.js";
const router = e.Router();

router.use("/funcionarios",funcionarioRoutes);
router.use("/login",loginRoutes);
router.use("/encontros", autenticarAdminOuVoluntario, encontroRoutes);

router.get("/",(req,res)=>{
    res.redirect("index.html");
});


export default router;
