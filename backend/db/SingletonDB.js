import mysql from "mysql2/promise";

async function colunaExiste(connection, tabela, coluna) {
  const [resultado] = await connection.query(
    `SHOW COLUMNS FROM \`${tabela}\` LIKE ?`,
    [coluna]
  );
  return resultado.length > 0;
}

async function adicionarColunaSeNaoExistir(connection, tabela, coluna, definicao) {
  if (!(await colunaExiste(connection, tabela, coluna))) {
    await connection.query(`
      ALTER TABLE \`${tabela}\`
      ADD COLUMN ${coluna} ${definicao}
    `);
  }
}

async function obterColuna(connection, tabela, coluna) {
  const [resultado] = await connection.query(
    `SHOW COLUMNS FROM \`${tabela}\` LIKE ?`,
    [coluna]
  );
  return resultado[0] || null;
}

async function garantirTipoColuna(connection, tabela, coluna, definicao, tiposAceitos) {
  const colunaInfo = await obterColuna(connection, tabela, coluna);
  if (!colunaInfo) {
    return;
  }

  const tipoAtual = String(colunaInfo.Type || "").toLowerCase();
  const compativel = tiposAceitos.some((tipo) => tipoAtual.startsWith(tipo));

  if (!compativel) {
    await connection.query(`
      ALTER TABLE \`${tabela}\`
      MODIFY COLUMN ${coluna} ${definicao}
    `);
  }
}

async function garantirEstruturaBeneficiarios(connection) {
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

  for (const [coluna, definicao] of Object.entries(definicoes)) {
    await adicionarColunaSeNaoExistir(connection, "beneficiarios", coluna, definicao);
  }
}

async function garantirEstruturaFuncionarios(connection) {
  const definicoes = {
    fun_cpf: "VARCHAR(45) NULL AFTER fun_cargo",
    fun_telefone: "VARCHAR(45) NULL AFTER fun_cpf",
  };

  for (const [coluna, definicao] of Object.entries(definicoes)) {
    await adicionarColunaSeNaoExistir(connection, "funcionarios", coluna, definicao);
  }
}

async function garantirEstruturaDoacoes(connection) {
  await adicionarColunaSeNaoExistir(
    connection,
    "doacoes",
    "doa_doadorNome",
    "VARCHAR(100) NULL AFTER doa_id"
  );

  await adicionarColunaSeNaoExistir(
    connection,
    "doacoes",
    "doa_tipo",
    "VARCHAR(45) NULL AFTER doa_formaEntrega"
  );

  await adicionarColunaSeNaoExistir(
    connection,
    "doacoes",
    "doa_quantidadeItens",
    "INT NOT NULL DEFAULT 1 AFTER doa_tipo"
  );

  await adicionarColunaSeNaoExistir(
    connection,
    "doacoes",
    "doa_detalhes",
    "TEXT NULL AFTER doa_observacao"
  );

  await adicionarColunaSeNaoExistir(
    connection,
    "doacoes",
    "doc_id",
    "INT NULL AFTER doa_detalhes"
  );

  const colunaDoadId = await obterColuna(connection, "doacoes", "doad_id");
  if (colunaDoadId && colunaDoadId.Null === "NO") {
    await connection.query(`
      ALTER TABLE \`doacoes\`
      MODIFY COLUMN doad_id INT NULL
    `);
  }

  await connection.query(`
    UPDATE doacoes
    SET doa_doadorNome = 'anonimo'
    WHERE doa_doadorNome IS NULL OR TRIM(doa_doadorNome) = ''
  `);

  await connection.query(`
    UPDATE doacoes
    SET doa_quantidadeItens = 1
    WHERE doa_quantidadeItens IS NULL OR doa_quantidadeItens <= 0
  `);
}

async function garantirEstruturaEncontros(connection) {
  await adicionarColunaSeNaoExistir(
    connection,
    "encontros",
    "enc_hora",
    "TIME NULL AFTER enc_data"
  );

  await adicionarColunaSeNaoExistir(
    connection,
    "encontros",
    "enc_cancelado",
    "CHAR(1) NOT NULL DEFAULT 'N' AFTER enc_descricao"
  );

  await adicionarColunaSeNaoExistir(
    connection,
    "encontros",
    "enc_motivo_cancelamento",
    "VARCHAR(255) NULL AFTER enc_cancelado"
  );

  await adicionarColunaSeNaoExistir(
    connection,
    "encontros",
    "enc_detalhes_cancelamento",
    "TEXT NULL AFTER enc_motivo_cancelamento"
  );

  await adicionarColunaSeNaoExistir(
    connection,
    "encontros",
    "enc_data_cancelamento",
    "DATETIME NULL AFTER enc_detalhes_cancelamento"
  );

  await garantirTipoColuna(
    connection,
    "encontros",
    "enc_data_cancelamento",
    "DATETIME NULL",
    ["datetime", "timestamp"]
  );

  await adicionarColunaSeNaoExistir(
    connection,
    "encontros",
    "enc_acao_cancelamento",
    "VARCHAR(40) NULL AFTER enc_data_cancelamento"
  );

  await adicionarColunaSeNaoExistir(
    connection,
    "encontros",
    "enc_reagendado_para",
    "INT NULL AFTER enc_acao_cancelamento"
  );

  await adicionarColunaSeNaoExistir(
    connection,
    "encontros",
    "enc_beneficiarios_afetados",
    "INT NOT NULL DEFAULT 0 AFTER enc_reagendado_para"
  );

  await adicionarColunaSeNaoExistir(
    connection,
    "encontros",
    "enc_responsaveis_afetados",
    "INT NOT NULL DEFAULT 0 AFTER enc_beneficiarios_afetados"
  );

  await adicionarColunaSeNaoExistir(
    connection,
    "encontros",
    "enc_materiais_afetados",
    "INT NOT NULL DEFAULT 0 AFTER enc_responsaveis_afetados"
  );

  await connection.query(`
    UPDATE encontros
    SET enc_cancelado = 'N'
    WHERE enc_cancelado IS NULL OR TRIM(enc_cancelado) = ''
  `);

  await connection.query(`
    UPDATE encontros
    SET enc_beneficiarios_afetados = 0
    WHERE enc_beneficiarios_afetados IS NULL
  `);

  await connection.query(`
    UPDATE encontros
    SET enc_responsaveis_afetados = 0
    WHERE enc_responsaveis_afetados IS NULL
  `);

  await connection.query(`
    UPDATE encontros
    SET enc_materiais_afetados = 0
    WHERE enc_materiais_afetados IS NULL
  `);
}

class SingletonDB {
  static connection = null;

  static async getConnection() {
    if (this.connection === null) {
      try {
        this.connection = await mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "",
          database: "amorresposta",
        });

        await garantirEstruturaBeneficiarios(this.connection);
        await garantirEstruturaFuncionarios(this.connection);
        await garantirEstruturaDoacoes(this.connection);
        await garantirEstruturaEncontros(this.connection);
        console.log("Conectado ao MySQL com sucesso!");
      } catch (err) {
        console.log("Erro:", err.message);
        throw err;
      }
    }

    return this.connection;
  }
}

export default SingletonDB;
