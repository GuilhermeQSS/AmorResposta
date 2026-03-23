import mysql from "mysql2/promise"

let connection;

try {
  connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'amorresposta'
  });
  console.log('Conectado ao MySQL com sucesso!');
}catch(err){
  console.log("Erro:", err.message);
}


export default connection;