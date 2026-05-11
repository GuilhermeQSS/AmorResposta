class Local {
    constructor(id, nome) {
        if (!id || !nome) {
            throw new Error("Todos os campos são obrigatórios");
        }
        this.id = id;
        this.nome = nome;
    }

    static async listar(connection, nome) {
        let queryString = `select * from locais where 1=1`;
        let valores = [];

        if (nome) {
            queryString += ` and loc_nome like ?`;
            valores.push(`%${nome}%`);
        }

        const [locais] = await connection.query(queryString, valores);
        let localList = [];
        locais.forEach(l => {
            localList.push(new Local(
                l.loc_id,
                l.loc_nome
            ));
        });
        return localList;
    }

    static async buscarPorId(connection, id) {
        let queryString = `select * from locais where loc_id = ?`;
        let valores = [id];

        const [[local]] = await connection.query(queryString, valores);
        if (!local) {
            return null;
        } else {
            return new Local(
                local.loc_id,
                local.loc_nome
            );
        }
    }

    async gravar(connection) {
        let queryString = `
            insert into locais(
                loc_nome
            ) values (?);
        `;
        let valores = [this.nome];
        const [resultado] = await connection.query(queryString, valores);
        return resultado;
    }

    async alterar(connection) {
        let queryString = `
            update locais set
                loc_nome = ?
            where loc_id = ?;
        `;
        let valores = [
            this.nome,
            this.id
        ];
        const [resultado] = await connection.query(queryString, valores);
        return resultado;
    }

    async excluir(connection) {
        let queryString = `
            delete from locais
            where loc_id = ?
        `;
        let valores = [this.id];
        const [resultado] = await connection.query(queryString, valores);
        return resultado;
    }
}

export default Local;