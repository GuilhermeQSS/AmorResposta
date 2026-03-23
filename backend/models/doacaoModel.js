import connection from "../db/connection.js";

class Doacao {
    constructor(id, doadorNome, dataEntrega, origem, formaEntrega, tipo, quantidadeItens, observacao) {
        this.id = id;
        this.doadorNome = Doacao.normalizarDoadorNome(doadorNome);
        this.dataEntrega = dataEntrega;
        this.origem = Doacao.normalizarTextoLivre(origem);
        this.formaEntrega = formaEntrega;
        this.tipo = tipo;
        this.quantidadeItens = Doacao.normalizarQuantidadeItens(quantidadeItens);
        this.observacao = Doacao.normalizarTextoLivre(observacao);
    }

    static normalizarDoadorNome(doadorNome) {
        const nome = String(doadorNome || "").trim();
        return nome || "anonimo";
    }

    static normalizarTextoLivre(valor) {
        const texto = String(valor || "").trim();
        return texto || null;
    }

    static normalizarQuantidadeItens(quantidadeItens) {
        const quantidade = Number(quantidadeItens);
        return Number.isInteger(quantidade) && quantidade > 0 ? quantidade : null;
    }

    static async listar(filtro, tipoFiltro = "doador") {
        let queryString = "select * from doacoes";
        const params = [];

        if (filtro) {
            if (tipoFiltro === "data") {
                queryString += " where doa_dataEntrega = ?";
                params.push(filtro);
            } else {
                queryString += " where coalesce(doa_doadorNome, 'anonimo') like ?";
                params.push(`%${filtro}%`);
            }
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
            d.doa_quantidadeItens,
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
            doacao.doa_quantidadeItens,
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
                doa_quantidadeItens,
                doa_observacao
            ) values (?, ?, ?, ?, ?, ?, ?);
        `;

        const [resultado] = await connection.query(queryString, [
            this.doadorNome,
            this.dataEntrega,
            this.origem,
            this.formaEntrega,
            this.tipo,
            this.quantidadeItens,
            this.observacao
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
                doa_quantidadeItens = ?,
                doa_observacao = ?
            where doa_id = ?;
        `;

        const [resultado] = await connection.query(queryString, [
            this.doadorNome,
            this.dataEntrega,
            this.origem,
            this.formaEntrega,
            this.tipo,
            this.quantidadeItens,
            this.observacao,
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
