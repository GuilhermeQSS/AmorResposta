import connection from "../db/connection.js"

class Estoque{
    constructor(id, descricao, qtde, validade){
        this.id = id;
        this.descricao = descricao;
        this.qtde = qtde;
        this.validade = validade;
    }

    
    static async listar(filtro) {
        let queryString = `select * from estoque`
        if (filtro) {
            queryString += ` where est_descricao like '%${filtro}%'`;
        }
        const [estoques] = await connection.query(queryString);
        let estoqueList = [];
        estoques.forEach(e => {
            estoqueList.push(new Estoque(
                e.est_id,
                e.est_descricao,
                e.est_qtde,
                e.est_validade
            ));
        });
        return estoqueList;
    }
    
    async alterar(){
        let queryString = `
            update estoque set
                est_descricao = '${this.descricao}',
                est_qtde = '${this.qtde}',
                est_validade = ?
            where est_id = ${this.id};
        `;

        const [resultado] = await connection.query(queryString,[this.validade]);
        return resultado;
    }

    async excluir(){
        let queryString = `
            delete from estoque
            where est_id = ${this.id};
        `;

        const [resultado] = await connection.query(queryString);
        return resultado;
    }

    static async buscarPorId(id){
            let queryString = `select * from estoque where est_id = ${id}`
            const [[estoque]] = await connection.query(queryString);
            if(!estoque){
                return null;
            }else{
                return new Estoque(
                    estoque.est_id,
                    estoque.est_descricao,
                    estoque.est_qtde,
                    estoque.est_validade
                );
            }
        }

    static async buscarPorValidade(intervalo){
        const queryString = `
            SELECT *
            FROM estoque
            WHERE est_validade IS NOT NULL
            AND est_validade BETWEEN CURDATE() AND CURDATE() + INTERVAL ${intervalo} DAY
            ORDER BY est_validade asc;
        `;
        const [estoques] = await connection.query(queryString);
        let estoqueList = [];
        estoques.forEach(e => {
            estoqueList.push(new Estoque(
                e.est_id,
                e.est_descricao,
                e.est_qtde,
                e.est_validade
            ));
        });
        return estoqueList;
    }
    
    static async buscarPorDescricaoEValidade(descricao,dias){
        const queryString = `
            SELECT *
            FROM estoque
            WHERE est_validade IS NOT NULL
            AND est_validade BETWEEN CURDATE() AND CURDATE() + INTERVAL ${dias} DAY
            AND est_descricao like '%${descricao}%'
            ORDER BY est_validade asc;
        `;
        const [estoques] = await connection.query(queryString);
        let estoqueList = [];
        estoques.forEach(e => {
            estoqueList.push(new Estoque(
                e.est_id,
                e.est_descricao,
                e.est_qtde,
                e.est_validade
            ));
        });
        return estoqueList;
    }


    async gravar(){
        let queryString = `
            insert into estoque(
                est_descricao,
                est_qtde,
                est_validade
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

export default Estoque;
