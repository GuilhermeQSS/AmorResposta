import connection from "../db/connection.js"

class Itens{
    constructor(id, descricao, qtde, validade){
        this.id = id;
        this.descricao = descricao;
        this.qtde = qtde;
        this.validade = validade;
    }

    
    static async listar(filtro) {
        let queryString = `select * from itens`
        if (filtro) {
            queryString += ` where item_descricao like '%${filtro}%'`;
        }
        const [itens] = await connection.query(queryString);
        let itensList = [];
        itens.forEach(e => {
            itensList.push(new Itens(
                e.item_id,
                e.item_descricao,
                e.item_qtde,
                e.item_validade
            ));
        });
        return itensList;
    }
    
    async alterar(){
        let queryString = `
            update itens set
                item_descricao = '${this.descricao}',
                item_qtde = '${this.qtde}',
                item_validade = ?
            where item_id = ${this.id};
        `;

        const [resultado] = await connection.query(queryString,[this.validade]);
        return resultado;
    }

    async excluir(){
        let queryString = `
            delete from itens
            where item_id = ${this.id};
        `;

        const [resultado] = await connection.query(queryString);
        return resultado;
    }

    static async buscarPorId(id){
            let queryString = `select * from itens where item_id = ${id}`
            const [[itens]] = await connection.query(queryString);
            if(!itens){
                return null;
            }else{
                return new Itens(
                    itens.item_id,
                    itens.item_descricao,
                    itens.item_qtde,
                    itens.item_validade
                );
            }
        }

    static async buscarPorValidade(intervalo){
        const queryString = `
            SELECT *
            FROM itens
            WHERE item_validade IS NOT NULL
            AND item_validade BETWEEN CURDATE() AND CURDATE() + INTERVAL ${intervalo} DAY
            ORDER BY item_validade asc;
        `;
        const [itens] = await connection.query(queryString);
        let itensList = [];
        itens.forEach(e => {
            itensList.push(new Itens(
                e.item_id,
                e.item_descricao,
                e.item_qtde,
                e.item_validade
            ));
        });
        return itensList;
    }
    
    static async buscarPorDescricaoEValidade(descricao,dias){
        const queryString = `
            SELECT *
            FROM itens
            WHERE item_validade IS NOT NULL
            AND item_validade BETWEEN CURDATE() AND CURDATE() + INTERVAL ${dias} DAY
            AND item_descricao like '%${descricao}%'
            ORDER BY item_validade asc;
        `;
        const [itens] = await connection.query(queryString);
        let itensList = [];
        itens.forEach(e => {
            itensList.push(new Itens(
                e.item_id,
                e.item_descricao,
                e.item_qtde,
                e.item_validade
            ));
        });
        return itensList;
    }


    async gravar(){
        let queryString = `
            insert into itens(
                item_descricao,
                item_qtde,
                item_validade
            ) values (?, ?, ?);
        `;

        const [resultado] = await connection.query(queryString, [
            this.descricao,
            this.qtde,
            this.validade
        ]);

        return resultado;
    }
}

export default Itens;
