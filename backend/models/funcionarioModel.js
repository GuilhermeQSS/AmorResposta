class Funcionario{
    constructor(id, nome, usuario, senha, cargo){
        this.id = id;
        this.nome = nome;
        this.usuario = usuario;
        this.senha = senha;
        this.cargo = cargo;
    }
    
    static listar(req,res){
        connection.query('select * from funcionarios', 
        (err, results) => {
            if (err) throw err;
                res.send(results);
            }
        );
    }

    gravar(req,res){
        let queryString = 'insert into funcionarios values(#1,#2,#3,#4,#5);';
        queryString.replace('#1',this.id);
        queryString.replace('#2',this.nome);
        queryString.replace('#3',this.usuario);
        queryString.replace('#4',this.senha);
        queryString.replace('#5',this.cargo);
        connection.query(queryString, 
        (err, results) => {
            if (err) throw err;
                return results;
            }
        );
    }
}

export default Funcionario;