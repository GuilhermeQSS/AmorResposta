import Ben from "./beneficiarioModel.js";
import Lotes from "./lotesModel.js";

class SaidaDoacao {
    constructor(lotdId, benId, data) {
        if (!benId)
            throw new Error("Beneficiario não informado");
        this.lotdId = lotdId;
        this.benId = benId;
        this.data = data;
    }

    static async sdCadastro(connection, benId, listaLotes, data) {
        const beneficiario = await Ben.buscarPorId(benId, connection);
        if (beneficiario == null)
            throw new Error("Beneficiario não encontrado");

        await connection.beginTransaction();

        const [resultado] = await connection.query(`
            INSERT INTO lotesDoados(ben_id, data)
            VALUES (?, ?);`, [benId, data]);

        for (let lItem of listaLotes) {
            if (lItem.qtd <= 0)
                throw new Error("index[" + listaLotes.indexOf(lItem) + "] " + lItem.qtd + ": quantidade invalida");

            const lote = await Lotes.buscarPorId(connection, lItem.id);
            if (lote == null)
                throw new Error("index[" + listaLotes.indexOf(lItem) + "] " + lItem.id + ": id não encontrado");

            await connection.query(`
                INSERT INTO lotesDoadosLotes(lotd_id, lot_id, qtde)
                VALUES (?, ?, ?);`, [resultado.insertId, lote.id, lItem.qtd]);
        }

        await Lotes.atualizarEstoque(connection,
            listaLotes.map(l => ({ id: l.id, quantidade: l.qtd })) // ← mapeia qtd para quantidade
        );
        await connection.commit();
    }

    static async buscarPorId(connection, id) {
        const queryString = `SELECT * FROM lotesDoados WHERE lotd_id = ?`;
        const [[loteDoado]] = await connection.query(queryString, [id]);

        if (!loteDoado)
            return null;

        return new SaidaDoacao(loteDoado.lotd_id, loteDoado.ben_id, loteDoado.data);
    }

    static async sdListar(connection, benNome, data) {
        let queryString = `
            SELECT lotd_id,ben_id,data,ben_nome,ben_cpf
            FROM lotesDoados NATURAL JOIN 
            beneficiarios WHERE 1=1`;
        const valores = [];

        if (benNome) {
            queryString += ` AND ben_nome LIKE ?`;
            valores.push(`%${benNome}%`);
        }
        if (data) {
            queryString += ` AND data BETWEEN CURDATE() AND ?`;
            valores.push(data);
        }

        queryString += ` ORDER BY ben_nome ASC`;

        const [saidas] = await connection.query(queryString, valores);
        return saidas.map(e => ({
            lotd_id: e.lotd_id,
            ben_id: e.ben_id,
            data: e.data,
            ben_nome: e.ben_nome,
            ben_cpf: e.ben_cpf
        }));
    }

    async sdExclui(connection) {
        await connection.beginTransaction();

        const [listaLotesDl] = await connection.query(`
            SELECT lot_id, qtde FROM lotesDoadosLotes
            WHERE lotd_id = ?`, [this.lotdId]);

        const listaLotes = listaLotesDl.map(itemLdl => ({
            id: itemLdl.lot_id,
            quantidade: -itemLdl.qtde // negativo = devolve estoque
        }));

        await Lotes.atualizarEstoque(connection, listaLotes);

        const [resultado] = await connection.query(
            `DELETE FROM lotesDoados WHERE lotd_id = ?`, [this.lotdId]);

        await connection.commit();
        return resultado;
    }

    // listas: {id(lote), qtd}
    async sdAlterar(connection, listaOld, listaNew) {
        await connection.beginTransaction();

        await connection.query(`
            UPDATE lotesDoados SET
                ben_id = ?,
                data = ?
            WHERE lotd_id = ?`,
            [this.benId, this.data, this.lotdId]);

        if (listaNew.length > 0) {
            const removidos = listaOld.filter(oldItem =>
                !listaNew.some(newItem => newItem.id === oldItem.id)
            );
            const adicionados = listaNew.filter(newItem =>
                !listaOld.some(oldItem => oldItem.id === newItem.id)
            );
            const atualizados = listaNew.filter(newItem =>
                listaOld.some(oldItem => oldItem.id === newItem.id)
            );

            for (let item of removidos) {
                await connection.query(`
                    DELETE FROM lotesDoadosLotes
                    WHERE lotd_id = ? AND lot_id = ?`,
                    [this.lotdId, item.id]);
            }
            await Lotes.atualizarEstoque(connection,
                removidos.map(item => ({ id: item.id, quantidade: -item.qtde }))
            );

            for (let item of adicionados) {
                await connection.query(`
                    INSERT INTO lotesDoadosLotes(lotd_id, lot_id, qtde)
                    VALUES (?, ?, ?)`,
                    [this.lotdId, item.id, item.qtde]);
            }
            await Lotes.atualizarEstoque(connection,
                adicionados.map(item => ({ id: item.id, quantidade: item.qtde }))
            );

            for (let item of atualizados) {
                const oldItem = listaOld.find(o => o.id === item.id);
                const diff = item.qtde - oldItem.qtde;

                await connection.query(`
                    UPDATE lotesDoadosLotes SET
                        qtde = ?
                    WHERE lot_id = ? AND lotd_id = ?`,
                    [item.qtde, item.id, this.lotdId]);

                if (diff !== 0) {
                    await Lotes.atualizarEstoque(connection,
                        [{ id: item.id, quantidade: diff }]
                    );
                }
            }
        }
        await connection.commit();
    }

    static async buscarLotesPorSaida(connection, lotdId) {
        const [lotes] = await connection.query(`
            SELECT ldl.lot_id, ldl.qtde, i.item_nome, i.item_unidadeMedida, l.lot_validade, l.lot_qtde
            FROM lotesDoadosLotes ldl
            NATURAL JOIN lotes l
            NATURAL JOIN itens i
            WHERE ldl.lotd_id = ?
            AND (l.lot_validade IS NULL OR l.lot_validade >= CURDATE())
        `, [lotdId]);

        return lotes.map(e => ({
            id: e.lot_id,
            qtde: e.qtde,
            loteInfo: {
                lot_id: e.lot_id,
                item_nome: e.item_nome,
                item_unidadeMedida: e.item_unidadeMedida,
                lot_validade: e.lot_validade,
                lot_qtde: e.lot_qtde
            }
        }));
    }
}

export default SaidaDoacao;