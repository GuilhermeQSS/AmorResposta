class Itens{
    constructor(id, descricao, nome, tipo){
        if(!id || !descricao || !tipo || !nome)
            throw new Error("Todos os campos devem ser preenchidos");    
        this.id = id;
        this.descricao = descricao;
        this.tipo = tipo;
        this.nome = nome;
    }

    static async listar(connection, nome, tipo) {
        let queryString = `select * from itens where `
        if(nome && tipo)
            queryString += `item_nome like '%${nome}%' and item_tipo = '${tipo}'`;
        else
            if (nome)
                queryString += `item_nome like '%${nome}%'`;
            else
                if(tipo)
                    queryString += `item_tipo = '${tipo}'`;
        const [itens] = await connection.query(queryString);
        let itensList = [];
        itens.forEach(e => {
            itensList.push(new Itens(
                e.item_id,
                e.item_descricao,
                e.nome,
                e.tipo
            ));
        });
        return itensList;
    }

    async alterar(connection){
        let queryString = `
            update itens set
                item_descricao = '${this.descricao}',
                item_tipo = '${this.tipo},
                item_nome = '${this.nome}
            where item_id = ${this.id};
        `;
        const [resultado] = await connection.query(queryString,[this.validade]);
        return resultado;
    }

    async excluir(connection){
        let queryString = `
            delete from itens
            where item_id = ${this.id};
        `;
        const [resultado] = await connection.query(queryString);
        return resultado;
    }

    static async buscarPorNome(connection, nome){
            let queryString = `select * from itens where item_nome = ${nome}`
            const [[itens]] = await connection.query(queryString);
            if(!itens){
                return null;
            }else{
                return new Itens(
                    itens.item_id,
                    itens.item_descricao,
                    itens.item_nome,
                    itens.item_tipo
                );
            }
        }

    async gravar(connection){
        if(buscarPorNome(connection,this.nome) == null)
            throw new Error("Item ja cadastrado");
        let queryString = `
            insert into itens(
                item_descricao,
                item_nome,
                item_tipo
            ) values (?, ?, ?);
        `;

        const [resultado] = await connection.query(queryString, [
            this.descricao,
            this.nome,
            this.tipo
        ]);

        return resultado;
    }
}

export default Itens;