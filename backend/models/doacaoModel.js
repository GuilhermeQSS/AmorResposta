import connection from "../db/connection.js";

class Doacao {
    constructor(id, doadorNome, dataEntrega, origem, formaEntrega, tipo, observacao) {
        this.id = id;
        this.doadorNome = doadorNome;
        this.dataEntrega = dataEntrega;
        this.origem = origem;
        this.formaEntrega = formaEntrega;
        this.tipo = tipo;
        this.observacao = observacao;
    }

    static async listar(filtro) {
        let queryString = "select * from doacoes";
        const params = [];

        if (filtro) {
            queryString += " where doa_doadorNome like ?";
            params.push(`%${filtro}%`);
        }

        queryString += " order by doa_dataEntrega desc, doa_id desc";

        const [doacoes] = await connection.query(queryString, params);
        return doacoes.map((d) => new Doacao(
            d.doa_id,
            d.doa_doadorNome,
            d.doa_dataEntrega,
            d.doa_origem,
            d.doa_formaEntrega,
            d.doa_tipo,
            d.doa_observacao
        ));
    }

    static async buscarPorId(id) {
        const queryString = "select * from doacoes where doa_id = ?";
        const [[doacao]] = await connection.query(queryString, [id]);

        if (!doacao) {
            return null;
        }

        return new Doacao(
            doacao.doa_id,
            doacao.doa_doadorNome,
            doacao.doa_dataEntrega,
            doacao.doa_origem,
            doacao.doa_formaEntrega,
            doacao.doa_tipo,
            doacao.doa_observacao
        );
    }

    async gravar() {
        const queryString = `
            insert into doacoes(
                doa_doadorNome,
                doa_dataEntrega,
                doa_origem,
                doa_formaEntrega,
                doa_tipo,
                doa_observacao
            ) values (?, ?, ?, ?, ?, ?);
        `;

        const [resultado] = await connection.query(queryString, [
            this.doadorNome || null,
            this.dataEntrega,
            this.origem || null,
            this.formaEntrega,
            this.tipo,
            this.observacao || null
        ]);

        return resultado;
    }

    async alterar() {
        const queryString = `
            update doacoes set
                doa_doadorNome = ?,
                doa_dataEntrega = ?,
                doa_origem = ?,
                doa_formaEntrega = ?,
                doa_tipo = ?,
                doa_observacao = ?
            where doa_id = ?;
        `;

        const [resultado] = await connection.query(queryString, [
            this.doadorNome || null,
            this.dataEntrega,
            this.origem || null,
            this.formaEntrega,
            this.tipo,
            this.observacao || null,
            this.id
        ]);

        return resultado;
    }

    async excluir() {
        const queryString = "delete from doacoes where doa_id = ?";
        const [resultado] = await connection.query(queryString, [this.id]);
        return resultado;
    }
}

export default Doacao;
