// Utilization of code from Medium article

const mysql = require("mysql");
const util = require("util");

const pool = mysql.createPool({
    connectionLimit: 7,
    host: "us-cdbr-iron-east-02.cleardb.net",
    user: "b2848780ec5752",
    password: "36759909",
    database: "heroku_8e95a53d7f7ad57"
});

pool.getConnection((error, connection) => {
    if (error) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
          }
          if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
          }
          if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
          }
    };
    if (connection) connection.release();
    return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;