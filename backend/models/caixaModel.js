class Caixa {
    constructor(id, data, turno, suprimentoInicial, status = "aberto") {
        this.id = id;
        this.data = data;
        this.turno = turno;
        this.suprimentoInicial = suprimentoInicial;
        this.status = status;
    }

    static async listar(connection, filtro) {
        let queryString = "select * from caixas where 1=1";
        const params = [];

        if (filtro) {
            queryString += " and cai_turno like ?";
            params.push(`%${filtro}%`);
        }

        queryString += " order by cai_data desc, cai_id desc";

        const [caixas] = await connection.query(queryString, params);
        return caixas.map((c) => new Caixa(
            c.cai_id,
            c.cai_data,
            c.cai_turno,
            c.cai_suprimentoInicial,
            c.cai_status
        ));
    }

    static async buscarPorId(connection, id) {
        const queryString = "select * from caixas where cai_id = ?";
        const [[caixa]] = await connection.query(queryString, [id]);

        if (!caixa) {
            return null;
        }

        return new Caixa(
            caixa.cai_id,
            caixa.cai_data,
            caixa.cai_turno,
            caixa.cai_suprimentoInicial,
            caixa.cai_status
        );
    }

    async gravar(connection) {
        const queryString = `
            insert into caixas(
                cai_data,
                cai_turno,
                cai_suprimentoInicial,
                cai_status
            ) values (?, ?, ?, ?);
        `;

        const [resultado] = await connection.query(queryString, [
            this.data,
            this.turno,
            this.suprimentoInicial,
            this.status
        ]);

        return resultado;
    }

    async alterar(connection) {
        const queryString = `
            update caixas set
                cai_data = ?,
                cai_turno = ?,
                cai_suprimentoInicial = ?,
                cai_status = ?
            where cai_id = ?;
        `;

        const [resultado] = await connection.query(queryString, [
            this.data,
            this.turno,
            this.suprimentoInicial,
            this.status,
            this.id
        ]);

        return resultado;
    }
}

export default Caixa;
