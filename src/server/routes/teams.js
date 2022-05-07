const express = require('express')
const router = express.Router()
const axios = require('axios');
const authMiddleWare = require('../../server/middleware/authMiddleWare')
const base64Obj = require('../utils/base64')
const {
    insertTeamDB,
    insertTeamMemberDB,
    isExistTeamMember,
    updateTeamMemberStatus,
    selectTeamDB,
    getTeamJoinList,
    getTeamManagerList,
    getTeamInfo,
    modifyTeamDB,
    getMemberByEmail,
} = require('../sql/sqlTeamsStr')
const {
    getMemberName
} = require('../sql/sqlUserStr')
const { updateNotification, getNotificationCate } = require('../sql/sqlNotification')

// 發送通知 api
async function sendNotification({ title, content, receiverID, typeID, extra, playerID,
    teamID }) {
    try {
        await axios.post(`${process.env.BASE_URL}/api/notification/send`, {
            title,
            content,
            receiverID,
            typeID,
            extra,
            playerID,
            teamID,
        })
    } catch (err) {
        console.log(err)
    }
}

// 創建球隊
router.post('/teams/create', authMiddleWare, async function (req, res, next) {
    try {
        const name = req.body.name
        const logoUrl = req.body.logoUrl
        const bannerUrl = req.body.bannerUrl
        const description = req.body.description
        const categoryID = req.body.categoryID
        const typeID = req.body.typeID
        const rankID = req.body.rankID
        const city = req.body.city
        const leagueTag = req.body.leagueTag
        const creatorID = base64Obj.decodeNumber(req.session.user.pid)
        const picture = req.session.user.picture
        let returnObj = {}
        let id = await insertTeamDB({
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
        })
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

// 修改球隊
router.put('/teams/:teamID', authMiddleWare, async function (req, res, next) {
    try {
        const teamID = base64Obj.decodeNumber(req.params.teamID)
        const name = req.body.name
        const logoUrl = req.body.logoUrl
        const bannerUrl = req.body.bannerUrl
        const description = req.body.description
        const categoryID = req.body.categoryID
        const typeID = req.body.typeID
        const rankID = req.body.rankID
        const city = req.body.city
        const leagueTag = req.body.leagueTag
        const modifierID = base64Obj.decodeNumber(req.session.user.pid)
        let returnObj = {}
        await modifyTeamDB({
            name,
            logoUrl,
            bannerUrl,
            description,
            categoryID,
            typeID,
            rankID,
            city,
            leagueTag,
            modifierID,
            teamID
        })
        const data = await selectTeamDB(
            { teamID }
        )
        if (data[0] && data[0].pid) {
            returnObj.message = '修改成功'
            returnObj.type = '1'
            returnObj.data = data
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

// 邀請加入 or 申請加入
router.post('/teams/join/:teamID/:memberID', async function (req, res, next) {
    try {
        const teamID = base64Obj.decodeNumber(req.params.teamID)
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
        // 取得球隊管理員清單
        const teamManager = await getTeamManagerList(teamID)
        let returnObj = {}
        if (!data) {
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
                await sendNotification({ title: teamName, content: `${teamName} 邀請您加入球隊`, playerID: memberID, receiverID: memberID, typeID: 4, teamID })
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
            // 已經申請過了
            // 1:邀請球員中 2:申請加入中 3:已加入 4:申請已拒絕 5:邀請已拒絕 9:已移除
            const { teamMemberStatusID: oldStatusID } = data
            // 情境：球隊拒絕後又送邀請
            if (oldStatusID === 4) {
                await updateTeamMemberStatus({
                    teamMemberLevelID,
                    teamMemberStatusID,
                    memberID,
                    teamID
                })
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
                returnObj.message = '申請成功'
                returnObj.type = '1'
                res.status(200).json(returnObj)
            } if (oldStatusID === 5) {
                await updateTeamMemberStatus({
                    teamMemberLevelID,
                    teamMemberStatusID,
                    memberID,
                    teamID
                })
                // 發通知給球員
                await sendNotification({ title: teamName, content: `${teamName} 邀請您加入球隊`, playerID: memberID, receiverID: memberID, typeID: 4, teamID })
                returnObj.message = '申請成功'
                returnObj.type = '1'
                res.status(200).json(returnObj)
            } else {
                returnObj.message = '已存在'
                returnObj.type = '9'
                res.status(500).json(returnObj)
            }

        }
    } catch (err) {
        next(err)
    }
});

// 修改申請狀態(決定要不要同意)
// 1:個人通知 2:系統通知 3:要求加入 4:邀請加入 5:球隊同意加入
// 6:球員同意加入 7:球隊拒絕加入 8:球員拒絕加入
router.put('/teams/status/:teamID/:memberID', async function (req, res, next) {
    try {
        const teamID = base64Obj.decodeNumber(req.params.teamID)
        const memberID = base64Obj.decodeNumber(req.params.memberID)
        const newStatusID = req.body.teamMemberStatusID
        const { teamMemberStatusID: oldStatusID, teamMemberLevelID: levelID, memberName, teamName, } = await isExistTeamMember(teamID, memberID)
        let returnObj = {}
        const data = await updateTeamMemberStatus({
            teamMemberStatusID: newStatusID,
            memberID,
            teamID,
        })
        // 球隊同意使用者加入 發通知給使用者 並更新邀請函isShow 為 0 
        if (oldStatusID === 2 && newStatusID === 3) {
            // 發送同意通知給使用者
            await sendNotification({
                title: teamName,
                content: `${teamName} 已同意您的加入`,
                receiverID: memberID,
                typeID: 5,
                teamID
            })
            // 同步更新 此邀請涵狀態 isShow 為 0 
            const notiCateList = await getNotificationCate({ teamID, playerID: memberID, typeID: 3 })
            if (notiCateList && notiCateList.length > 0) {
                notiCateList.forEach(async item => {
                    await updateNotification({
                        isShow: '0',
                        pid: item.pid
                    })
                })
            }

            // 如果同意使用者成為管理員 要將要求加入球隊的通知 同步給使用者
            if (levelID === 3) {
                const teamMember = await getTeamJoinList(teamID)
                if (teamMember && teamMember.length > 0) {
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
        }
        // 使用者同意加入球隊 發通知給球隊管理員
        if (oldStatusID === 1 && newStatusID === 3) {
            const teamManager = await getTeamManagerList(teamID)
            if (teamManager && teamManager.length > 0) {
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
            // 同步更新 此邀請涵狀態 isShow 為 0 
            const notiCateList = await getNotificationCate({ teamID, playerID: memberID, typeID: 4 })
            if (notiCateList && notiCateList.length > 0) {
                notiCateList.forEach(async item => {
                    await updateNotification({
                        isShow: '0',
                        pid: item.pid
                    })
                })
            }
        }

        // 球隊拒絕使用者加入 發通知給使用者
        if (oldStatusID === 2 && newStatusID === 4) {
            await sendNotification({
                title: teamName,
                content: `${teamName} 已拒絕您的加入`,
                receiverID: memberID,
                typeID: 7,
                teamID
            })
            // 同步更新 此邀請涵狀態 isShow 為 0 
            const notiCateList = await getNotificationCate({ teamID, playerID: memberID, typeID: 3 })
            if (notiCateList && notiCateList.length > 0) {
                notiCateList.forEach(async item => {
                    await updateNotification({
                        isShow: '0',
                        pid: item.pid
                    })
                })
            }
        }

        // 使用者拒絕加入球隊 發通知給球隊管理員
        if (oldStatusID === 1 && newStatusID === 5) {
            const teamManager = await getTeamManagerList(teamID)
            if (teamManager && teamManager.length > 0) {
                teamManager.forEach(async (item) => {
                    await sendNotification({
                        title: memberName,
                        content: `${memberName} 已拒絕 ${teamName} 的邀請`,
                        receiverID: item.memberID,
                        typeID: 8,
                        playerID: memberID,
                        teamID
                    })
                })
            }
            // 同步更新 此邀請涵狀態 isShow 為 0 
            const notiCateList = await getNotificationCate({ teamID, playerID: memberID, typeID: 4 })
            if (notiCateList && notiCateList.length > 0) {
                notiCateList.forEach(async item => {
                    await updateNotification({
                        isShow: '0',
                        pid: item.pid
                    })
                })
            }
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
        const memberID = req.session.user && req.session.user.pid ? base64Obj.decodeNumber(req.session.user.pid) : ''
        const teamID = req.params.teamID !== 'undefined' ? base64Obj.decodeNumber(req.params.teamID) : ''
        const categoryID = req.query.categoryID !== 'undefined' ? req.query.categoryID : ''
        const name = req.query.name !== 'undefined' ? base64Obj.decodeString(req.query.name) : ''
        let data = await selectTeamDB(
            { teamID, categoryID, name }
        )
        if (data) {
            // 查詢是否已加入過球隊
            if (memberID) {
                const addData = await Promise.all(
                    data.map(async team => {
                        const teamMember = await isExistTeamMember(team.pid, memberID)
                        if (teamMember) {
                            return {
                                ...team,
                                teamMemberLevelID: teamMember.teamMemberLevelID,
                                teamMemberLevelText: teamMember.teamMemberLevelText,
                                teamMemberStatusID: teamMember.teamMemberStatusID,
                                teamMemberStatusText: teamMember.teamMemberStatusText
                            }
                        } else {
                            return team
                        }
                    })
                )
                res.status(200).json(addData)
            } else {
                res.status(200).json(data)

            }
        } else {
            res.status(500).json(data)
        }

    } catch (err) {
        next(err)
    }
});

// email 找尋球員
router.post('/teams/:email', async function (req, res, next) {
    try {
        const email = req.params.email
        const result = await getMemberByEmail({ email })
        const member = result.map(item => {
            return {
                ...item,
                pid: base64Obj.encode(item.pid),
                teamID: item.teamID ? base64Obj.encode(item.teamID) : ''
            }
        })
        if (member) {
            res.status(200).json(member)
        } else {
            res.status(500).json(data)
        }

    } catch (err) {
        next(err)
    }
});

// export module
module.exports = router