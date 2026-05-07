import dotenv from "dotenv";
import apiRoutes from "./routes/apiRoute.js"
import encontroRoutes from "./routes/encontrosRoute.js"
import beneficiarioRoutes from "./routes/beneficiariosRoute.js"
import despesasRoutes from "./routes/despesasRoute.js"
import doacaoRoutes from "./routes/doacoesRoute.js"
import documentoRoutes from "./routes/documentosRoute.js"
import itensRoutes from "./routes/itensRoute.js"
import lotesRoute from "./routes/lotesRoute.js"
import caixasRoutes from "./routes/caixasRoute.js"
import e from "express";
import cors from "cors";

dotenv.config({ path: new URL("./.env", import.meta.url) });

const app = e();
const port = 3000

app.use(cors());
app.use(e.json({ limit: "15mb" }));
app.use(e.urlencoded({ extended: true, limit: "15mb" }));
app.use(e.static("public"));
app.use("/api",apiRoutes);
app.use("/encontros", encontroRoutes);
app.use("/beneficiarios", beneficiarioRoutes);
app.use("/despesas", despesasRoutes);
app.use("/doacoes", doacaoRoutes);
app.use("/documentos", documentoRoutes);
app.use("/itens", itensRoutes);
app.use("/lotes",lotesRoute);
app.use("/caixas", caixasRoutes);
app.use("/doacoes", doacaoRoutes);
app.use("/beneficiarios", beneficiarioRoutes);

app.listen(port,()=>{
    console.log(`Servidor iniciado em: http://localhost:${port}`);
});
