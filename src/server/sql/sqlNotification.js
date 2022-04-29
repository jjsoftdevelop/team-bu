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

// 取得通知
// typeID 1:個人通知 2:系統通知 3:要求加入 4:邀請加入 5:球隊同意加入
// 6:球員同意加入 7:球隊拒絕加入 8:球員拒絕加入
async function getNotification({ memberID, typeID }) {
    const typeReplace = typeID && typeID.length > 0 ? typeID.replaceAll(',',' OR notification.typeID = ') : ''
    let sql = `SELECT DISTINCT notification.pid, notification.typeID, notification.createdate, notification.teamID, 
                notification.playerID, member.picture, notification.title, notification.content FROM notification
                LEFT JOIN member ON member.pid = notification.playerID
                WHERE notification.receiverID = ${memberID} AND notification.isShow = '1' ${typeReplace ? `AND (${typeReplace})` : ''}
                ORDER BY createdate DESC`
    const res = await query(sql)
    const data = JSON.parse(JSON.stringify(res))
    return data
}
// 更新通知
async function updateNotification({ pid, isShow, isRead }) {
    let sql
    if (isShow && isRead) {
        sql = `UPDATE notification set isShow = ${isShow}, isRead = ${isRead} modifydate = ? where pid = ${pid}`
    }
    else if (isShow) {
        sql = `UPDATE notification set isShow = ${isShow}, modifydate = ? where pid = ${pid}`

    } else if (isRead) {
        sql = `UPDATE notification set isRead = ${isRead}, modifydate = ? where pid = ${pid}`
    }
    let values = [new Date()]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

module.exports = {
    insertNotificationDB,
    getNotification,
    updateNotification,
}