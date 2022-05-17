const express = require('express')
const router = express.Router()
const authMiddleWare = require('../../server/middleware/authMiddleWare')

const base64Obj = require('../utils/base64')
const { getOwnTeam, getMyteam, getMyJoinSport } = require('../sql/sqlUserStr')
const { getTeamMemberPic } = require('../sql/sqlTeamsStr')

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

// 取得我加入的球隊
router.get('/user/myTeam', authMiddleWare, async function (req, res, next) {
    try {
        let returnObj = {}
        let pid = base64Obj.decodeNumber(req.session.user.pid)
        const result = await getMyteam(pid)
        const myteam = await Promise.all(result.map(async team => {
            const memberPic = await getTeamMemberPic(team.teamID)
            team.teamID = base64Obj.encode(team.teamID)
            team.memberPic = []
            memberPic.forEach(pic => {
                team.memberPic.push(pic.picture)
            })
            return team
        }))
        if (myteam) {
            res.status(200).json(myteam)
        } else {
            returnObj.message = '發生錯誤'
            returnObj.type = '2'
            res.status(500).json(returnObj)
        }

    } catch (err) {
        next(err)
    }
});
// -------取得帳號相關資訊--------
router.get('/user/getMyJoinSport', async (req, res, next) => {
    try {
        const email = req.session.user.email
        const provider = req.session.user.provider
        const data = await getMyJoinSport(email, provider)
        res.status(200).json(data)
    } catch (err) {
        next(err)
    }
})


module.exports = router