const express = require('express')
const router = express.Router()
const authMiddleWare = require('../../server/middleware/authMiddleWare')
const base64Obj = require('../utils/base64')
const { getOwnTeam} = require('../sql/sqlUserStr')

// 取得我權限為管理員的球隊清單
router.get('/user/own', authMiddleWare, async function (req, res, next) {
    try {
        let returnObj = {}
        let pid = base64Obj.decodeNumber(req.session.user.pid)
        const data = await getOwnTeam(pid)
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