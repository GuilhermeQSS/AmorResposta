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
}

export default Doacao;