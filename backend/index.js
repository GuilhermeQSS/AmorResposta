import apiRoutes from "./routes/apiRoute.js"
import encontroRoutes from "./routes/encontrosRoute.js"
import beneficiarioRoutes from "./routes/beneficiariosRoute.js"
import despesasRoutes from "./routes/despesasRoute.js"
import doacaoRoutes from "./routes/doacoesRoute.js"
import documentoRoutes from "./routes/documentosRoute.js"
import itensRoutes from "./routes/itensRoute.js"
import e from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
const app = e();
const port = 3000

app.use(cors());
app.use(e.json());
app.use(e.urlencoded({extended:true}));
app.use(e.static("public"));
app.use("/api",apiRoutes);
app.use("/encontros", encontroRoutes);
app.use("/beneficiarios", beneficiarioRoutes);
app.use("/despesas", despesasRoutes);
app.use("/doacoes", doacaoRoutes);
app.use("/documentos", documentoRoutes);
app.use("/itens", itensRoutes);

app.listen(port,()=>{
    console.log(`Servidor iniciado em: http://localhost:${port}`);
});
