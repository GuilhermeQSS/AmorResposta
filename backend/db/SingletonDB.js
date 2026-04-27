import mysql from "mysql2/promise";

async function garantirEstruturaBeneficiarios(connection) {
  const colunas = [
    "ben_nome",
    "ben_estado",
    "ben_cidade",
    "ben_bairro",
    "ben_rua",
    "ben_numero",
    "ben_endereco",
    "ben_telefone",
    "ben_cpf",
  ];

  const definicoes = {
    ben_nome: "VARCHAR(45) NULL AFTER ben_id",
    ben_estado: "VARCHAR(2) NULL AFTER ben_nome",
    ben_cidade: "VARCHAR(100) NULL AFTER ben_estado",
    ben_bairro: "VARCHAR(100) NULL AFTER ben_cidade",
    ben_rua: "VARCHAR(100) NULL AFTER ben_bairro",
    ben_numero: "INT NULL AFTER ben_rua",
    ben_endereco: "VARCHAR(255) NULL AFTER ben_numero",
    ben_telefone: "VARCHAR(20) NULL AFTER ben_endereco",
    ben_cpf: "VARCHAR(45) NULL AFTER ben_senha",
  };

  for (const coluna of colunas) {
    const [resultado] = await connection.query(`SHOW COLUMNS FROM beneficiarios LIKE '${coluna}'`);
    if (resultado.length === 0) {
      await connection.query(`
        ALTER TABLE beneficiarios
        ADD COLUMN ${coluna} ${definicoes[coluna]}
      `);
    }
  }
}

class SingletonDB {
  static connection = null;
  static async getConnection() {
    if (this.connection === null) {
      try {
        this.connection = await mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: '',
          database: 'amorresposta'
        });

        await garantirEstruturaBeneficiarios(this.connection);
        console.log('Conectado ao MySQL com sucesso!');
      } catch (err) {
        console.log("Erro:", err.message);
        throw err;
      }
    }
    return this.connection;
  }
}

export default SingletonDB;
