import Itens from "./itensModel.js";
import Ben from "./beneficiarioModel.js";

function ehAnteriorHoje(dataStr) {
    const data = new Date(dataStr);
    const hoje = new Date();

    // compara apenas ano, mês e dia ignorando horário e fuso
    return (
        data.getUTCFullYear() < hoje.getFullYear() ||
        (data.getUTCFullYear() === hoje.getFullYear() &&
        data.getUTCMonth() < hoje.getMonth()) ||
        (data.getUTCFullYear() === hoje.getFullYear() &&
        data.getUTCMonth() === hoje.getMonth() &&
        data.getUTCDate() < hoje.getDate())
    );
}

class Lotes{
    constructor(id, idItem, data, quantidade) {
        if (!idItem || !quantidade)
            throw new Error("[LotesModel]:Todos os campos devem ser preenchidos");

        this.id = id;
        this.idItem = idItem;
        this.data = data;
        this.quantidade = quantidade;
    }

    static async listar(connection, idItem, data) {
        let queryString = `SELECT * FROM lotes WHERE item_id = ?`;
        const valores = [idItem];

        if (data) {
            queryString += ` AND lot_validade BETWEEN CURDATE() AND ?`;
            valores.push(data);
        }

        queryString += ` ORDER BY lot_validade ASC`;

        const [lotes] = await connection.query(queryString, valores);

        const lotesList = lotes.map(e => new Lotes(
            e.lot_id,
            e.item_id,
            e.lot_validade,
            e.lot_qtde
        ));

        return lotesList;
    }

    static async listarComItens(connection, nome, data, zerado, vencidos) {
        let queryString = `
            SELECT * FROM lotes
            NATURAL JOIN itens
            WHERE 1=1
        `;
        const valores = [];

        if (nome) {
            queryString += ` AND item_nome LIKE ?`;
            valores.push(`%${nome}%`);
        }
        if (data) {
            queryString += ` AND lot_validade BETWEEN CURDATE() AND ?`;
            valores.push(data);
        }
        if (!zerado) {
            queryString += ` AND lot_qtde > 0`;
        }
        if (!vencidos) {
            queryString += ` AND (lot_validade IS NULL OR lot_validade >= CURDATE())`;
        }

        queryString += ` ORDER BY item_nome ASC`;

        const [lotes] = await connection.query(queryString, valores);

        return lotes.map(e => ({
            lot_id: e.lot_id,
            item_id: e.item_id,
            item_nome: e.item_nome,
            item_descricao: e.item_descricao,
            item_tipo: e.item_tipo,
            item_possuiValidade: e.item_possuiValidade,
            item_unidadeMedida: e.item_unidadeMedida,
            lot_validade: e.lot_validade,
            lot_qtde: e.lot_qtde
        }));
    }

    async alterar(connection) {
        const queryString = `
            UPDATE lotes SET
                item_id            = ?,
                lot_validade       = ?,
                lot_qtde           = ?
            WHERE lot_id = ?;
        `;

        const item = await Itens.buscarPorId(connection, this.idItem);
        if (item == null)
            throw new Error("Item não encontrado");

        if (item.item_possuiValidade == '0' || item.possuiValidade == false)
            this.data = null;
        else
            if(this.data == null)
                throw new Error("Validade é necessária");

        const valores = [
            this.idItem,
            this.data,
            this.quantidade,
            this.id
        ];

        const [resultado] = await connection.query(queryString, valores);
        return resultado;
    }

    async excluir(connection) {
        const queryString = `
            DELETE FROM lotes
            WHERE lot_id = ?;
        `;
        const valores = [this.id];
        const [resultado] = await connection.query(queryString, valores);
        return resultado;
    }

    static async buscarPorId(connection, id) {
        const queryString = `SELECT * FROM lotes WHERE lot_id = ?`;
        const valores = [id];
        const [[lote]] = await connection.query(queryString, valores);

        if (!lote)
            return null;

        return new Lotes(
            lote.lot_id,
            lote.item_id,
            lote.lot_validade,
            lote.lot_qtde
        );
    }

    async gravar(connection) {
        const item = await Itens.buscarPorId(connection, this.idItem);
        if (item == null)
            throw new Error("Item não encontrado");

        if (item.item_possuiValidade == '0' || item.possuiValidade == false)
            this.data = null;
        else
            if(this.data == null)
                throw new Error("Validade é necessária");
            else 
                if (this.data && ehAnteriorHoje(this.data))
                    throw new Error("Data anterior a atual");
        
        const queryString = `
            INSERT INTO lotes (
                item_id,
                lot_validade,
                lot_qtde
            ) VALUES (?, ?, ?);
        `;

        const valores = [
            this.idItem,
            this.data,
            this.quantidade
        ];

        const [resultado] = await connection.query(queryString, valores);
        return resultado;
    }

    //precisa iniciar uma transação antes de chamar!!!
    static async atualizarEstoque(connection, listaLotes) {
        for (let lItem of listaLotes) {
            const [[lote]] = await connection.query(
                `SELECT lot_qtde FROM lotes WHERE lot_id = ?`, [lItem.id]
            );

            if (!lote)
                throw new Error("[AT_ESTQ] lote " + lItem.id + " não encontrado");

            const novaQtd = lote.lot_qtde - lItem.quantidade;

            if (novaQtd < 0)
                throw new Error("[AT_ESTQ] lote " + lItem.id + ": quantidade negativa");

            await connection.query(
                `UPDATE lotes SET lot_qtde = ? WHERE lot_id = ?`,
                [novaQtd, lItem.id]
            );
        }
    }
}

export default Lotes;