const { query } = require('../../config/async-db')

// 寫入email 資料表
async function insertEmailDB(statusCode, statusCode, responseContent, to, text, subject) {
    let sql = "INSERT INTO email_log(createdate,statusCode,responseContent,emailTo,emailContent,emailTitle) VALUES(?,?,?,?,?,?)"
    let values = [new Date(), statusCode, JSON.stringify(responseContent), to, text, subject]
    await query(sql, values)
}

module.exports = {
    insertEmailDB
}