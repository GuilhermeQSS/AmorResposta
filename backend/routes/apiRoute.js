import e from "express";
import locaisRoute from "./locaisRoute.js"
import funcionariosRoute from "./funcionariosRoute.js"
import beneficiarioRoute from "./beneficiariosRoute.js"
import encontrosRoute from "./encontrosRoute.js";
import loginRoute from "./loginRoute.js"
const router = e.Router();

router.use("/beneficiarios",beneficiarioRoute);
router.use("/funcionarios",funcionariosRoute);
router.use("/encontros",encontrosRoute);
router.use("/locais",locaisRoute);
router.use("/login",loginRoute);

router.get("/",(req,res)=>{
    res.redirect("index.html");
});

export default router;