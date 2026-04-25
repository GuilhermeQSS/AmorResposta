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

class Beneficiario{
    constructor(id,nome,endereco,telefone,usuario,senha,cpf) {
        if (!id || !nome || !usuario || !senha || !endereco || !cpf || !telefone) {
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
        this.endereco = endereco
        this.usuario = usuario;
        this.senha = senha;
        this.cpf = cpfLimpo;
        this.telefone = telefoneLimpo;
    }

    static async buscarPorId(connection, id){
        let queryString = `select * from beneficiarios where ben_id = ?`;
        let valores = [
            id
        ];
        const [[beneficiario]] = await connection.query(queryString,valores);
        if(!beneficiario){
            return null;
        }else{
            return new Beneficiario(
                beneficiario.ben_id,
                beneficiario.ben_nome,
                beneficiario.ben_endereco,
                beneficiario.ben_telefone,
                beneficiario.ben_usuario,
                beneficiario.ben_senha,
                beneficiario.ben_cpf,
            );
        }
    }

    static async buscarPorUsuario(connection, usuario){
        let queryString = `select * from beneficiarios where ben_usuario = ?`
        let valores = [
            usuario
        ];
        const [[beneficiario]] = await connection.query(queryString,valores);
        if(!beneficiario){
            return null;
        }else{
            return new Beneficiario(
                beneficiario.ben_id,
                beneficiario.ben_nome,
                beneficiario.ben_endereco,
                beneficiario.ben_telefone,
                beneficiario.ben_usuario,
                beneficiario.ben_senha,
                beneficiario.ben_cpf
            );
        }
    }

    async listarEncontros(connection){
        let queryString = `select enc_id,enc_data,enc_disponibilidade,enc_qtdeMax,enc_qtde,enc_local,enc_titulo,enc_descricao
        	from beneficiariosEncontros natural join encontros
	        where ben_id=?`
        let valores = [
            this.id
        ];
        const [beneficiarios] = await connection.query(queryString,valores);
        let encontrosList = [];
        beneficiarios.forEach(e => {
            encontrosList.push(new Beneficiario(
                e.enc_id,
                e.enc_data,
                e.enc_disponibilidade,
                e.enc_qtdeMax,
                e.enc_qtde,
                e.enc_local,
                e.enc_titulo,
                e.enc_descricao
            ));
        });
        return encontrosList;
    }
}

export default Beneficiario;
