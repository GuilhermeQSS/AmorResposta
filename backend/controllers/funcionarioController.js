import connection from "../db/connection.js";
import Funcionario from "../models/funcionarioModel.js";

class FuncionarioController{
    static listar(req,res){
        connection.query('select * from funcionarios', 
        (err, results) => {
            if (err) throw err;
                res.send(results);
            }
        );
    }

    static gravar(req,res){
        funcionario = new Funcionario(req.body);
        let queryString = 'insert into funcionarios values(#1,#2,#3,#4,#5);';
        queryString.replace('#1',funcionario.id);
        queryString.replace('#2',funcionario.nome);
        queryString.replace('#3',funcionario.usuario);
        queryString.replace('#4',funcionario.senha);
        queryString.replace('#5',funcionario.cargo);
        connection.query(queryString, 
        (err, results) => {
            if (err) throw err;
                return results;
            }
        );
    }
}

export default FuncionarioController;