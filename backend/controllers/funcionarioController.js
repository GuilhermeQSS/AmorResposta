import Funcionario from "../models/funcionarioModel.js";
import SingletonDB from "../db/SingletonDB.js";

class FuncionarioController{
    static async listar(req,res){
        try{
            const connection = await SingletonDB.getConnection();
            let resp = await Funcionario.listar(connection, req.query.filtroUsuario, req.query.filtroNome);
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json({Erro:"Aconteceu um erro na hora de listar"})
        }
    }

    static async buscarPorId(req,res){
        try{
            const connection = await SingletonDB.getConnection();
            let resp = await Funcionario.buscarPorId(connection, req.query.id);
            if(!resp){
                return res.status(500).json({Erro:`Não existe funcionario com id ${req.query.id}`})
            }else{
                return res.status(200).json(resp);
            }
        }catch(err){
            return res.status(500).json({Erro:"Aconteceu um erro na hora de buscar"})
        }
    }

    static async alterar(req, res){
        try {
            const connection = await SingletonDB.getConnection();
            const { id, nome, usuario, senha, cargo, camposAlterados } = req.body;
            if (!nome || !usuario || !senha || !cargo) {
                return res.status(500).json({ 
                    err: "Algum campo está vazio" ,
                    campos:{
                        fun_nome: !nome,
                        fun_usuario: !usuario,
                        fun_senha: !senha,
                        fun_cargo: !cargo
                    }
                });
            }
            if(camposAlterados.usuario && await Funcionario.buscarPorUsuario(connection, usuario) ){
                return res.status(500).json({
                    err: "Usuario já exite",
                });
            }
            const funcionario = new Funcionario(
                id,
                nome,
                usuario,
                senha,
                cargo
            );
            const resultado = await funcionario.alterar(connection);
            return res.status(200).json(resultado);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao alterar funcionário" });
        }
    }

    static async excluir(req, res){
        try {
            const connection = await SingletonDB.getConnection();
            const { id } = req.body;
            const funcionario = new Funcionario(id);
            const resultado = await funcionario.excluir(connection);
            res.status(200).json(resultado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ erro: "Erro ao excluir funcionário" });
        }
    }

    static async cadastrar(req,res){
        try{
            const connection = await SingletonDB.getConnection();
            const {nome, usuario, senha, cargo} = req.body;
            if (!nome || !usuario || !senha || !cargo) {
                return res.status(500).json({ 
                    err: "Algum campo está vazio" ,
                    campos:{
                        fun_nome: !nome,
                        fun_usuario: !usuario,
                        fun_senha: !senha,
                        fun_cargo: !cargo
                    }
                });
            }
            if(await Funcionario.buscarPorUsuario(connection, usuario)){
                return res.status(500).json({ 
                    err: "Usuario já exite",
                });
            }
            let funcionario = new Funcionario(
                0,
                nome,
                usuario,
                senha,
                cargo
            );
            let resp = await funcionario.gravar(connection);
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json(err);
        }
        
    }
}

export default FuncionarioController;
