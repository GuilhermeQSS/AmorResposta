import apiRoutes from "./routes/apiRoute.js"
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

app.listen(port,()=>{
    console.log(`Servidor iniciado em: http://localhost:${port}`);
});
