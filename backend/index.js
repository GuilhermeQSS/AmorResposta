import funcionarioRoutes from "./routes/funcionariosRoute.js"
import beneficiarioRoutes from "./routes/beneficiariosRoute.js"
import doacaoRoutes from "./routes/doacoesRoute.js"
import itensRoutes from "./routes/itensRoute.js"
import encontroRoutes from "./routes/encontrosRoute.js"
import documentoRoutes from "./routes/documentosRoute.js"
import despesasRoutes from "./routes/despesasRoute.js"
import connection from "./db/connection.js";
import e from "express";
import cors from "cors";
const app = e();
const port = 3000

async function sincronizarSchemaDespesas() {
    if (!connection) {
        return;
    }

    try {
        const [colunas] = await connection.query("show columns from despesas like 'des_valor'");
        if (colunas.length === 0) {
            await connection.query("alter table despesas add column des_valor decimal(10,2) null after des_id");
        }
    } catch (err) {
        console.log("Erro ao sincronizar despesas:", err.message);
    }
}

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
app.use("/despesas", despesasRoutes);

app.get("/",(req,res)=>{    
    res.redirect("index.html");
});

await sincronizarSchemaDespesas();

app.listen(port,()=>{
    console.log(`Servidor iniciado em: http://localhost:${port}`);
});
