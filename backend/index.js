<<<<<<< HEAD
import funcionarioRoutes from "./routes/funcionariosRoute.js"
import beneficiarioRoutes from "./routes/beneficiariosRoute.js"
import doacaoRoutes from "./routes/doacoesRoute.js"
import itensRoutes from "./routes/itensRoute.js"
=======
import dotenv from "dotenv";
import apiRoutes from "./routes/apiRoute.js"
>>>>>>> devMain
import encontroRoutes from "./routes/encontrosRoute.js"
import beneficiarioRoutes from "./routes/beneficiariosRoute.js"
import despesasRoutes from "./routes/despesasRoute.js"
<<<<<<< HEAD
=======
import doacaoRoutes from "./routes/doacoesRoute.js"
import documentoRoutes from "./routes/documentosRoute.js"
import itensRoutes from "./routes/itensRoute.js"
>>>>>>> devMain
import lotesRoute from "./routes/lotesRoute.js"
import e from "express";
import cors from "cors";

dotenv.config({ path: new URL("./.env", import.meta.url) });

const app = e();
const port = 3000

app.use(cors());
app.use(e.json());
app.use(e.urlencoded({extended:true}));
app.use(e.static("public"));
<<<<<<< HEAD
app.use("/funcionarios",funcionarioRoutes);
app.use("/beneficiarios",beneficiarioRoutes);
app.use("/doacoes",doacaoRoutes);
app.use("/itens",itensRoutes);
app.use("/encontros",encontroRoutes);
app.use("/documentos", documentoRoutes);
app.use("/despesas", despesasRoutes);
app.use("/lotes",lotesRoute);

app.get("/",(req,res)=>{    
    res.redirect("index.html");
});

=======
app.use("/api",apiRoutes);
app.use("/encontros", encontroRoutes);
app.use("/beneficiarios", beneficiarioRoutes);
app.use("/despesas", despesasRoutes);
app.use("/doacoes", doacaoRoutes);
app.use("/documentos", documentoRoutes);
app.use("/itens", itensRoutes);
app.use("/lotes",lotesRoute);

>>>>>>> devMain
app.listen(port,()=>{
    console.log(`Servidor iniciado em: http://localhost:${port}`);
});
