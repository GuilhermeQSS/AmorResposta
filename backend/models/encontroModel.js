class Encontro{
    constructor(id, data, disponibilidade, qtdeMax, qtde, local){
        this.id = id;
        this.data = data;
        this.disponibilidade = disponibilidade;
        this.qtdeMax = qtdeMax;
        this.qtde = qtde;
        this.local = local;
    }

    static async listar(connection, filtro) {
        let queryString = `select * from encontros`
        if (filtro) {
            queryString += ` where enc_local like '%${filtro}%'`;
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
                f.enc_local
            ));
        });
        return encontroList;
    }
    
    async alterar(connection){
        let queryString = `
            update encontros set
                enc_data = '${this.data}',
                enc_disponibilidade = '${this.disponibilidade}',
                enc_qtdeMax = '${this.qtdeMax}',
                enc_qtde = '${this.qtde}',
                enc_local = '${this.local}'
            where enc_id = ${this.id};
        `;

        const [resultado] = await connection.query(queryString);
        return resultado;
    }

    async excluir(connection){
        let queryString = `
            delete from encontros
            where enc_id = ${this.id};
        `;

        const [resultado] = await connection.query(queryString);
        return resultado;
    }

    static async buscarPorLocal(connection, local){
        let queryString = `select * from encontros where enc_local = '${local}'`
        const [[encontro]] = await connection.query(queryString);
        if(!encontro){
            return null;
        }else{
            return new Encontro(
                encontro.enc_id,
                encontro.enc_data,
                encontro.enc_disponibilidade,
                encontro.enc_qtdeMax,
                encontro.enc_qtde,
                encontro.enc_local
            );
        }
    }

    static async buscarPorId(connection, id){
        let queryString = `select * from encontros where enc_id = ${id}`
        const [[encontro]] = await connection.query(queryString);
        if(!encontro){
            return null;
        }else{
            return new Encontro(
                encontro.enc_id,
                encontro.enc_data,
                encontro.enc_disponibilidade,
                encontro.enc_qtdeMax,
                encontro.enc_qtde,
                encontro.enc_local
            );
        }
    }

    async gravar(connection){
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
}

export default Encontro;
