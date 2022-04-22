const { query } = require('../../config/async-db')

// 取得我權限為管理員的球隊清單
async function getOwnTeam(pid) {
    let sql = `SELECT * FROM team_member WHERE memberID = ? AND teamMemberLevelID = 3`
    let values = [pid]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

module.exports = {
    getOwnTeam
}