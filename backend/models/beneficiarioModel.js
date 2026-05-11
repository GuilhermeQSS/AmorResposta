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

class Beneficiario {
    constructor(id, nome, cpf, telefone, estado, cidade, bairro, rua, numero, usuario, senha) {
        if (!id || !nome || !cpf || !telefone || !estado || !cidade || !bairro || !rua || !numero || !usuario || !senha) {
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

        if (String(estado).length !== 2) {
            throw new Error("Estado inválido (deve conter exatamente 2 caracteres, ex: SP)");
        }

        if (isNaN(numero) || Number(numero) <= 0) {
            throw new Error("Número do endereço inválido");
        }

        this.id = id;
        this.nome = nome;
        this.cpf = cpfLimpo;
        this.telefone = telefoneLimpo;
        this.estado = estado;
        this.cidade = cidade;
        this.bairro = bairro;
        this.rua = rua;
        this.numero = numero;
        this.usuario = usuario;
        this.senha = senha;
    }

    static async listar(connection, nome, usuario) {
        let queryString = `select * from beneficiarios where 1=1`;
        let valores = [];

        if (nome) {
            queryString += ` and ben_nome like ?`;
            valores.push(`%${nome}%`);
        }
        if (usuario) {
            queryString += ` and ben_usuario like ?`;
            valores.push(`%${usuario}%`);
        }

        const [beneficiarios] = await connection.query(queryString, valores);
        let beneficiarioList = [];
        beneficiarios.forEach(b => {
            beneficiarioList.push(new Beneficiario(
                b.ben_id,
                b.ben_nome,
                b.ben_cpf,
                b.ben_telefone,
                b.ben_estado,
                b.ben_cidade,
                b.ben_bairro,
                b.ben_rua,
                b.ben_numero,
                b.ben_usuario,
                b.ben_senha
            ));
        });
        return beneficiarioList;
    }

    static async buscarPorId(connection, id) {
        let queryString = `select * from beneficiarios where ben_id = ?`;
        let valores = [id];

        const [[beneficiario]] = await connection.query(queryString, valores);
        if (!beneficiario) {
            return null;
        } else {
            return new Beneficiario(
                beneficiario.ben_id,
                beneficiario.ben_nome,
                beneficiario.ben_cpf,
                beneficiario.ben_telefone,
                beneficiario.ben_estado,
                beneficiario.ben_cidade,
                beneficiario.ben_bairro,
                beneficiario.ben_rua,
                beneficiario.ben_numero,
                beneficiario.ben_usuario,
                beneficiario.ben_senha
            );
        }
    }

    static async buscarPorUsuario(connection, usuario) {
        let queryString = `select * from beneficiarios where ben_usuario = ?`;
        let valores = [usuario];

        const [[beneficiario]] = await connection.query(queryString, valores);
        if (!beneficiario) {
            return null;
        } else {
            return new Beneficiario(
                beneficiario.ben_id,
                beneficiario.ben_nome,
                beneficiario.ben_cpf,
                beneficiario.ben_telefone,
                beneficiario.ben_estado,
                beneficiario.ben_cidade,
                beneficiario.ben_bairro,
                beneficiario.ben_rua,
                beneficiario.ben_numero,
                beneficiario.ben_usuario,
                beneficiario.ben_senha
            );
        }
    }

    async gravar(connection) {
        let queryString = `
            insert into beneficiarios(
                ben_nome,
                ben_cpf,
                ben_telefone,
                ben_estado,
                ben_cidade,
                ben_bairro,
                ben_rua,
                ben_numero,
                ben_usuario,
                ben_senha
            ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        let valores = [
            this.nome,
            this.cpf,
            this.telefone,
            this.estado,
            this.cidade,
            this.bairro,
            this.rua,
            this.numero,
            this.usuario,
            this.senha
        ];
        const [resultado] = await connection.query(queryString, valores);
        return resultado;
    }

    async alterar(connection) {
        let queryString = `
            update beneficiarios set
                ben_nome = ?,
                ben_cpf = ?,
                ben_telefone = ?,
                ben_estado = ?,
                ben_cidade = ?,
                ben_bairro = ?,
                ben_rua = ?,
                ben_numero = ?,
                ben_usuario = ?,
                ben_senha = ?
            where ben_id = ?;
        `;
        let valores = [
            this.nome,
            this.cpf,
            this.telefone,
            this.estado,
            this.cidade,
            this.bairro,
            this.rua,
            this.numero,
            this.usuario,
            this.senha,
            this.id
        ];
        const [resultado] = await connection.query(queryString, valores);
        return resultado;
    }

    async excluir(connection) {
        let queryString = `
            delete from beneficiarios
            where ben_id = ?
        `;
        let valores = [this.id];
        const [resultado] = await connection.query(queryString, valores);
        return resultado;
    }
}

export default Beneficiario;