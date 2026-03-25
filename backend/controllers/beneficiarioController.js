import Beneficiario from "../models/beneficiarioModel.js";
import SingletonDB from "../db/SingletonDB.js";

class BeneficiarioController{
    static async listar(req,res){
        try{
            const connection = await SingletonDB.getConnection();
            let resp = await Beneficiario.listar(connection, req.query.filtro, req.query.telefone);
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json({err: err.message});
        }
    }

    static async buscarPorId(req,res){
        try{
            const connection = await SingletonDB.getConnection();
            let resp = await Beneficiario.buscarPorId(connection,req.query.id);
            if(!resp){
                throw new Error(`Não existe beneficiario com id = ${req.query.id}`);
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
            const { id, nome, endereco, telefone, usuario, senha } = req.body;
            const beneficiarioOriginal = await Beneficiario.buscarPorId(connection,id);
            if(!beneficiarioOriginal){
                throw new Error("Id não existe");
            }
            if(beneficiarioOriginal.usuario !== usuario &&
                await Beneficiario.buscarPorUsuario(connection,usuario) ){
                throw new Error("Usuario já exite");
            }
            const beneficiario = new Beneficiario(
                id,
                nome,
                endereco,
                telefone,
                usuario,
                senha
            );
            const resultado = await beneficiario.alterar(connection);
            return res.status(200).json(resultado);
        } catch (err) {
            return res.status(500).json({err: err.message});
        }
    }

    static async excluir(req, res){
        try {
            const connection = await SingletonDB.getConnection();
            let beneficiario = await Beneficiario.buscarPorId(connection,req.query.id);
            if(!beneficiario){
                throw new Error(`Não existe beneficiario com id = ${req.query.id}`);
            }
            const resultado = await beneficiario.excluir(connection);
            res.status(200).json(resultado);
        } catch (err) {
            return res.status(500).json({err: err.message});
        }
    }

    static async cadastrar(req,res){
        try{
            const connection = await SingletonDB.getConnection();
            const {nome, endereco, telefone, usuario, senha} = req.body;
            if(await Beneficiario.buscarPorUsuario(connection,usuario)){
                throw new Error("Usuario já existe");
            }
            let beneficiario = new Beneficiario(
                -1,
                nome,
                endereco,
                telefone,
                usuario,
                senha
            );
            let resp = await beneficiario.gravar(connection);
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json({err: err.message});
        }
        
    }
}

export default BeneficiarioController;
