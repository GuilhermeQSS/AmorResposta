class Funcionario{
    constructor(id, nome, usuario, senha, cargo){
        if(!id || !nome || !usuario || !senha || !cargo){
            throw new Error("Todos os campos são obrigatórios");;
        }
        this.id = id;
        this.nome = nome;
        this.usuario = usuario;
        this.senha = senha;
        this.cargo = cargo;
    }

    static async listar(connection, filtro) {
        let queryString = `select * from funcionarios`
        let valores = [];
        if (filtro) {
            queryString += ` where fun_nome like ?`;
            valores.push(`%${filtro}%`);
        }
        const [funcionarios] = await connection.query(queryString,valores);
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
    
    async alterar(connection){
        let queryString = `
            update funcionarios set
                fun_nome = ?,
                fun_usuario = ?,
                fun_senha = ?,
                fun_cargo = ? 
            where fun_id = ?;
        `;
        let valores = [
            this.nome,
            this.usuario,
            this.senha,
            this.cargo,
            this.id
        ];
        const [resultado] = await connection.query(queryString,valores);
        return resultado;
    }

    async excluir(connection){
        let queryString = `
            delete from funcionarios
            where fun_id = ?;
        `;
        let valores = [
            this.id
        ];
        const [resultado] = await connection.query(queryString,valores);
        return resultado;
    }

    static async buscarPorUsuario(connection, usuario){
        let queryString = `select * from funcionarios where fun_usuario = ?`
        let valores = [
            usuario
        ];
        const [[funcionario]] = await connection.query(queryString,valores);
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
    static async buscarPorId(connection, id){
        let queryString = `select * from funcionarios where fun_id = ?`;
        let valores = [
            id
        ];
        const [[funcionario]] = await connection.query(queryString,valores);
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

    async gravar(connection){
        let queryString = `
            insert into funcionarios(
                fun_nome,
                fun_usuario,
                fun_senha,
                fun_cargo
            ) values (?, ?, ?, ?);
        `;
        let valores = [
            this.nome,
            this.usuario,
            this.senha,
            this.cargo
        ];
        const [resultado] = await connection.query(queryString,valores);
        return resultado;
    }
}

export default Funcionario;
