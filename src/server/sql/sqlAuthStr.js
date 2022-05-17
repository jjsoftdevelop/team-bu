const { query } = require('../../config/async-db')

// 過去半小時發送次數
async function sendCodeCount(email) {
    let sql = `SELECT COUNT(*) AS count FROM email_verify WHERE email = ? AND isVerify = 0 AND createdate > DATE_SUB(NOW(), INTERVAL 30 MINUTE)`
    let values = [email]
    let dataList = await query(sql, values)
    const data = JSON.parse(JSON.stringify(dataList))
    return data[0]
}
// 檢查 email是否存在
async function isExistEmail(email, provider) {
    let sql = "SELECT * FROM member WHERE email = ? AND provider = ? Limit 1"
    let values = [email, provider]
    let dataList = await query(sql, values)
    const data = JSON.parse(JSON.stringify(dataList))
    return data[0]
}

// 檢查帳號是否驗證過
async function isVerifyEmail(email) {
    let sql = "SELECT COUNT(*) AS Count FROM email_verify WHERE email = ? AND isVerify = 1"
    let values = [email]
    let dataList = await query(sql, values)
    let isExist = false
    const format = JSON.parse(JSON.stringify(dataList))
    if (format[0].Count !== 0) {
        isExist = true
    }
    return isExist
}

// 驗證碼寫入DB
async function insertVerifyCodeDB(email, verifycode, IP) {
    let sql = "INSERT INTO email_verify(email, verifycode, IP, createdate) VALUES(?,?,?,?)"
    let values = [email, verifycode, IP, new Date()]
    await query(sql, values)
}

// google 註冊
async function googleSignUp(nickname, email, picture) {
    let sql = "INSERT INTO member(nickname, email, picture,createdate, provider, statusID, levelID) VALUES(?,?,?,?,?,?,?)"
    let values = [nickname, email, picture, new Date(), 'google', 1, 1]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data.insertId
}

// 一般 註冊
async function userSignUp(nickname, email, passwdEncode, url) {
    let sql = "INSERT INTO member(nickname, email, password, picture ,createdate, provider, statusID, levelID) VALUES(?,?,?,?,?,?,?,?)"
    let values = [nickname, email, passwdEncode, url, new Date(), 'user', 1, 1]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data.insertId
}

// 驗這密碼
async function verifyPasswd(email, passwdEncode) {
    let sql = "SELECT * FROM member WHERE email = ? AND password = ? AND provider = ? Limit 1"
    let values = [email, passwdEncode, 'user']
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data[0]
}

// 更新認證信狀態
async function updateEmailStatus(email) {
    let sql = "update email_verify set isVerify = 1, modifydate = ? where email = ? order by createdate desc limit 1"
    let values = [new Date(), email]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

// 更新密碼
async function updatepasswd(passwdEncode, email) {
    let sql = `update member set password = ?, modifydate = ? where email = ? AND provider = 'user' order by createdate desc limit 1`
    let values = [passwdEncode, new Date(), email]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

// 更新密碼
async function updatepasswd(passwdEncode, email) {
    let sql = `update member set password = ?, modifydate = ? where email = ? AND provider = 'user' order by createdate desc limit 1`
    let values = [passwdEncode, new Date(), email]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

// 最新的驗證碼
async function isExistVerifyCode(email) {
    let sql = "SELECT verifycode FROM email_verify WHERE email = ? AND isVerify = 0 order by createdate desc Limit 1"
    let values = [email]
    const dataList = await query(sql, values)
    const data = JSON.parse(JSON.stringify(dataList))
    return data[0]
}

// 最新的已驗證通過的驗證碼
async function isExistVerifyCodeLast(email) {
    let sql = "SELECT verifycode FROM email_verify WHERE email = ? AND isVerify = 1 order by createdate desc Limit 1"
    let values = [email]
    const dataList = await query(sql, values)
    const data = JSON.parse(JSON.stringify(dataList))
    return data[0]
}

module.exports = {
    isExistEmail,
    isVerifyEmail,
    insertVerifyCodeDB,
    googleSignUp,
    userSignUp,
    verifyPasswd,
    updateEmailStatus,
    isExistVerifyCode,
    updatepasswd,
    isExistVerifyCodeLast,
    sendCodeCount,
};