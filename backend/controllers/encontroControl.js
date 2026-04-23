import Encontro from "../models/encontroModel.js";
import SingletonDB from "../db/SingletonDB.js";

class EncontroController{
    static async listar(req,res){
        try{
            const connection = await SingletonDB.getConnection();
            let resp = await Encontro.listar(connection,req.query.filtroLocal);
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json({err: err.message});
        }
    }

    static async buscarPorId(req,res){
        try{
            const connection = await SingletonDB.getConnection();
            let resp = await Encontro.buscarPorId(connection,req.query.id);
            if(!resp){
                throw new Error(`Não existe encontro com id = ${req.query.id}`);
            }else{
                return res.status(200).json(resp);
            }
        }catch(err){
            return res.status(500).json({err: err.message});
        }
    }

    static async alterar(req, res){
        try {
            const connection = await SingletonDB.getConnection();
            const { id, data, disponibilidade, qtdeMax, qtde, local} = req.body;
            const encontroOriginal = await Encontro.buscarPorId(connection,id);
            if(!encontroOriginal){
                throw new Error("Id não existe");
            }
            // if(encontroOriginal.local !== local &&
            //     await Encontro.buscarPorLocal(connection,local) ){
            //     throw new Error("local já exite");
            // }
            const encontro = new Encontro(id,data,disponibilidade,qtdeMax,qtde,local);
            const resultado = await encontro.alterar(connection);
            return res.status(200).json(resultado);
        } catch (err) {
            return res.status(500).json({err: err.message});
        }
    }

    static async excluir(req, res){
        try {
            const connection = await SingletonDB.getConnection();
            let encontro = await Encontro.buscarPorId(connection,req.query.id);
            if(!encontro){
                throw new Error(`Não existe encontro com id = ${req.query.id}`);
            }
            const resultado = await encontro.excluir(connection);
            res.status(200).json(resultado);
        } catch (err) {
            return res.status(500).json({err: err.message});
        }
    }

    static async cadastrar(req,res){
        try{
            const connection = await SingletonDB.getConnection();
            const {data, disponibilidade, qtdeMax, qtde, local} = req.body;
            // if(await Funcionario.buscarPorLocal(connection,local)){
            //     throw new Error("Local já existe");
            // }
            let encontro = new Encontro(-1,data,disponibilidade,qtdeMax,qtde,local);
            let resp = await encontro.gravar(connection);
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json({err: err.message});
        }
        
    }
}

export default EncontroController;