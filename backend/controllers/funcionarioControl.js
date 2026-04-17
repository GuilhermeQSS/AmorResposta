import Funcionario from "../models/funcionarioModel.js";
import SingletonDB from "../db/SingletonDB.js";

class FuncionarioControl{
    static async listar(req,res){
        try{
            const connection = await SingletonDB.getConnection();
            let resp = await Funcionario.listar(connection,req.query.filtroNome,req.query.filtroUsuario);
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json({err: err.message});
        }
    }

    static async buscarPorId(req,res){
        try{
            const connection = await SingletonDB.getConnection();
            let resp = await Funcionario.buscarPorId(connection,req.query.id);
            if(!resp){
                throw new Error(`Não existe funcionario com id = ${req.query.id}`);
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
            const { id, nome, usuario, senha, cargo, cpf, telefone} = req.body;
            const funcionarioOriginal = await Funcionario.buscarPorId(connection,id);
            if(!funcionarioOriginal){
                throw new Error("Id não existe");
            }
            if(funcionarioOriginal.usuario !== usuario &&
                await Funcionario.buscarPorUsuario(connection,usuario) ){
                throw new Error("Usuario já exite");
            }
            const funcionario = new Funcionario(id,nome,usuario,senha,cargo,cpf,telefone);
            const resultado = await funcionario.alterar(connection);
            return res.status(200).json(resultado);
        } catch (err) {
            return res.status(500).json({err: err.message});
        }
    }

    static async excluir(req, res){
        try {
            const connection = await SingletonDB.getConnection();
            let funcionario = await Funcionario.buscarPorId(connection,req.query.id);
            if(!funcionario){
                throw new Error(`Não existe funcionario com id = ${req.query.id}`);
            }
            const resultado = await funcionario.excluir(connection);
            res.status(200).json(resultado);
        } catch (err) {
            return res.status(500).json({err: err.message});
        }
    }

    static async cadastrar(req,res){
        try{
            const connection = await SingletonDB.getConnection();
            const {nome, usuario, senha, cargo, cpf, telefone} = req.body;
            if(await Funcionario.buscarPorUsuario(connection,usuario)){
                throw new Error("Usuario já existe");
            }
            let funcionario = new Funcionario(-1,nome,usuario,senha,cargo,cpf,telefone);
            let resp = await funcionario.gravar(connection);
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json({err: err.message});
        }
        
    }
}

export default FuncionarioControl;