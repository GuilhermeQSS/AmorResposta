import e from "express";
import funcionarioRoutes from "./funcionariosRoute.js"
import loginRoutes from "./loginRoute.js"
const router = e.Router();

router.use("/funcionarios",funcionarioRoutes);
router.use("/login",loginRoutes);

router.get("/",(req,res)=>{
    res.redirect("index.html");
});


export default router;