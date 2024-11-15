const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'travel',
    password: '1234',
    database: 'traveldb',
    dateStrings: 'date',
});

db.connect();

module.exports = db;
