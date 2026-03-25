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
        if (filtro) {
            queryString += ` where ben_nome like '%${filtro}%'`;
        }
        const [beneficiarios] = await connection.query(queryString);
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
                ben_nome = '${this.nome}',
                ben_endereco = '${this.endereco}',
                ben_telefone = '${this.telefone}',
                ben_usuario = '${this.usuario}',
                ben_senha = '${this.senha}'
            where ben_id = ${this.id};
        `;

        const [resultado] = await connection.query(queryString);
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

    static async buscarPorUsuario(usuario){
        let queryString = `select * from beneficiarios where ben_usuario = '${usuario}'`
        const [[beneficiario]] = await connection.query(queryString);
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

    static async buscarPorId(id){
        let queryString = `select * from beneficiarios where ben_id = ${id}`
        const [[beneficiario]] = await connection.query(queryString);
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

    async gravar(){
        let queryString = `
            insert into beneficiarios(
                ben_nome,
                ben_endereco,
                ben_telefone,
                ben_usuario,
                ben_senha
            ) values (?, ?, ?, ?, ?);
        `;

        const [resultado] = await connection.query(queryString, [
            this.nome,
            this.endereco,
            this.telefone,
            this.usuario,
            this.senha
        ]);

        return resultado;
    }
}

export default Beneficiario;
