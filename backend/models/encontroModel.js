class Encontro {
  constructor(id, data, disponibilidade, qtdeMax, qtde, local) {
    if (
      !id ||
      !data ||
      !disponibilidade ||
      !qtdeMax ||
      qtde == 0 ||
      !qtdeMax ||
      !local
    ) {
      throw new Error("Todos os campos são obrigatórios");
    }
    if (qtde > qtdeMax) {
      throw new Error("Quantidade não pode ser maior que o máximo");
    }
    if(qtdeMax <=0){
      throw new Error("Quantidade Máxima não pode ser menor ou igual que 0");
    }
    if (qtde < 0) {
      throw new Error("Quantidade não pode ser menor que 0");
    }

    this.id = id;
    this.data = data;
    this.disponibilidade = disponibilidade;
    this.qtdeMax = qtdeMax;
    this.qtde = qtde;
    this.local = local;
  }

  static async listar(connection, filtroLocal) {
    let queryString = `select * from encontros`;
    let valores = [];
    if (filtroLocal) {
      queryString += ` where enc_local like ?`;
      valores.push(`%${filtroLocal}%`);
    }
    const [encontros] = await connection.query(queryString, valores);
    let encontroList = [];
    encontros.forEach((f) => {
      encontroList.push(
        new Encontro(
          f.enc_id,
          f.enc_data,
          f.enc_disponibilidade,
          f.enc_qtdeMax,
          f.enc_qtde,
          f.enc_local,
        ),
      );
    });
    return encontroList;
  }

  async alterar(connection) {
    let queryString = `
            update encontros set
                enc_data = ?,
                enc_disponibilidade = ?,
                enc_qtdeMax = ?,
                enc_qtde = ?,
                enc_local = ?
            where enc_id = ?;
        `;
    let valores = [
      this.data,
      this.disponibilidade,
      this.qtdeMax,
      this.qtde,
      this.local,
      this.id,
    ];
    const [resultado] = await connection.query(queryString, valores);
    return resultado;
  }

  async excluir(connection) {
    let queryString = `
            delete from encontros
            where enc_id = ?;
        `;
    let valores = [this.id];
    const [resultado] = await connection.query(queryString, valores);
    return resultado;
  }

  static async buscarPorLocal(connection, local) {
    let queryString = `select * from encontros where enc_local = ?`;
    let valores = [local];
    const [[encontro]] = await connection.query(queryString, valores);
    if (!encontro) {
      return null;
    } else {
      return new Encontro(
        encontro.enc_id,
        encontro.enc_data,
        encontro.enc_disponibilidade,
        encontro.enc_qtdeMax,
        encontro.enc_qtde,
        encontro.enc_local,
      );
    }
  }
  static async buscarPorId(connection, id) {
    let queryString = `select * from encontros where enc_id = ?`;
    let valores = [id];
    const [[encontro]] = await connection.query(queryString, valores);
    if (!encontro) {
      return null;
    } else {
      return new Encontro(
        encontro.enc_id,
        encontro.enc_data,
        encontro.enc_disponibilidade,
        encontro.enc_qtdeMax,
        encontro.enc_qtde,
        encontro.enc_local,
      );
    }
  }

  async gravar(connection) {
    let queryString = `
            insert into encontros(
                enc_data,
                enc_disponibilidade,
                enc_qtdeMax,
                enc_qtde,
                enc_local
            ) values (?, ?, ?, ?, ?);
        `;
    let valores = [
      this.data,
      this.disponibilidade,
      this.qtdeMax,
      this.qtde,
      this.local,
    ];
    const [resultado] = await connection.query(queryString, valores);
    return resultado;
  }
}

export default Encontro;
