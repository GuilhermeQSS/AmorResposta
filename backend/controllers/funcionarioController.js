import Funcionario from "../models/funcionarioModel.js";

class FuncionarioController{
    static async listar(req,res){
        try{
            let resp = await Funcionario.listar(req.query.filtro);
            return res.json(resp);
        }catch(err){
            return res.status(500).json({Erro:"Aconteceu um erro na hora de listar"})
        }
    }

    static async cadastrar(req,res){
        try{
            let funcionario = new Funcionario(
                0,
                req.body.nome,
                req.body.usuario,
                req.body.senha,
                req.body.cargo
            );
            let resp = await funcionario.gravar();
            return res.json(resp);
        }catch(err){
            return res.status(500).json({Erro:"Aconteceu um erro na hora de gravar"})
        }
        
    }
}

export default FuncionarioController;