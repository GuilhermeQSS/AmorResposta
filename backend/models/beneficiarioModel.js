function limparTelefone(telefone = "") {
    return String(telefone).replace(/\D/g, "");
}

function limparNumero(numero = "") {
    return String(numero).replace(/\D/g, "");
}

function montarEnderecoResumo(estado, cidade, bairro, rua, numero) {
    const partes = [
        rua ? String(rua).trim() : "",
        numero ? String(numero).trim() : "",
        bairro ? String(bairro).trim() : "",
        cidade ? String(cidade).trim() : "",
        estado ? String(estado).trim() : ""
    ].filter(Boolean);

    return partes.join(", ");
}

class Beneficiario {
    constructor(id, nome, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
        this.id = id;
        this.nome = nome;

        if (arguments.length <= 6) {
            this.estado = "";
            this.cidade = "";
            this.bairro = "";
            this.rua = "";
            this.numero = "";
            this.endereco = String(arg3 || "").trim();
            this.telefone = limparTelefone(arg4);
            this.usuario = arg5;
            this.senha = arg6;
            return;
        }

        this.estado = String(arg3 || "").trim();
        this.cidade = String(arg4 || "").trim();
        this.bairro = String(arg5 || "").trim();
        this.rua = String(arg6 || "").trim();
        this.numero = limparNumero(arg7);
        this.telefone = limparTelefone(arg8);
        this.usuario = arg9;
        this.senha = arg10;
        this.endereco = montarEnderecoResumo(this.estado, this.cidade, this.bairro, this.rua, this.numero);
    }

    static fromRow(row) {
        const beneficiario = new Beneficiario(
            row.ben_id,
            row.ben_nome,
            row.ben_estado ?? "",
            row.ben_cidade ?? "",
            row.ben_bairro ?? "",
            row.ben_rua ?? row.ben_endereco ?? "",
            row.ben_numero ?? "",
            row.ben_telefone,
            row.ben_usuario,
            row.ben_senha
        );

        if (!beneficiario.endereco && row.ben_endereco) {
            beneficiario.endereco = String(row.ben_endereco).trim();
        }

        return beneficiario;
    }

    static async listar(connection, filtro, telefone) {
        let queryString = `select * from beneficiarios where 1=1`;
        const valores = [];

        if (filtro) {
            queryString += ` and (ben_nome like ? or ben_usuario like ?)`;
            valores.push(`%${filtro}%`, `%${filtro}%`);
        }

        const telefoneLimpo = limparTelefone(telefone);
        if (telefoneLimpo) {
            queryString += ` and replace(replace(replace(replace(replace(replace(replace(ben_telefone, '(', ''), ')', ''), '-', ''), ' ', ''), '.', ''), '+', ''), '/', '') like ?`;
            valores.push(`%${telefoneLimpo}%`);
        }

        queryString += ` order by ben_nome asc`;

        const [beneficiarios] = await connection.query(queryString, valores);
        return beneficiarios.map((b) => Beneficiario.fromRow(b));
    }

    async alterar(connection) {
        const queryString = `
            update beneficiarios set
                ben_nome = ?,
                ben_estado = ?,
                ben_cidade = ?,
                ben_bairro = ?,
                ben_rua = ?,
                ben_numero = ?,
                ben_endereco = ?,
                ben_telefone = ?,
                ben_usuario = ?,
                ben_senha = ?
            where ben_id = ?;
        `;

        const valores = [
            this.nome,
            this.estado || null,
            this.cidade || null,
            this.bairro || null,
            this.rua || null,
            this.numero ? Number(this.numero) : null,
            this.endereco || null,
            this.telefone,
            this.usuario,
            this.senha,
            this.id
        ];

        const [resultado] = await connection.query(queryString, valores);
        return resultado;
    }

    async excluir(connection) {
        const queryString = `delete from beneficiarios where ben_id = ?;`;
        const [resultado] = await connection.query(queryString, [this.id]);
        return resultado;
    }

    static async buscarPorUsuario(connection, usuario) {
        const queryString = `select * from beneficiarios where ben_usuario = ?`;
        const [[beneficiario]] = await connection.query(queryString, [usuario]);
        if (!beneficiario) {
            return null;
        }
        return Beneficiario.fromRow(beneficiario);
    }

    static async buscarPorId(connection, id) {
        const queryString = `select * from beneficiarios where ben_id = ?`;
        const [[beneficiario]] = await connection.query(queryString, [id]);
        if (!beneficiario) {
            return null;
        }
        return Beneficiario.fromRow(beneficiario);
    }

    async gravar(connection) {
        const queryString = `
            insert into beneficiarios(
                ben_nome,
                ben_estado,
                ben_cidade,
                ben_bairro,
                ben_rua,
                ben_numero,
                ben_endereco,
                ben_telefone,
                ben_usuario,
                ben_senha
            ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const valores = [
            this.nome,
            this.estado || null,
            this.cidade || null,
            this.bairro || null,
            this.rua || null,
            this.numero ? Number(this.numero) : null,
            this.endereco || null,
            this.telefone,
            this.usuario,
            this.senha
        ];

        const [resultado] = await connection.query(queryString, valores);
        return resultado;
    }
}

export default Beneficiario;
