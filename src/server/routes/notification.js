const express = require('express')
const router = express.Router()
const authMiddleWare = require('../../server/middleware/authMiddleWare')
const base64Obj = require('../utils/base64')
const { insertNotificationDB, getJoinNotification } = require('../sql/sqlNotification')

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