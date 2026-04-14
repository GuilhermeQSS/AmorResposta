class Funcionario{
    constructor(id, nome, usuario, senha, cargo, cpf, telefone) {
        if (!id || !nome || !usuario || !senha || !cargo || !cpf || !telefone) {
            throw new Error("Todos os campos são obrigatórios");
        }

        if (!Funcionario.validarCPF(cpf)) {
            throw new Error("CPF inválido");
        }

        this.id = id;
        this.nome = nome;
        this.usuario = usuario;
        this.senha = senha;
        this.cargo = cargo;
        this.cpf = cpf;
        this.telefone = telefone;
    }

    static validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");

        if (cpf.length !== 11) return false;

        if (/^(\d)\1+$/.test(cpf)) return false;

        let soma = 0;
        let resto;

        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf[i]) * (10 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf[9])) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf[i]) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf[10])) return false;

        return true;
    }

    static async listar(connection, filtroNome, filtroUsuario) {
        let queryString = `select * from funcionarios`
        let valores = [];
        if (filtroNome) {
            queryString += ` where fun_nome like ?`;
            valores.push(`%${filtroNome}%`);
            if(filtroUsuario){
                queryString += ` and`;
            }
        }
        if(filtroUsuario){
            queryString += ` where fun_usuario like ?`;
            valores.push(`%${filtroUsuario}%`);
        }
        const [funcionarios] = await connection.query(queryString,valores);
        let funcionarioList = [];
        funcionarios.forEach(f => {
            funcionarioList.push(new Funcionario(
                f.fun_id,
                f.fun_nome,
                f.fun_usuario,
                f.fun_senha,
                f.fun_cargo,
                f.fun_cpf,
                f.fun_telefone
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
                fun_cargo = ?,
                fun_cpf = ?,
                fun_telefone = ?
            where fun_id = ?;
        `;
        let valores = [
            this.nome,
            this.usuario,
            this.senha,
            this.cargo,
            this.cpf,
            this.telefone,
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
                funcionario.fun_cargo,
                funcionario.fun_cpf,
                funcionario.fun_telefone
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
                funcionario.fun_cargo,
                funcionario.fun_cpf,
                funcionario.fun_telefone
            );
        }
    }

    async gravar(connection){
        let queryString = `
            insert into funcionarios(
                fun_nome,
                fun_usuario,
                fun_senha,
                fun_cargo,
                fun_cpf,
                fun_telefone
            ) values (?, ?, ?, ?, ?, ?);
        `;
        let valores = [
            this.nome,
            this.usuario,
            this.senha,
            this.cargo,
            this.cpf,
            this.telefone
        ];
        const [resultado] = await connection.query(queryString,valores);
        return resultado;
    }
}

export default Funcionario;
