class Documento {
    constructor(id, titulo, tipo, dataCriacao, descricao, link) {
        this.id = id;
        this.titulo = titulo;
        this.tipo = tipo;
        this.dataCriacao = dataCriacao;
        this.descricao = descricao;
        this.link = link;
    }

    static async listar(connection, filtroTitulo, filtroTipo) {
        let queryString = `select * from documentos`;
        const conditions = [];
        if (filtroTitulo) {
            conditions.push(`doc_titulo like '%${filtroTitulo}%'`);
        }
        if (filtroTipo) {
            conditions.push(`doc_tipo like '%${filtroTipo}%'`);
        }
        if (conditions.length > 0) {
            queryString += ` where ` + conditions.join(' and ');
        }
        const [documentos] = await connection.query(queryString);
        let documentoList = [];
        documentos.forEach(d => {
            documentoList.push(new Documento(
                d.doc_id,
                d.doc_titulo,
                d.doc_tipo,
                d.doc_data_criacao,
                d.doc_descricao,
                d.doc_link
            ));
        });
        return documentoList;
    }

    static async buscarPorId(connection, id) {
        let queryString = `select * from documentos where doc_id = ?`
        const [[documento]] = await connection.query(queryString, [id]);
        if (!documento) {
            return null;
        } else {
            return new Documento(
                documento.doc_id,
                documento.doc_titulo,
                documento.doc_tipo,
                documento.doc_data_criacao,
                documento.doc_descricao,
                documento.doc_link
            );
        }
    }

    async gravar(connection) {
        let queryString = `insert into documentos(
            doc_titulo,
            doc_tipo,
            doc_data_criacao,
            doc_descricao,
            doc_link
        ) values (?, ?, ?, ?, ?);`;
        const [resultado] = await connection.query(queryString, [
            this.titulo,
            this.tipo,
            this.dataCriacao,
            this.descricao,
            this.link
        ]);
        return resultado;
    }

    async alterar(connection) {
        let queryString = `
            update documentos set
                doc_titulo = ?,
                doc_tipo = ?,
                doc_data_criacao = ?,
                doc_descricao = ?,
                doc_link = ?
            where doc_id = ?;
        `;
        const [resultado] = await connection.query(queryString, [
            this.titulo,
            this.tipo,
            this.dataCriacao,
            this.descricao,
            this.link,
            this.id
        ]);
        return resultado;
    }

    async excluir(connection) {
        let queryString = `delete from documentos where doc_id = ?`;
        const [resultado] = await connection.query(queryString, [this.id]);
        return resultado;
    }
}

export default Documento;
