class Encontro {
    constructor(id, data, horaInicio, horaFim, qtdeMax, titulo, descricao, motivoCancelamento, voluntariosAfetados, lotesAfetados, beneficiariosAfetados, locId) {
        if (!id || !data || !horaInicio || !horaFim || !qtdeMax || !titulo || !descricao || !locId) {
            throw new Error("Os campos obrigatórios não foram preenchidos");
        }

        if (qtdeMax < 1) {
            throw new Error("A quantidade máxima deve ser maior que zero");
        }

        if (horaFim <= horaInicio) {
            throw new Error("A hora de fim deve ser posterior à hora de início");
        }

        this.id = id;
        this.data = data;
        this.horaInicio = horaInicio;
        this.horaFim = horaFim;
        this.status = 'a';
        this.qtdeMax = qtdeMax;
        this.qtde = 0;
        this.titulo = titulo;
        this.descricao = descricao;
        this.motivoCancelamento = motivoCancelamento || null;
        this.voluntariosAfetados = voluntariosAfetados || null;
        this.lotesAfetados = lotesAfetados || null;
        this.beneficiariosAfetados = beneficiariosAfetados || null;
        this.locId = locId;
    }

    static async listar(connection, titulo, status, data) {
        let queryString = `select * from encontros where 1=1`;
        let valores = [];

        if (titulo) {
            queryString += ` and enc_titulo like ?`;
            valores.push(`%${titulo}%`);
        }
        if (status) {
            queryString += ` and enc_status = ?`;
            valores.push(status);
        }
        if (data) {
            queryString += ` and enc_data = ?`;
            valores.push(data);
        }

        const [encontros] = await connection.query(queryString, valores);
        let encontroList = [];
        encontros.forEach(e => {
            encontroList.push(new Encontro(
                e.enc_id, e.enc_data, e.enc_horaInicio, e.enc_horaFim,
                e.enc_status, e.enc_qtdeMax, e.enc_qtde, e.enc_titulo,
                e.enc_descricao, e.enc_motivoCancelamento, e.enc_voluntariosAfetados,
                e.enc_lotesAfetados, e.enc_beneficiariosAfetados, e.loc_id
            ));
        });
        return encontroList;
    }

    static async buscarPorId(connection, id) {
        let queryString = `select * from encontros where enc_id = ?`;
        let valores = [id];

        const [[encontro]] = await connection.query(queryString, valores);
        if (!encontro) {
            return null;
        } else {
            return new Encontro(
                encontro.enc_id, encontro.enc_data, encontro.enc_horaInicio,
                encontro.enc_horaFim, encontro.enc_status, encontro.enc_qtdeMax,
                encontro.enc_qtde, encontro.enc_titulo, encontro.enc_descricao,
                encontro.enc_motivoCancelamento, encontro.enc_voluntariosAfetados,
                encontro.enc_lotesAfetados, encontro.enc_beneficiariosAfetados,
                encontro.loc_id
            );
        }
    }

    async gravar(connection) {
        let queryString = `
            insert into encontros(
                enc_data, enc_horaInicio, enc_horaFim, enc_status,
                enc_qtdeMax, enc_qtde, enc_titulo, enc_descricao,
                enc_motivoCancelamento, enc_voluntariosAfetados,
                enc_lotesAfetados, enc_beneficiariosAfetados, loc_id
            ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        let valores = [
            this.data, this.horaInicio, this.horaFim, this.status,
            this.qtdeMax, this.qtde, this.titulo, this.descricao,
            this.motivoCancelamento, this.voluntariosAfetados,
            this.lotesAfetados, this.beneficiariosAfetados, this.locId
        ];
        const [resultado] = await connection.query(queryString, valores);
        return resultado;
    }

    async alterar(connection) {
        let queryString = `
            update encontros set
                enc_data = ?, enc_horaInicio = ?, enc_horaFim = ?,
                enc_status = ?, enc_qtdeMax = ?, enc_qtde = ?,
                enc_titulo = ?, enc_descricao = ?, enc_motivoCancelamento = ?,
                enc_voluntariosAfetados = ?, enc_lotesAfetados = ?,
                enc_beneficiariosAfetados = ?, loc_id = ?
            where enc_id = ?;
        `;
        let valores = [
            this.data, this.horaInicio, this.horaFim, this.status,
            this.qtdeMax, this.qtde, this.titulo, this.descricao,
            this.motivoCancelamento, this.voluntariosAfetados,
            this.lotesAfetados, this.beneficiariosAfetados, this.locId, this.id
        ];
        const [resultado] = await connection.query(queryString, valores);
        return resultado;
    }

    async excluir(connection) {
        let queryString = `delete from encontros where enc_id = ?`;
        let valores = [this.id];
        const [resultado] = await connection.query(queryString, valores);
        return resultado;
    }

    static async listarComoBeneficiario(connection, benId, titulo, dataInicio, dataFim) {
        let queryString = `
            SELECT 
                e.enc_id, e.enc_titulo, e.enc_data, e.enc_descricao, e.enc_qtde, e.enc_qtdeMax,
                l.loc_nome,
                be.ben_id, be.participou
            FROM encontros e
            LEFT JOIN locais l ON e.loc_id = l.loc_id
            LEFT JOIN beneficiariosEncontros be ON e.enc_id = be.enc_id AND be.ben_id = ?
            WHERE e.enc_status = 'a'
        `;
        let valores = [benId];

        if (titulo) {
            queryString += ` AND e.enc_titulo LIKE ?`;
            valores.push(`%${titulo}%`);
        }
        if (dataInicio && dataFim) {
            queryString += ` AND e.enc_data BETWEEN ? AND ?`;
            valores.push(dataInicio, dataFim);
        }

        queryString += ` ORDER BY e.enc_data ASC`;

        const [rows] = await connection.query(queryString, valores);

        return rows.map(r => ({
            encontro: {
                id: r.enc_id,
                titulo: r.enc_titulo,
                data: r.enc_data,
                descricao: r.enc_descricao,
                qtde: r.enc_qtde,
                qtdeMax: r.enc_qtdeMax,
                local: r.loc_nome
            },
            beneficiario: r.ben_id || null, 
            participou: r.participou !== null ? r.participou : null
        }));
    }

    static async inscreverBeneficiario(connection, encId, benId) {
        const [[enc]] = await connection.query('SELECT enc_qtde, enc_qtdeMax FROM encontros WHERE enc_id = ? FOR UPDATE', [encId]);
        
        if (!enc) throw new Error("Encontro não encontrado.");
        if (enc.enc_qtdeMax > 0 && enc.enc_qtde >= enc.enc_qtdeMax) {
            throw new Error("Este encontro já está lotado.");
        }

        const [[exists]] = await connection.query('SELECT * FROM beneficiariosEncontros WHERE enc_id = ? AND ben_id = ?', [encId, benId]);
        if (exists) throw new Error("Você já está inscrito neste encontro.");

        await connection.query('INSERT INTO beneficiariosEncontros (enc_id, ben_id, participou) VALUES (?, ?, 0)', [encId, benId]);
        await connection.query('UPDATE encontros SET enc_qtde = enc_qtde + 1 WHERE enc_id = ?', [encId]);
    }

    static async cancelarInscricaoBeneficiario(connection, encId, benId) {
        await connection.query('SELECT enc_id FROM encontros WHERE enc_id = ? FOR UPDATE', [encId]);

        const [[exists]] = await connection.query('SELECT participou FROM beneficiariosEncontros WHERE enc_id = ? AND ben_id = ?', [encId, benId]);
        if (!exists) throw new Error("Você não está inscrito neste encontro.");
        if (exists.participou === 1) throw new Error("Você já participou, não pode cancelar.");

        await connection.query('DELETE FROM beneficiariosEncontros WHERE enc_id = ? AND ben_id = ?', [encId, benId]);
        await connection.query('UPDATE encontros SET enc_qtde = enc_qtde - 1 WHERE enc_id = ? AND enc_qtde > 0', [encId]);
    }
}

export default Encontro;