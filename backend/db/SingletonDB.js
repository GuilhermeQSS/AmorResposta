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

    const definicoes = {
        ben_estado: "VARCHAR(2) NULL AFTER ben_nome",
        ben_cidade: "VARCHAR(100) NULL AFTER ben_estado",
        ben_bairro: "VARCHAR(100) NULL AFTER ben_cidade",
        ben_rua: "VARCHAR(100) NULL AFTER ben_bairro",
        ben_numero: "INT NULL AFTER ben_rua"
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

async function garantirEstruturaDespesas(connection) {
    const [colunas] = await connection.query("SHOW COLUMNS FROM despesas LIKE 'des_valor'");

    if (colunas.length === 0) {
        await connection.query(`
            ALTER TABLE despesas
            ADD COLUMN des_valor DECIMAL(10,2) NULL AFTER des_id
        `);
    }
}

class SingletonDB {
    static connection = null;

    static async getConnection() {
        if (this.connection === null) {
            this.connection = await mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: "amorresposta"
            });

            await garantirEstruturaDoacoes(this.connection);
            await garantirEstruturaBeneficiarios(this.connection);
            await garantirEstruturaDespesas(this.connection);

            console.log("Conectado ao MySQL com sucesso!");
        }

        return this.connection;
    }
}

export default SingletonDB;
