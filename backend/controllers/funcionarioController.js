import Funcionario from "../models/funcionarioModel.js";

class FuncionarioController{
    static listar(req,res){
        return Funcionario.listar();
    }

    static cadastrar(req,res){
        let funcionario = new Funcionario(req.body);
        funcionario.gravar();
    }
}

export default FuncionarioController;