class Itens{
    constructor(id, descricao, nome, tipo, possuiValidade){
        if(!descricao || !tipo || !nome)
            throw new Error("Todos os campos devem ser preenchidos");    
        this.id = id;
        this.descricao = descricao;
        this.tipo = tipo;
        this.nome = nome;
        this.possuiValidade = possuiValidade
    }

    static async listar(connection, nome, tipo) {
        let queryString = `select * from itens`
        if(nome && tipo)
            queryString += ` where item_nome like '%${nome}%' and item_tipo like '%${tipo}%'`;
        else
            if (nome)
                queryString += ` where item_nome like '%${nome}%'`;
            else
                if(tipo)
                    queryString += ` where item_tipo like '%${tipo}%'`;
        queryString += ` order by item_nome asc`;
        const [itens] = await connection.query(queryString);
        let itensList = [];
        itens.forEach(e => {
            itensList.push(new Itens(
                e.item_id,
                e.item_descricao,
                e.item_nome,
                e.item_tipo,
                e.item_possuiValidade
            ));
        });
        return itensList;
    }

    async alterar(connection){
        let queryString = `
            update itens set
                item_descricao = '${this.descricao}',
                item_tipo = '${this.tipo}',
                item_nome = '${this.nome}',
                item_possuiValidade = '${this.possuiValidade}'
            where item_id = ${this.id};
        `;
        const [resultado] = await connection.query(queryString,[this.validade]);
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
            let queryString = `select * from itens where item_nome = '${nome}'`
            const [[itens]] = await connection.query(queryString);
            if(!itens){
                return null;
            }else{
                return new Itens(
                    itens.item_id,
                    itens.item_descricao,
                    itens.item_nome,
                    itens.item_tipo,
                    itens.item_possuiValidade
                );
            }
        }

    static async buscarPorId(connection, id){
        let queryString = `select * from itens where item_id = ?`;
        let valores = [id];
        const [[item]] = await connection.query(queryString,valores);
        if(!item){
            return null;
        }else{
            return new Itens(
                item.item_id,
                item.item_descricao,
                item.item_nome,
                item.item_tipo,
                item.item_possuiValidade
            );
        }
    }

    async gravar(connection){
        if(await Itens.buscarPorNome(connection, this.nome) != null)
            throw new Error("Item ja cadastrado");
        let queryString = `
            insert into itens(
                item_descricao,
                item_nome,
                item_tipo,
                item_possuiValidade
            ) values (?, ?, ?, ?);
        `;

        let valores = [
            this.descricao,
            this.nome,
            this.tipo,
            this.possuiValidade
        ];

        const [resultado] = await connection.query(queryString, valores);

        return resultado;
    }
}

export default Itens;