const express = require('express')
const router = express.Router()
const { query } = require('../../config/async-db')
const authMiddleWare = require('../../server/middleware/authMiddleWare')
const base64Obj = require('../utils/base64')

async function insertNotificationDB(
    title,
    content,
    receiverID,
    typeID,
    extra,
) {
    let sql = "INSERT INTO notification(title, content, receiverID, typeID ,extra, createdate) VALUES(?,?,?,?,?,?)"
    let values = [
        title,
        content,
        receiverID,
        typeID,
        extra,
        new Date()
    ]
    const res = await query(sql, values)

    const data = JSON.parse(JSON.stringify(res))
    return data.insertId
}

async function getJoinNotification(teamID) {
    let sqlString = teamID.replaceAll(',', ' OR team_member.teamID =')
    let sql = `SELECT DISTINCT notification.*, member.nickname, team.name, member.picture FROM notification 
                LEFT JOIN team_member 
                ON notification.receiverID = team_member.teamID
                LEFT JOIN member
                ON notification.extra = member.pid
                LEFT JOIN team
                ON team_member.teamID = team.pid  
                WHERE notification.typeID = 3 AND (team_member.teamMemberStatusID = 2 AND team_member.teamID = ${sqlString})
                ORDER BY createdate DESC`
    let values = [teamID]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

// 發送通知
router.post('/notification/send', async function (req, res, next) {
    try {
        const title = req.body.title
        const content = req.body.content
        const receiverID = req.body.receiverID
        const typeID = req.body.typeID
        const extra = req.body.extra
        let returnObj = {}
        const data = await insertNotificationDB(title, content, receiverID, typeID, extra)
        if (data) {
            returnObj.message = '發送成功'
            returnObj.type = '1'
            res.status(200).json(returnObj)
        } else {
            returnObj.message = '發送失敗'
            returnObj.type = '2'
            res.status(500).json(returnObj)
        }

    } catch (err) {
        next(err)
    }
});

// 取得邀請的通知
router.get('/notification/join', async function (req, res, next) {
    try {
        let returnObj = {}
        let teamID = req.query.teamID
        const data = await getJoinNotification(teamID)
        if (data) {
            res.status(200).json(data)
        } else {
            returnObj.message = '發送失敗'
            returnObj.type = '2'
            res.status(500).json(returnObj)
        }

    } catch (err) {
        next(err)
    }
});

module.exports = router