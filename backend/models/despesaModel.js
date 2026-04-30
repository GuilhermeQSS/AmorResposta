class Despesa {
    constructor(id, descricao, categoria) {
        this.id = id;
        this.descricao = descricao;
        this.categoria = categoria;
    }

    static async listar(connection, filtro) {
        let queryString = "select * from despesas where 1=1";
        const params = [];

        if (filtro) {
            queryString += " and des_descricao like ?";
            params.push(`%${filtro}%`);
        }

        queryString += " order by des_descricao asc, des_id asc";

        const [despesas] = await connection.query(queryString, params);
        return despesas.map((d) => new Despesa(
            d.des_id,
            d.des_descricao,
            d.des_categoria
        ));
    }

    static async buscarPorId(connection, id) {
        const queryString = "select * from despesas where des_id = ?";
        const [[despesa]] = await connection.query(queryString, [id]);

        if (!despesa) {
            return null;
        }

        return new Despesa(
            despesa.des_id,
            despesa.des_descricao,
            despesa.des_categoria
        );
    }

    async gravar(connection) {
        const queryString = `
            insert into despesas(
                des_descricao,
                des_categoria
            ) values (?, ?);
        `;

        const [resultado] = await connection.query(queryString, [this.descricao, this.categoria]);

        return resultado;
    }

    async alterar(connection) {
        const queryString = `
            update despesas set
                des_descricao = ?,
                des_categoria = ?
            where des_id = ?;
        `;

        const [resultado] = await connection.query(queryString, [
            this.descricao,
            this.categoria,
            this.id
        ]);

        return resultado;
    }

    async excluir(connection) {
        const queryString = "delete from despesas where des_id = ?";
        const [resultado] = await connection.query(queryString, [this.id]);
        return resultado;
    }
}

export default Despesa;
