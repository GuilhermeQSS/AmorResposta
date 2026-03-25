class Beneficiario{
    constructor(id, nome, endereco, telefone, usuario, senha){
        this.id = id;
        this.nome = nome;
        this.endereco = endereco;
        this.telefone = telefone;
        this.usuario = usuario;
        this.senha = senha;
    }

    static async listar(connection, filtro, telefone) {
        let queryString = `select * from beneficiarios`
        let valores = [];
        const condicoes = [];

        if (filtro) {
            condicoes.push(`(
                lower(trim(ben_nome)) like lower(?)
                or lower(trim(ben_usuario)) like lower(?)
            )`);
            valores.push(`%${filtro}%`, `%${filtro}%`);
        }

        if (telefone) {
            condicoes.push(`replace(replace(replace(replace(trim(ben_telefone), '(', ''), ')', ''), '-', ''), ' ', '') like ?`);
            valores.push(`%${telefone}%`);
        }

        if (condicoes.length > 0) {
            queryString += ` where ${condicoes.join(" and ")}`;
        }
        const [beneficiarios] = await connection.query(queryString,valores);
        let beneficiarioList = [];
        beneficiarios.forEach(b => {
            beneficiarioList.push(new Beneficiario(
                b.ben_id,
                b.ben_nome,
                b.ben_endereco,
                b.ben_telefone,
                b.ben_usuario,
                b.ben_senha
            ));
        });
        return beneficiarioList;
    }
    
    async alterar(connection){
        let queryString = `
            update beneficiarios set
                ben_nome = ?,
                ben_endereco = ?,
                ben_telefone = ?,
                ben_usuario = ?,
                ben_senha = ? 
            where ben_id = ?;
        `;
        let valores = [
            this.nome,
            this.endereco,
            this.telefone,
            this.usuario,
            this.senha,
            this.id
        ];
        const [resultado] = await connection.query(queryString,valores);
        return resultado;
    }

    async excluir(connection){
        let queryString = `
            delete from beneficiarios
            where ben_id = ?;
        `;
        let valores = [
            this.id
        ];
        const [resultado] = await connection.query(queryString,valores);
        return resultado;
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
                beneficiario.ben_senha
            );
        }
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
                beneficiario.ben_senha
            );
        }
    }

    async gravar(connection){
        let queryString = `
            insert into beneficiarios(
                ben_nome,
                ben_endereco,
                ben_telefone,
                ben_usuario,
                ben_senha
            ) values (?, ?, ?, ?, ?);
        `;
        let valores = [
            this.nome,
            this.endereco,
            this.telefone,
            this.usuario,
            this.senha
        ];
        const [resultado] = await connection.query(queryString,valores);
        return resultado;
    }
}

export default Beneficiario;
