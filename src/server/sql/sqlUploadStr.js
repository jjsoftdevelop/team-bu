const { query } = require('../../config/async-db')

// 寫入上傳檔案資料表
async function insertUploadDB(filename, createdate, contentType, size, path, linkUrl, destination) {
    let sql = "INSERT INTO file_log(filename, createdate, contentType, size, path, linkUrl, destination) VALUES(?,?,?,?,?,?,?)"
    let values = [filename, createdate, contentType, size, path, linkUrl, destination]
    await query(sql, values)
}

module.exports = {
    insertUploadDB
}
