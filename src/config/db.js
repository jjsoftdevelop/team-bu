const mysql = require('mysql');

// 載入所有env環境變數
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
console.log({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME
})
const dbConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
})
dbConnection.connect((err) => {
    if (err) {
        console.log('db connected fail!');
        throw err
    } else {
        console.log("db connected!!")
    }
})

module.exports = dbConnection