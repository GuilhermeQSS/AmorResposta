import connection from "../db/connection.js"

class Funcionario{
    constructor(id, nome, usuario, senha, cargo){
        this.id = id;
        this.nome = nome;
        this.usuario = usuario;
        this.senha = senha;
        this.cargo = cargo;
    }

    static async listar(filtro) {
        let queryString = `select * from funcionarios`
        if (filtro) {
            queryString += ` where fun_nome like '%${filtro}%'`;
        }
        const [funcionarios] = await connection.query(queryString);
        return funcionarios;
    }

    async gravar(){
        let queryString = `insert into funcionarios(
            fun_nome,
            fun_usuario,
            fun_senha,
            fun_cargo
        )values(
            '${this.nome}',
            '${this.usuario}',
            '${this.senha}',
            '${this.cargo}'
        );`;
        const [coisa] = await connection.query(queryString);
        return coisa
    }
    static 
}

export default Funcionario;