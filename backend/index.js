import funcionarioRoutes from "./routes/funcionariosRoute.js"
import beneficiarioRoutes from "./routes/beneficiariosRoute.js"
import doacaoRoutes from "./routes/doacoesRoute.js"
import itensRoutes from "./routes/itensRoute.js"
import encontroRoutes from "./routes/encontrosRoute.js"
import documentoRoutes from "./routes/documentosRoute.js"
import e from "express";
import cors from "cors";
const app = e();
const port = 3000

app.use(cors());
app.use(e.json({ limit: "10mb" }));
app.use(e.urlencoded({extended:true, limit: "10mb"}));
app.use(e.static("public"));
app.use("/funcionarios",funcionarioRoutes);
app.use("/beneficiarios",beneficiarioRoutes);
app.use("/doacoes",doacaoRoutes);
app.use("/itens",itensRoutes);
app.use("/encontros",encontroRoutes);
app.use("/documentos", documentoRoutes);

app.get("/",(req,res)=>{    
    res.redirect("index.html");
});

app.listen(port,()=>{
    console.log(`Servidor iniciado em: http://localhost:${port}`);
});
