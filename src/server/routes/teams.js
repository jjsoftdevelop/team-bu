const express = require('express')
const router = express.Router()
const authMiddleWare = require('../../server/middleware/authMiddleWare')
const base64Obj = require('../utils/base64')
const {
    insertTeamDB,
    insertTeamMemberDB,
    isExistTeamMember,
    updateTeamMemberStatus,
    selectTeamDB,
    sendNotification,
    getTeamJoinList,
    getTeamManagerList,
    getTeamInfo,
} = require('../sql/sqlTeamsStr')
const {
    getMemberName
} = require('../sql/sqlUserStr')


// 創建球隊
router.post('/teams/create', authMiddleWare, async function (req, res, next) {
    try {
        const name = req.body.name
        const logoUrl = req.body.logoUrl
        const bannerUrl = req.body.bannerUrl
        const description = req.body.description
        const categoryID = req.body.categoryID
        const typeID = req.body.categoryID
        const rankID = req.body.rankID
        const city = req.body.city
        const leagueTag = req.body.leagueTag
        const creatorID = base64Obj.decodeNumber(req.session.user.pid)
        const picture = req.session.user.picture
        let returnObj = {}
        let id = await insertTeamDB(
            name,
            logoUrl,
            bannerUrl,
            description,
            categoryID,
            typeID,
            rankID,
            city,
            leagueTag,
            creatorID
        )
        if (id) {
            await insertTeamMemberDB(
                id,
                creatorID,
                picture,
                3,
                3,
            )
            returnObj.message = '創建成功'
            returnObj.type = '1'
            res.status(200).json(returnObj)
        } else {
            returnObj.message = '創建失敗'
            returnObj.type = '9'
            res.status(500).json(returnObj)
        }

    } catch (err) {
        next(err)
    }
});

// 邀請加入 or 申請加入
router.post('/teams/join/:teamID/:memberID', async function (req, res, next) {
    try {
        const teamID = req.params.teamID
        const memberID = base64Obj.decodeNumber(req.params.memberID)
        const picture = req.body.picture
        // 申請 OR 邀請 加入的權限 
        // teamMemberLevelID:1 球員 ,teamMemberLevelID: 2 粉絲, teamMemberLevelID: 3 管理員
        const teamMemberLevelID = req.body.teamMemberLevelID
        // 判斷是申請加入(type:2) 還是 邀請加入 (type:1)
        const type = req.body.type
        const teamMemberStatusID = type === 'join' ? 2 : type === 'invite' ? 1 : 4
        // 取得球員名稱
        const { nickname: memberName } = await getMemberName(memberID)
        // 取得球隊名稱
        const { name: teamName } = await getTeamInfo(teamID)
        // 查詢是否已加入過球隊
        const data = await isExistTeamMember(teamID, memberID)
        let returnObj = {}
        if (!data) {
            // 取得球隊管理員清單
            const teamManager = await getTeamManagerList(teamID)
            let id = await insertTeamMemberDB(
                teamID,
                memberID,
                picture,
                teamMemberLevelID,
                teamMemberStatusID,
            )
            if (type === 'join') {
                // 同步通知球隊管理員
                teamManager.forEach(async item => {
                    //title, content, receiverID, typeID, extra, playerID, teamID,
                    await sendNotification({
                        title: memberName,
                        content: `${memberName} 要求加入 ${teamName}`,
                        receiverID: item.memberID,
                        typeID: 3,
                        playerID: memberID,
                        teamID
                    })
                })
            } else if (type === 'invite') {
                await sendNotification({ receiverID: memberID, typeID: 4, teamID })
            }
            if (id) {
                returnObj.message = '申請成功'
                returnObj.type = '1'
                res.status(200).json(returnObj)
            } else {
                returnObj.message = '申請失敗'
                returnObj.type = '9'
                res.status(500).json(returnObj)
            }
        } else {
            returnObj.message = '已存在'
            returnObj.type = '9'
            res.status(500).json(returnObj)
        }
    } catch (err) {
        next(err)
    }
});

// 修改申請狀態
router.put('/teams/status/:teamID/:memberID', async function (req, res, next) {
    try {
        const teamID = req.params.teamID
        const memberID = base64Obj.decodeNumber(req.params.memberID)
        const newStatusID = req.body.teamMemberStatusID
        const { teamMemberStatusID: oldStatusID, teamMemberLevelID: levelID, memberName, teamName, } = await isExistTeamMember(teamID, memberID)
        let returnObj = {}
        const data = await updateTeamMemberStatus(
            newStatusID,
            memberID,
            teamID,
        )


        // 球隊同意使用者加入 發通知給使用者
        if (oldStatusID === 2 && newStatusID === 3) {
            await sendNotification({
                title: teamName,
                content: `${teamName} 已同意您的加入`,
                receiverID: memberID,
                typeID: 5,
                teamID
            })
            if (levelID === 3) {
                // 如果同意使用者成為管理員 要將要求加入球隊的通知 同步給使用者
                const teamMember = await getTeamJoinList(teamID)
                teamMember.forEach(async (item) => {
                    await sendNotification({
                        title: memberName,
                        content: `${memberName} 要求加入 ${teamName}`,
                        receiverID: memberID,
                        typeID: 3,
                        playerID: item.memberID,
                        teamID
                    })
                })
            }
        }
        // 使用者同意加入球隊 發通知給球隊管理員
        if (oldStatusID === 1 && newStatusID === 3) {
            const teamManager = await getTeamManagerList(teamID)
            teamManager.forEach(async (item) => {
                await sendNotification({
                    title: memberName,
                    content: `${memberName} 已同意 ${teamName} 的邀請`,
                    receiverID: item.memberID,
                    typeID: 6,
                    playerID: memberID,
                    teamID
                })
            })
        }

        if (data) {
            returnObj.message = '修改成功'
            returnObj.type = '1'
            res.status(200).json(returnObj)
        } else {
            returnObj.message = '修改失敗'
            returnObj.type = '9'
            res.status(500).json(returnObj)
        }
    } catch (err) {
        next(err)
    }
});

// 找尋球隊
router.get('/teams', async function (req, res, next) {
    try {
        let data = await selectTeamDB()
        if (data) {
            res.status(200).json(data)
        } else {
            res.status(500).json(data)
        }

    } catch (err) {
        next(err)
    }
});

// 找尋球隊
router.get('/teams/:teamID', async function (req, res, next) {
    try {
        const teamID = req.params.teamID !== 'undefined' ? req.params.teamID : ''
        const categoryID = req.query.categoryID
        const name = base64Obj.decodeString(req.query.name)
        let data = await selectTeamDB(
            teamID, categoryID, name
        )
        if (data) {
            res.status(200).json(data)
        } else {
            res.status(500).json(data)
        }

    } catch (err) {
        next(err)
    }
});

// export module
module.exports = router