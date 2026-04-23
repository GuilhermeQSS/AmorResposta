function normalizarValor(valor) {
    if (valor === "" || valor === null || valor === undefined) {
        return null;
    }

    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : null;
}

function normalizarTextoValor(valor) {
    return String(valor || "").trim().replace(",", ".");
}

class Despesa {
    constructor(id, valor, descricao) {
        this.id = id;
        this.valor = normalizarValor(valor);
        this.descricao = descricao;
    }

    static async listar(connection, filtro, valor) {
        let queryString = "select * from despesas where 1=1";
        const params = [];

        if (filtro) {
            queryString += " and des_descricao like ?";
            params.push(`%${filtro}%`);
        }

        const valorTexto = normalizarTextoValor(valor);
        if (valorTexto) {
            queryString += " and cast(des_valor as char) like ?";
            params.push(`%${valorTexto}%`);
        }

        queryString += " order by des_id desc";

        const [despesas] = await connection.query(queryString, params);
        return despesas.map((d) => new Despesa(
            d.des_id,
            d.des_valor,
            d.des_descricao
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
            despesa.des_valor,
            despesa.des_descricao
        );
    }

    async gravar(connection) {
        const queryString = `
            insert into despesas(
                des_valor,
                des_descricao
            ) values (?, ?);
        `;

        const [resultado] = await connection.query(queryString, [
            this.valor,
            this.descricao
        ]);

        return resultado;
    }

    async alterar(connection) {
        const queryString = `
            update despesas set
                des_valor = ?,
                des_descricao = ?
            where des_id = ?;
        `;

        const [resultado] = await connection.query(queryString, [
            this.valor,
            this.descricao,
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
