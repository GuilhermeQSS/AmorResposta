import mysql from "mysql2/promise";

async function garantirEstruturaBeneficiarios(connection) {
    const colunas = [
        "ben_estado",
        "ben_cidade",
        "ben_bairro",
        "ben_rua",
        "ben_numero",
        "ben_nome",
        "ben_endereco",
        "ben_telefone"
    ];

    const definicoes = {
        ben_estado: "VARCHAR(2) NULL AFTER ben_nome",
        ben_cidade: "VARCHAR(100) NULL AFTER ben_estado",
        ben_bairro: "VARCHAR(100) NULL AFTER ben_cidade",
        ben_rua: "VARCHAR(100) NULL AFTER ben_bairro",
        ben_numero: "INT NULL AFTER ben_rua",
        ben_nome: "VARCHAR(45) NULL AFTER ben_id",
        ben_endereco: "VARCHAR(255) NULL AFTER ben_numero",
        ben_telefone: "VARCHAR(20) NULL AFTER ben_endereco"
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

let connection;

try {
    connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "amorresposta"
    });

    await garantirEstruturaBeneficiarios(connection);
    console.log("Conectado ao MySQL com sucesso!");
} catch (err) {
    console.log("Erro:", err.message);
}

export default connection;
