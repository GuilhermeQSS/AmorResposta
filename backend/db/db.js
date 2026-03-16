const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'amorresposta'
});

connection.connect((err) => {
  if (err) {
    return console.error('Erro ao conectar: ' + err.message);
  }
  console.log('Conectado ao MySQL com sucesso!');
});

export default connection;