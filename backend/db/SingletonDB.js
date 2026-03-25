import mysql from "mysql2/promise";

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
