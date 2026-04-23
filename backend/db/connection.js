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

async function garantirEstruturaBeneficiarios(connection) {
    const colunas = [
        "ben_estado",
        "ben_cidade",
        "ben_bairro",
        "ben_rua",
        "ben_numero"
    ];

    for (const coluna of colunas) {
        const [resultado] = await connection.query(`SHOW COLUMNS FROM beneficiarios LIKE '${coluna}'`);
        if (resultado.length === 0) {
            const definicoes = {
                ben_estado: "VARCHAR(2) NULL AFTER ben_nome",
                ben_cidade: "VARCHAR(100) NULL AFTER ben_estado",
                ben_bairro: "VARCHAR(100) NULL AFTER ben_cidade",
                ben_rua: "VARCHAR(100) NULL AFTER ben_bairro",
                ben_numero: "INT NULL AFTER ben_rua"
            };

            await connection.query(`
                ALTER TABLE beneficiarios
                ADD COLUMN ${coluna} ${definicoes[coluna]}
            `);
        }
    }
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
    await garantirEstruturaBeneficiarios(connection);
    console.log("Conectado ao MySQL com sucesso!");
} catch (err) {
    console.log("Erro:", err.message);
}

export default connection;
