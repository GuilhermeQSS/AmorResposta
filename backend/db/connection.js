import mysql from "mysql2/promise";

async function adicionarColunaSeNaoExistir(connection, tabela, coluna, definicao) {
    const [colunas] = await connection.query(
        `SHOW COLUMNS FROM ${tabela} LIKE ?`,
        [coluna]
    );

    if (colunas.length === 0) {
        await connection.query(
            `ALTER TABLE ${tabela} ADD COLUMN ${coluna} ${definicao}`
        );
    }
}

async function obterColuna(connection, tabela, coluna) {
    const [colunas] = await connection.query(
        `SHOW COLUMNS FROM ${tabela} LIKE ?`,
        [coluna]
    );

    return colunas[0] || null;
}

async function garantirTipoColuna(connection, tabela, coluna, definicao, tiposAceitos) {
    const colunaInfo = await obterColuna(connection, tabela, coluna);

    if (!colunaInfo) {
        return;
    }

    const tipoAtual = String(colunaInfo.Type || "").toLowerCase();
    const compativel = tiposAceitos.some((tipo) => tipoAtual.startsWith(tipo));

    if (!compativel) {
        await connection.query(
            `ALTER TABLE ${tabela} MODIFY COLUMN ${coluna} ${definicao}`
        );
    }
}

async function garantirEstruturaDoacoes(connection) {
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

    await connection.query(`
        UPDATE doacoes
        SET doa_doadorNome = 'anonimo'
        WHERE doa_doadorNome IS NULL OR TRIM(doa_doadorNome) = ''
    `);
}

async function garantirEstruturaEncontros(connection) {
    await adicionarColunaSeNaoExistir(
        connection,
        "encontros",
        "enc_cancelado",
        "CHAR(1) NOT NULL DEFAULT 'N' AFTER enc_local"
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
        "DATETIME NULL AFTER enc_detalhes_cancelamento",
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

let connection;

try {
    connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "amorresposta"
    });

    await garantirEstruturaDoacoes(connection);
    await garantirEstruturaEncontros(connection);
    console.log("Conectado ao MySQL com sucesso!");
} catch (err) {
    console.log("Erro:", err.message);
}

export default connection;
