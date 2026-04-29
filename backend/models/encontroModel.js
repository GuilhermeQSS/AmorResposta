import Beneficiario from "./beneficiarioModel.js";

class Encontro{
    constructor(id,data,disponibilidade,qtdeMax,qtde,local,titulo,descricao) {
        if (id == null || data == null || disponibilidade == null || qtdeMax == null || 
            qtde == null || local == null || titulo == null || descricao == null) {
            throw new Error("Todos os campos são obrigatórios");
        }
        
        if(qtde < 0){
            throw new Error("Quantidade de participantes não pode ser negativo");
        }

        if(qtdeMax < 1){
            throw new Error("Quantidade máxima de participantes deve ser no minimo 1");
        }

        if(qtde > qtdeMax){
            throw new Error("Quantidade de participantes não pode exceder a quantidade máxima");
        }

        this.id = id;
        this.data = data;
        this.disponibilidade = disponibilidade;
        this.qtdeMax = qtdeMax;
        this.qtde = qtde;
        this.local = local;
        this.titulo = titulo;
        this.descricao = descricao;
    }

    static async listar(connection, titulo, dataInicio, dataFim) {
        let queryString = `SELECT * FROM encontros WHERE 1=1`;
        let valores = [];
        
        if (titulo) {
            queryString += ` AND enc_titulo LIKE ?`;
            valores.push(`%${titulo}%`);
        }
        
        if (dataInicio && dataFim) {
            queryString += ` AND DATE(enc_data) BETWEEN DATE(?) AND DATE(?)`;
            valores.push(dataInicio, dataFim);
        } else if (dataInicio) {
            queryString += ` AND DATE(enc_data) >= DATE(?)`;
            valores.push(dataInicio);
        } else if (dataFim) {
            queryString += ` AND DATE(enc_data) <= DATE(?)`;
            valores.push(dataFim);
        }

        const [encontro] = await connection.query(queryString,valores);
        
        let encontroList = [];
        encontro.forEach(e => {
            encontroList.push(new Encontro(
                e.enc_id,
                e.enc_data,
                e.enc_disponibilidade,
                e.enc_qtdeMax,
                e.enc_qtde,
                e.enc_local,
                e.enc_titulo,
                e.enc_descricao
            ));

        });
        return encontroList;
    }

    static async listarComoBeneficiario(connection, titulo, dataInicio, dataFim, idBeneficiario) {
        let queryString = `
            SELECT 
                e.*, 
                be.ben_id, 
                be.participou 
            FROM encontros e 
            LEFT JOIN beneficiariosEncontros be 
                ON be.enc_id = e.enc_id 
                AND be.ben_id = ?
            WHERE 1=1`;

        let valores = [idBeneficiario];

        if (titulo) {
            queryString += ` AND e.enc_titulo LIKE ?`;
            valores.push(`%${titulo}%`);
        }

        if (dataInicio && dataFim) {
            queryString += ` AND DATE(e.enc_data) BETWEEN DATE(?) AND DATE(?)`;
            valores.push(dataInicio, dataFim);
        } else if (dataInicio) {
            queryString += ` AND DATE(e.enc_data) >= DATE(?)`;
            valores.push(dataInicio);
        } else if (dataFim) {
            queryString += ` AND DATE(e.enc_data) <= DATE(?)`;
            valores.push(dataFim);
        }


        const [rows] = await connection.query(queryString, valores);

        return rows.map(e => ({
            encontro: new Encontro(
                e.enc_id,
                e.enc_data,
                e.enc_disponibilidade,
                e.enc_qtdeMax,
                e.enc_qtde,
                e.enc_local,
                e.enc_titulo,
                e.enc_descricao
            ),
            beneficiario: e.ben_id,
            participou: e.participou
        }));
    }

    static async buscarPorId(connection, id){
        let queryString = `select * from encontros where enc_id = ?`;
        let valores = [
            id
        ];
        const [[encontro]] = await connection.query(queryString,valores);
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
                encontro.enc_titulo,
                encontro.enc_descricao
            );
        }
    }

    async listarBeneficiarios(connection){
        let queryString = `select ben_id,ben_nome,ben_endereco,ben_telefone,ben_usuario,ben_senha,ben_cpf
        	from beneficiariosEncontros natural join beneficiarios
	        where enc_id=?`
        let valores = [
            this.id
        ];
        const [beneficiarios] = await connection.query(queryString,valores);
        let beneficiariosList = [];
        beneficiarios.forEach(b => {
            beneficiariosList.push(new Beneficiario(
                b.ben_id,
                b.ben_nome,
                b.ben_endereco,
                b.ben_telefone,
                b.ben_usuario,
                b.ben_senha,
                b.ben_cpf
            ));
        });
        return beneficiariosList;
    }

    async cadastrarBeneficiario(connection, beneficiario){
        let queryString = `
            insert into beneficiariosEncontros(
                enc_id,
                ben_id,
                participou
            ) values (?, ?, ?);
        `;
        let valores = [
            this.id,
            beneficiario.id,
            0
        ];
        const [resultado] = await connection.query(queryString,valores);
        return resultado;
    }

    async retirarBeneficiario(connection, beneficiario){
        let queryString = `
            delete from beneficiariosEncontros
            where enc_id = ? and ben_id = ?;
        `;
        let valores = [
            this.id,
            beneficiario.id
        ];
        
        const [resultado] = await connection.query(queryString,valores);
        return resultado;
    }

    async incrementarParticipantes(connection){
        let queryString = `
            UPDATE encontros 
            SET enc_qtde = enc_qtde + 1 
            WHERE enc_id = ?;
        `;
        let valores = [
            this.id,
        ];
        const [resultado] = await connection.query(queryString,valores);
        return resultado;
    }

    async decrementarParticipantes(connection){
        let queryString = `
            UPDATE encontros 
            SET enc_qtde = enc_qtde - 1
            WHERE enc_id = ?;
        `;
        let valores = [
            this.id,
        ];
        const [resultado] = await connection.query(queryString,valores);
        return resultado;
    }
}

export default Encontro;
