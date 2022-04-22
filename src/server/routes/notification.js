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

// 發送通知
router.post('/notification/send', async function (req, res, next) {
    try {
        const title = req.body.title
        const content = req.body.content
        const receiverID = req.body.receiverID
        const typeID = req.body.typeID
        const extra = req.body.extra
        const playerID = req.body.playerID
        const teamID = req.body.teamID
        let returnObj = {}
        const data = await insertNotificationDB(title, content, receiverID, typeID, extra, playerID, teamID)
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
        let memberID = base64Obj.decodeNumber(req.session.user.pid)
        const data = await getJoinNotification(memberID)
        if (data) {
            res.status(200).json(data)
        } else {
            returnObj.message = '發生錯誤'
            returnObj.type = '2'
            res.status(500).json(returnObj)
        }

    } catch (err) {
        next(err)
    }
});

module.exports = router