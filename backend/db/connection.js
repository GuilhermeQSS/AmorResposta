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
        "DATE NULL AFTER enc_detalhes_cancelamento"
    );

    await connection.query(`
        UPDATE encontros
        SET enc_cancelado = 'N'
        WHERE enc_cancelado IS NULL OR TRIM(enc_cancelado) = ''
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
