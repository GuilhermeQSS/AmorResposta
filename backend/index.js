import funcionarioRoutes from "./routes/funcionariosRoute.js"
import e from "express";
const app = e();
const port = 3000

app.use(e.json());
app.use(e.urlencoded({extended:true}));
app.use(e.static("public"));
app.use("/funcionarios",funcionarioRoutes);

app.get("/",(req,res)=>{
    res.redirect("index.html");
});

app.listen(port,()=>{
    console.log(`Servidor iniciado em: http://localhost:${port}`);
});