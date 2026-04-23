import Beneficiario from "./beneficiarioModel";

class Encontro{
    constructor(id,data,disponibilidade,qtdeMax,qtde,local,titulo,descricao) {
        if (!id || !data || !disponibilidade || !qtdeMax || !qtde || !local || !titulo || !descricao) {
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
        let queryString = `select * from encontros`
        let valores = [];
        if (titulo) {
            queryString += ` and enc_titulo like ?`;
            valores.push(`%${titulo}%`);
        }

        if (dataInicio && dataFim) {
            queryString += ` and enc_data between ? and ?`;
            valores.push(dataInicio, dataFim);
        } else if (dataInicio) {
            queryString += ` and enc_data >= ?`;
            valores.push(dataInicio);
        } else if (dataFim) {
            queryString += ` and enc_data <= ?`;
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
	        from beneficiariosEncontros natural join beneficiarios`
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
        return encontroList;
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
            where enc_id = ? and
            where ben_id = ?;
        `;
        let valores = [
            this.id,
            beneficiario.id
        ];
        const [resultado] = await connection.query(queryString,valores);
        return resultado;
    }
}

export default Encontro;
