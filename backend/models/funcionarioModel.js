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
        let funcionarioList = [];
        funcionarios.forEach(f => {
            funcionarioList.push(new Funcionario(
                f.fun_id,
                f.fun_nome,
                f.fun_usuario,
                f.fun_senha,
                f.fun_cargo
            ));
        });
        return funcionarioList;
    }
    
    async alterar(){
        let queryString = `
            update funcionarios set
                fun_nome = '${this.nome}',
                fun_usuario = '${this.usuario}',
                fun_senha = '${this.senha}',
                fun_cargo = '${this.cargo}'
            where fun_id = ${this.id};
        `;

        const [resultado] = await connection.query(queryString);
        return resultado;
    }

    async excluir(){
        let queryString = `
            delete from funcionarios
            where fun_id = ${this.id};
        `;

        const [resultado] = await connection.query(queryString);
        return resultado;
    }

    static async buscarPorId(id){
        let queryString = `select * from funcionarios where fun_id = ${id}`
        const [[funcionario]] = await connection.query(queryString);
        if(!funcionario){
            return null;
        }else{
            return new Funcionario(
                funcionario.fun_id,
                funcionario.fun_nome,
                funcionario.fun_usuario,
                funcionario.fun_senha,
                funcionario.fun_cargo
            );
        }
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