const express = require('express')
const router = express.Router()
const authMiddleWare = require('../../server/middleware/authMiddleWare')
const base64Obj = require('../utils/base64')
const { insertNotificationDB, getNotification, updateNotification } = require('../sql/sqlNotification')

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
        const data = await insertNotificationDB({ title, content, receiverID, typeID, extra, playerID, teamID })
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
router.get('/notification', async function (req, res, next) {
    try {
        let returnObj = {}
        const memberID = base64Obj.decodeNumber(req.session.user.pid)
        // 1:個人通知 2:系統通知 3:要求加入 4:邀請加入 5:球隊同意加入
        // 6:球員同意加入 7:球隊拒絕加入 8:球員拒絕加入
        const typeID = req.query.typeID
        const data = await getNotification({ memberID, typeID })
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

// 更新邀請通知
router.put('/notification/:id', async function (req, res, next) {
    const pid = req.params.id
    const isShow = req.body.isShow ? req.body.isShow : ''
    const isRead = req.body.isRead ? req.body.isRead : ''
    try {
        let returnObj = {}
        const data = await updateNotification({ pid, isShow, isRead })
        if (data) {
            returnObj.message = '修改成功'
            returnObj.type = '1'
            res.status(200).json(returnObj)
        } else {
            returnObj.message = '發生錯誤'
            returnObj.type = '2'
            res.status(500).json(returnObj)
        }
    } catch (err) {
        next(err)
    }

})

module.exports = router