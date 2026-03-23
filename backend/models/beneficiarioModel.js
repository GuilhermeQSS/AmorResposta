import connection from "../db/connection.js"

class Beneficiario{
    constructor(id, nome, endereco, telefone, usuario, senha){
        this.id = id;
        this.nome = nome;
        this.endereco = endereco;
        this.telefone = telefone;
        this.usuario = usuario;
        this.senha = senha;
    }

    static async listar(filtro) {
        let queryString = `select * from beneficiarios`
        const params = [];
        if (filtro) {
            queryString += ` where ben_usuario like ?`;
            params.push(`%${filtro}%`);
        }
        const [beneficiarios] = await connection.query(queryString, params);
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
    
    async alterar(){
        let queryString = `
            update beneficiarios set
                ben_nome = ?,
                ben_endereco = ?,
                ben_telefone = ?,
                ben_usuario = ?,
                ben_senha = ?
            where ben_id = ?;
        `;

        const [resultado] = await connection.query(queryString, [
            this.nome,
            this.endereco,
            this.telefone,
            this.usuario,
            this.senha,
            this.id
        ]);
        return resultado;
    }

    async excluir(){
        let queryString = `
            delete from beneficiarios
            where ben_id = ${this.id};
        `;

        const [resultado] = await connection.query(queryString);
        return resultado;
    }

    static async buscarPorId(id){
        let queryString = `select * from beneficiarios where ben_id = ?`
        const [[beneficiario]] = await connection.query(queryString, [id]);
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

    static async buscarPorUsuario(usuario, excluirId = null) {
        let queryString = `
            select * from beneficiarios
            where lower(trim(ben_usuario)) = lower(trim(?))
        `;
        const params = [usuario];

        if (excluirId !== null && excluirId !== undefined) {
            queryString += ` and ben_id <> ?`;
            params.push(excluirId);
        }

        const [[beneficiario]] = await connection.query(queryString, params);

        if(!beneficiario){
            return null;
        }

        return new Beneficiario(
            beneficiario.ben_id,
            beneficiario.ben_nome,
            beneficiario.ben_endereco,
            beneficiario.ben_telefone,
            beneficiario.ben_usuario,
            beneficiario.ben_senha
        );
    }

    async gravar(){
        const [[{ novo_id }]] = await connection.query(`
            select coalesce(max(ben_id), 0) + 1 as novo_id
            from beneficiarios;
        `);

        let queryString = `insert into beneficiarios(
            ben_id,
            ben_nome,
            ben_endereco,
            ben_telefone,
            ben_usuario,
            ben_senha
        )values(
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        );`;
        const [coisa] = await connection.query(queryString, [
            novo_id,
            this.nome,
            this.endereco,
            this.telefone,
            this.usuario,
            this.senha
        ]);
        return coisa
    }
}

export default Beneficiario;
