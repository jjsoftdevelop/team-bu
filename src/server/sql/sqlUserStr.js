const { query } = require('../../config/async-db')

// 取得我權限為管理員的球隊清單
async function getOwnTeam(pid) {
    let sql = `SELECT * FROM team_member WHERE memberID = ? AND teamMemberLevelID = 3`
    let values = [pid]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

// 取得user姓名
async function getMemberName(pid) {
    let sql = `SELECT nickname FROM member WHERE pid = ?`
    let values = [pid]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data[0]
}

// 取得我加入的球隊
async function getMyteam(pid) {
    let sql = `SELECT A.teamID, B.name, B.logoUrl, D.rankText, E.categoryText, B.city, F.typeText, A.teamMemberLevelID
                FROM team_member AS A
                LEFT JOIN team AS B ON B.pid = A.teamID
                LEFT JOIN member AS C ON C.pid = A.memberID
                LEFT JOIN team_rank AS D ON D.rankID = B.rankID
                LEFT JOIN team_category AS E ON E.categoryID = B.categoryID
                LEFT JOIN team_type AS F ON F.typeID = B.typeID
                WHERE memberID = ?`
    let values = [pid]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

module.exports = {
    getOwnTeam,
    getMemberName,
    getMyteam
}