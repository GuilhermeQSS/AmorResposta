class Itens{
    constructor(id, descricao, nome, tipo, possuiValidade,unidadeMedida){
        this.id = id;
        this.descricao = descricao ?? "";
        this.tipo = tipo ?? "";
        this.nome = nome ?? "";
        this.possuiValidade = possuiValidade ?? 0;
        this.unidadeMedida = unidadeMedida ?? "";
    }

    static validarDados({ descricao, nome, tipo, unidadeMedida }) {
        if (!descricao || !tipo || !nome || !unidadeMedida) {
            throw new Error("Todos os campos devem ser preenchidos");
        }
    }

    static fromRow(item) {
        return new Itens(
            item.item_id,
            item.item_descricao,
            item.item_nome,
            item.item_tipo,
            item.item_possuiValidade,
            item.item_unidadeMedida
        );
    }

    static async listar(connection, nome, tipo) {
        let queryString = `select * from itens`;
        const valores = [];

        if (nome && tipo) {
            queryString += ` where item_nome like ? and item_tipo like ?`;
            valores.push(`%${nome}%`, `%${tipo}%`);
        } else if (nome) {
            queryString += ` where item_nome like ?`;
            valores.push(`%${nome}%`);
        } else if (tipo) {
            queryString += ` where item_tipo like ?`;
            valores.push(`%${tipo}%`);
        }

        queryString += ` order by item_nome asc`;
        const [itens] = await connection.query(queryString, valores);
        return itens.map((item) => Itens.fromRow(item));
    }

    async alterar(connection){
        Itens.validarDados(this);
        let queryString = `
            update itens set
                item_descricao = ?,
                item_tipo = ?,
                item_nome = ?,
                item_possuiValidade = ?,
                item_unidadeMedida = ?
            where item_id = ?;
        `;
        const [resultado] = await connection.query(queryString, [
            this.descricao,
            this.tipo,
            this.nome,
            this.possuiValidade,
            this.unidadeMedida,
            this.id
        ]);
        return resultado;
    }

    async excluir(connection){
        let queryString = `
            delete from itens
            where item_id = ?;
        `;
        let valores = [
            this.id
        ];
        const [resultado] = await connection.query(queryString,valores);
        return resultado;
    }

    static async buscarPorNome(connection, nome){
            let queryString = `select * from itens where item_nome = ?`;
            const [[itens]] = await connection.query(queryString, [nome]);
            if(!itens){
                return null;
            }else{
                return Itens.fromRow(itens);
            }
        }

    static async buscarPorId(connection, id){
        let queryString = `select * from itens where item_id = ?`;
        let valores = [id];
        const [[item]] = await connection.query(queryString,valores);
        if(!item){
            return null;
        }else{
            return Itens.fromRow(item);
        }
    }

    async gravar(connection){
        Itens.validarDados(this);
        if(await Itens.buscarPorNome(connection, this.nome) != null)
            throw new Error("Item ja cadastrado");
        let queryString = `
            insert into itens(
                item_descricao,
                item_nome,
                item_tipo,
                item_possuiValidade,
                item_unidadeMedida
            ) values (?, ?, ?, ?, ?);
        `;

        let valores = [
            this.descricao,
            this.nome,
            this.tipo,
            this.possuiValidade,
            this.unidadeMedida
        ];

        const [resultado] = await connection.query(queryString, valores);

        return resultado;
    }
}

export default Itens;
