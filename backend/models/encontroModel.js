import connection from "../db/connection.js"

class Encontro{
    constructor(
        id,
        data,
        disponibilidade,
        qtdeMax,
        qtde,
        local,
        cancelado = "N",
        motivoCancelamento = null,
        detalhesCancelamento = null,
        dataCancelamento = null
    ){
        this.id = id;
        this.data = data;
        this.disponibilidade = disponibilidade;
        this.qtdeMax = qtdeMax;
        this.qtde = qtde;
        this.local = local;
        this.cancelado = cancelado;
        this.motivoCancelamento = motivoCancelamento;
        this.detalhesCancelamento = detalhesCancelamento;
        this.dataCancelamento = dataCancelamento;
    }

    static async listar(filtro, status = "ativos") {
        let queryString = `select * from encontros`;
        if (status === "cancelados") {
            queryString += ` where enc_cancelado = 'S'`;
        } else {
            queryString += ` where enc_cancelado = 'N'`;
        }

        if (filtro) {
            queryString += ` and enc_local like '%${filtro}%'`;
        }
        const [encontros] = await connection.query(queryString);
        let encontroList = [];
        encontros.forEach(f => {
            encontroList.push(new Encontro(
                f.enc_id,
                f.enc_data,
                f.enc_disponibilidade,
                f.enc_qtdeMax,
                f.enc_qtde,
                f.enc_local,
                f.enc_cancelado,
                f.enc_motivo_cancelamento,
                f.enc_detalhes_cancelamento,
                f.enc_data_cancelamento
            ));
        });
        return encontroList;
    }
    
    async alterar(){
        let queryString = `
            update encontros set
                enc_data = ?,
                enc_disponibilidade = ?,
                enc_qtdeMax = ?,
                enc_qtde = ?,
                enc_local = ?
            where enc_id = ?;
        `;

        const [resultado] = await connection.query(queryString, [
            this.data,
            this.disponibilidade,
            this.qtdeMax,
            this.qtde,
            this.local,
            this.id
        ]);
        return resultado;
    }

    async excluir(){
        let queryString = `
            delete from encontros
            where enc_id = ?;
        `;

        const [resultado] = await connection.query(queryString, [this.id]);
        return resultado;
    }

    async cancelar(motivo, detalhes){
        let queryString = `
            update encontros set
                enc_cancelado = 'S',
                enc_motivo_cancelamento = ?,
                enc_detalhes_cancelamento = ?,
                enc_data_cancelamento = curdate(),
                enc_disponibilidade = 'C'
            where enc_id = ?;
        `;

        const [resultado] = await connection.query(queryString, [
            motivo,
            detalhes,
            this.id
        ]);
        return resultado;
    }

    static async buscarPorLocal(local){
        let queryString = `select * from encontros where enc_local = ?`
        const [[encontro]] = await connection.query(queryString, [local]);
        if(!encontro){
            return null;
        }else{
            return new Encontro(
                encontro.enc_id,
                encontro.enc_data,
                encontro.enc_disponibilidade,
                encontro.enc_qtdeMax,
                encontro.enc_qtde,
                encontro.enc_local,
                encontro.enc_cancelado,
                encontro.enc_motivo_cancelamento,
                encontro.enc_detalhes_cancelamento,
                encontro.enc_data_cancelamento
            );
        }
    }

    static async buscarPorId(id){
        let queryString = `select * from encontros where enc_id = ?`
        const [[encontro]] = await connection.query(queryString, [id]);
        if(!encontro){
            return null;
        }else{
            return new Encontro(
                encontro.enc_id,
                encontro.enc_data,
                encontro.enc_disponibilidade,
                encontro.enc_qtdeMax,
                encontro.enc_qtde,
                encontro.enc_local,
                encontro.enc_cancelado,
                encontro.enc_motivo_cancelamento,
                encontro.enc_detalhes_cancelamento,
                encontro.enc_data_cancelamento
            );
        }
    }

    async gravar(){
        let queryString = `
            insert into encontros(
                enc_data,
                enc_disponibilidade,
                enc_qtdeMax,
                enc_qtde,
                enc_local
            ) values (?, ?, ?, ?, ?);
        `;

        const [resultado] = await connection.query(queryString, [
            this.data,
            this.disponibilidade,
            this.qtdeMax,
            this.qtde,
            this.local
        ]);

        return resultado;
    }

    static async buscarImpacto(id){
        const [[encontro]] = await connection.query(
            `select * from encontros where enc_id = ?`,
            [id]
        );
        if(!encontro){
            return null;
        }

        const [[beneficiarios]] = await connection.query(
            `select count(*) as total from participantes where enc_id = ?`,
            [id]
        );

        const [[responsaveis]] = await connection.query(
            `select count(*) as total from responsaveis where enc_id = ?`,
            [id]
        );

        const [[materiais]] = await connection.query(
            `select count(*) as total from materiais where enc_id = ?`,
            [id]
        );

        return {
            encontro: new Encontro(
                encontro.enc_id,
                encontro.enc_data,
                encontro.enc_disponibilidade,
                encontro.enc_qtdeMax,
                encontro.enc_qtde,
                encontro.enc_local,
                encontro.enc_cancelado,
                encontro.enc_motivo_cancelamento,
                encontro.enc_detalhes_cancelamento,
                encontro.enc_data_cancelamento
            ),
            beneficiarios: beneficiarios.total,
            responsaveis: responsaveis.total,
            materiais: materiais.total,
            documentos: 0,
            observacoes: 0,
            proximo: encontro.enc_data && new Date(encontro.enc_data) - new Date() <= 1000 * 60 * 60 * 24
        };
    }

    static async criarReagendamento(origId, novaData, transferirInscritos){
        const encontroAnterior = await Encontro.buscarPorId(origId);
        if(!encontroAnterior){
            return null;
        }

        const novoEncontro = new Encontro(
            0,
            novaData,
            'A',
            encontroAnterior.qtdeMax,
            0,
            encontroAnterior.local
        );

        const resultado = await novoEncontro.gravar();
        const newId = resultado.insertId;

        if (transferirInscritos) {
            await connection.query(
                `insert ignore into participantes (enc_id, ben_id, participou)
                 select ?, ben_id, participou from participantes where enc_id = ?`,
                [newId, origId]
            );

            await connection.query(
                `insert ignore into responsaveis (fun_id, enc_id, participou)
                 select fun_id, ?, participou from responsaveis where enc_id = ?`,
                [newId, origId]
            );

            await connection.query(
                `insert ignore into materiais (enc_id, item_id, qtde, utilizado)
                 select ?, item_id, qtde, utilizado from materiais where enc_id = ?`,
                [newId, origId]
            );

            const [[{total}]] = await connection.query(
                `select count(*) as total from participantes where enc_id = ?`,
                [newId]
            );

            await connection.query(
                `update encontros set enc_qtde = ? where enc_id = ?`,
                [total, newId]
            );
        }

        return newId;
    }
}

export default Encontro;
