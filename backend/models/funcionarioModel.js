function validarCPF(cpf) {
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

class Funcionario{
    constructor(id,nome,cargo,cpf,telefone,usuario,senha) {
        if (!id || !nome || !cargo || !cpf || !telefone || !usuario || !senha) {
            throw new Error("Todos os campos são obrigatórios");
        }

        const cpfLimpo = String(cpf).replace(/\D/g, "");
        if (!validarCPF(cpfLimpo)) {
            throw new Error("CPF inválido");
        }

        const telefoneLimpo = String(telefone).replace(/\D/g, "");
        if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
            throw new Error("Telefone inválido (deve conter 10 ou 11 dígitos numéricos)");
        }

        this.id = id;
        this.nome = nome;
        this.cargo = cargo;
        this.cpf = cpfLimpo;
        this.telefone = telefoneLimpo;
        this.usuario = usuario;
        this.senha = senha;
    }

    static async listar(connection, nome, usuario) {
        let queryString = `select * from funcionarios where 1=1`
        let valores = [];
        if (nome) {
            queryString += ` and fun_nome like ?`;
            valores.push(`%${nome}%`);
        }
        if(usuario){
            queryString += ` and fun_usuario like ?`;
            valores.push(`%${usuario}%`);
        }
        const [funcionarios] = await connection.query(queryString,valores);
        let funcionarioList = [];
        funcionarios.forEach(f => {
            funcionarioList.push(new Funcionario(
                f.fun_id,
                f.fun_nome,
                f.fun_cargo,
                f.fun_cpf,
                f.fun_telefone,
                f.fun_usuario,
                f.fun_senha
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
            where fun_id = ?
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
                funcionario.fun_cargo,
                funcionario.fun_cpf,
                funcionario.fun_telefone,
                funcionario.fun_usuario,
                funcionario.fun_senha
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
                funcionario.fun_cargo,
                funcionario.fun_cpf,
                funcionario.fun_telefone,
                funcionario.fun_usuario,
                funcionario.fun_senha
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
