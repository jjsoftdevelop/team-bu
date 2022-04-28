const { query } = require('../../config/async-db')

// 寫入通知資料表
async function insertNotificationDB(
    {
        title,
        content,
        receiverID,
        typeID,
        extra,
        playerID,
        teamID,
    }
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
    let sql = `SELECT DISTINCT notification.createdate,notification.teamID,notification.playerID,member.picture,notification.title, notification.content FROM notification
                LEFT JOIN member ON member.pid = notification.playerID
                WHERE notification.typeID = 3 AND notification.receiverID = ? AND notification.isShow = '1'
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