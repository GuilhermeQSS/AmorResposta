import e from "express";
import funcionarioRoutes from "./funcionariosRoute.js"
import beneficiarioRoute from "./beneficiariosRoute.js"
import encontroRoutes from "./encontrosRoute.js";
import loginRoutes from "./loginRoute.js"
import { autenticarAdminOuVoluntario } from "../middlewares/authMiddleware.js";
const router = e.Router();

router.use("/beneficiarios",beneficiarioRoute);
router.use("/funcionarios",funcionarioRoutes);
router.use("/encontros",encontroRoutes);
router.use("/login",loginRoutes);
//router.use("/encontros", autenticarAdminOuVoluntario, encontroRoutes);

router.get("/",(req,res)=>{
    res.redirect("index.html");
});


export default router;
