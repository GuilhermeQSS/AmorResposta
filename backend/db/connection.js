import mysql from "mysql2/promise";

async function garantirEstruturaDoacoes(connection) {
    const [colunasQuantidade] = await connection.query("SHOW COLUMNS FROM doacoes LIKE 'doa_quantidadeItens'");

    if (colunasQuantidade.length === 0) {
        await connection.query(`
            ALTER TABLE doacoes
            ADD COLUMN doa_quantidadeItens INT NOT NULL DEFAULT 1 AFTER doa_tipo
        `);
    }

    await connection.query(`
        UPDATE doacoes
        SET doa_doadorNome = 'anonimo'
        WHERE doa_doadorNome IS NULL OR TRIM(doa_doadorNome) = ''
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
    console.log("Conectado ao MySQL com sucesso!");
} catch (err) {
    console.log("Erro:", err.message);
}

export default connection;
