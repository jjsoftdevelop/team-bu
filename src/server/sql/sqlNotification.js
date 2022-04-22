const { query } = require('../../config/async-db')

// 寫入通知資料表
async function insertNotificationDB(
    title,
    content,
    receiverID,
    typeID,
    extra,
    playerID,
    teamID,
) {
    let sql = "INSERT INTO notification(title, content, receiverID, typeID ,extra, createdate, playerID, teamID) VALUES(?,?,?,?,?,?,?,?)"
    let values = [
        title,
        content,
        receiverID,
        typeID,
        extra,
        new Date(),
        playerID,
        teamID,
    ]
    const res = await query(sql, values)

    const data = JSON.parse(JSON.stringify(res))
    return data.insertId
}

// 取得要求加入球隊的通知
async function getJoinNotification(memberID) {
    let sql = `SELECT DISTINCT notification.createdate,notification.teamID,notification.playerID, member.nickname, team.name, member.picture FROM notification
				LEFT JOIN team_member
				ON notification.playerID = team_member.memberID
                LEFT JOIN member
                ON notification.playerID = member.pid
                LEFT JOIN team
                ON notification.teamID = team.pid
                WHERE notification.typeID = 3 AND team_member.teamMemberStatusID = 2 AND notification.receiverID = ?
                ORDER BY createdate DESC`
    let values = [memberID]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

module.exports = {
    insertNotificationDB,
    getJoinNotification,
}