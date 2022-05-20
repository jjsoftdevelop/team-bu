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
    let sql = `SELECT A.teamID, B.name, B.logoUrl, D.rankText, E.categoryText, E.categoryID, B.city, F.typeText, A.teamMemberLevelID, A.teamMemberStatusID
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
// 帳號相關資訊
async function getMyJoinSport(email, provider) {
    let sql = ` SELECT DISTINCT D.categoryID,B.categoryText FROM member AS A 
                LEFT JOIN team_member AS C ON A.pid = C.memberID
                LEFT JOIN team AS D ON D.pid = C.teamID
                LEFT JOIN team_category AS B ON B.categoryID = D.categoryID
                WHERE email = ? AND provider = ?`
    let values = [email, provider]
    let dataList = await query(sql, values)
    const data = JSON.parse(JSON.stringify(dataList))
    return data
}
// 取得我所有的腳色數量
async function getMyRoleOnTeams(email, provider) {
    let sql = `SELECT C.teamMemberLevelID FROM member AS A 
    LEFT JOIN team_member AS C ON A.pid = C.memberID
    WHERE email = ? AND provider = ?  AND C.teamMemberStatusID = 3`
    let values = [email, provider]
    let dataList = await query(sql, values)
    const data = JSON.parse(JSON.stringify(dataList))
    return data
}

module.exports = {
    getOwnTeam,
    getMemberName,
    getMyteam,
    getMyJoinSport,
    getMyRoleOnTeams
}