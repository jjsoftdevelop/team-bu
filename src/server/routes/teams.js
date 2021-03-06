const express = require('express')
const router = express.Router()
const axios = require('axios');
const authMiddleWare = require('../../server/middleware/authMiddleWare')
const base64Obj = require('../utils/base64')
const {
    insertTeamDB,
    isExistTeamPlayer,
    updateTeamPlayerStatus,
    selectTeamDB,
    getTeamJoinList,
    getTeamManagerList,
    getTeamInfo,
    modifyTeamDB,
    getMemberByEmail,
    getTeamMemberList,
    insertPost,
    getPost,
    getPostSocial,
    insertPostSocial,
    updatePostSocial,
    getPostSocialCount,
    deletePost,
    editPost,
    insertEventDB,
    getTeamEvent,
    updateEventDB,
    insertRelative,
    insertPlayer,
} = require('../sql/sqlTeamsStr')
const {
    getMemberName
} = require('../sql/sqlUserStr')
const { updateNotification, getNotificationCate, insertNotificationDB } = require('../sql/sqlNotification')
const { TEAM_PLAYER_LEVEL } = require('../constans/teamPlayerLevel.js')
const { TEAM_PLAYER_STATUS } = require('../constans/teamPlayerStatus.js')

// 發送通知 api
// async function insertNotificationDB({ title, content, receiverID, typeID, extra, playerID,
//     teamID }) {
//     try {
//         await axios.post(`${process.env.BASE_URL}/api/notification/send`, {
//             title,
//             content,
//             receiverID,
//             typeID,
//             extra,
//             playerID,
//             teamID,
//         })
//     } catch (err) {
//         console.log(err)
//     }
// }

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
        const nickname = req.session.user.nickname
        let returnObj = {}
        if (!name || !creatorID || !typeID || !rankID || !city) {
            res.status(400).json({ message: '缺少必要參數' })

        } else {
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
                const playerID = await insertPlayer({
                    memberID: creatorID,
                    number: '',
                    nickname,
                    position: '',
                    picture,
                    creator: creatorID
                })
                await insertRelative({
                    memberID: creatorID,
                    playerID,
                    teamID: id,
                    levelID: TEAM_PLAYER_LEVEL.MANAGER,
                    statusID: TEAM_PLAYER_STATUS.JOIN,
                })
                returnObj.message = '創建成功'
                returnObj.type = '1'
                res.status(200).json(returnObj)
            } else {
                returnObj.message = '創建失敗'
                returnObj.type = '9'
                res.status(500).json(returnObj)
            }
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
        const creatorID = base64Obj.decodeNumber(req.session.user.pid)
        const picture = req.body.picture
        // 申請 OR 邀請 加入的權限 
        // levelID:1 球員 ,levelID: 2 粉絲, levelID: 3 管理員
        const levelID = req.body.levelID
        // 判斷是申請加入(type:2) 還是 邀請加入 (type:1)
        const type = req.body.type
        const newStatusID = type === 'join' ? 2 : type === 'invite' ? 1 : 4
        // 取得球員名稱
        const { nickname: memberName } = await getMemberName(memberID)
        // 取得球隊名稱
        const { name: teamName } = await getTeamInfo(teamID)
        // 查詢是否已加入過球隊
        const isExist = await isExistTeamPlayer({ teamID, memberID })
        // 取得球隊管理員清單
        const teamManager = await getTeamManagerList(teamID)
        let returnObj = {}
        if (!isExist) {
            const playerID = await insertPlayer({
                memberID,
                number: '',
                nickname: memberName,
                position: '',
                picture,
                creator: creatorID
            })

            let id = await insertRelative({
                memberID,
                playerID,
                teamID,
                levelID,
                statusID: newStatusID,
            })
            if (type === 'join') {
                // 同步通知球隊管理員
                teamManager.forEach(async item => {
                    await insertNotificationDB({
                        title: memberName,
                        content: `${memberName} 要求加入 ${teamName}`,
                        receiverID: item.memberID,
                        typeID: 3,
                        playerID,
                        teamID
                    })
                })
            } else if (type === 'invite') {
                await insertNotificationDB({ title: teamName, content: `${teamName} 邀請您加入球隊`, playerID, receiverID: memberID, typeID: 4, teamID })
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
            const { statusID: oldStatusID } = isExist
            // 情境：球隊拒絕後又送邀請
            if (oldStatusID === 4) {
                await updateTeamPlayerStatus({
                    levelID,
                    statusID: newStatusID,
                    playerID: isExist.playerID,
                    teamID
                })
                // 同步通知球隊管理員
                teamManager.forEach(async item => {
                    //title, content, receiverID, typeID, extra, playerID, teamID,
                    await insertNotificationDB({
                        title: memberName,
                        content: `${memberName} 要求加入 ${teamName}`,
                        receiverID: item.memberID,
                        typeID: 3,
                        playerID,
                        teamID
                    })
                })
                returnObj.message = '申請成功'
                returnObj.type = '1'
                res.status(200).json(returnObj)
            } if (oldStatusID === 5) {
                await updateTeamPlayerStatus({
                    levelID,
                    statusID: newStatusID,
                    memberID,
                    teamID
                })
                // 發通知給球員
                await insertNotificationDB({ title: teamName, content: `${teamName} 邀請您加入球隊`, playerID, receiverID: memberID, typeID: 4, teamID })
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
router.put('/teams/status/:teamID/:playerID', async function (req, res, next) {
    try {
        const teamID = base64Obj.decodeNumber(req.params.teamID)
        const playerID = base64Obj.decodeNumber(req.params.playerID)
        const {
            nickname,
            teamName,
            levelID,
            statusID,
            memberID
        } = await isExistTeamPlayer({ teamID, playerID })
        const newStatusID = req.body.statusID
        const oldStatusID = statusID
        let returnObj = {}
        // 更新狀態
        const data = await updateTeamPlayerStatus({
            statusID: newStatusID,
            playerID,
            teamID,
        })
        // 球隊同意使用者加入 發通知給使用者 並更新邀請函isShow 為 0 
        if (oldStatusID === 2 && newStatusID === 3) {
            // 發送同意通知給使用者
            await insertNotificationDB({
                title: teamName,
                content: `${teamName} 已同意您的加入`,
                receiverID: memberID,
                typeID: 5,
                teamID
            })
            // 同步更新 此邀請涵狀態 isShow 為 0 
            const notiCateList = await getNotificationCate({ teamID, playerID, typeID: 3 })
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
                        await insertNotificationDB({
                            title: item.nickname,
                            content: `${item.nickname} 要求加入 ${teamName}`,
                            receiverID: memberID,
                            typeID: 3,
                            playerID,
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
                    await insertNotificationDB({
                        title: nickname,
                        content: `${nickname} 已同意 ${teamName} 的邀請`,
                        receiverID: item.memberID,
                        typeID: 6,
                        playerID,
                        teamID
                    })
                })
            }
            // 如果同意使用者成為管理員 要將要求加入球隊的通知 同步給使用者
            if (levelID === 3) {
                const teamMember = await getTeamJoinList(teamID)
                if (teamMember && teamMember.length > 0) {
                    teamMember.forEach(async (item) => {
                        await insertNotificationDB({
                            title: item.nickname,
                            content: `${item.nickname} 要求加入 ${teamName}`,
                            receiverID: memberID,
                            typeID: 3,
                            playerID: item.playerID,
                            teamID
                        })
                    })
                }
            }
            // 同步更新 此邀請涵狀態 isShow 為 0 
            const notiCateList = await getNotificationCate({ teamID, playerID, typeID: 4 })
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
            await insertNotificationDB({
                title: teamName,
                content: `${teamName} 已拒絕您的加入`,
                receiverID: memberID,
                typeID: 7,
                teamID
            })
            // 同步更新 此邀請涵狀態 isShow 為 0 
            const notiCateList = await getNotificationCate({ teamID, playerID, typeID: 3 })
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
                    await insertNotificationDB({
                        title: nickname,
                        content: `${nickname} 已拒絕 ${teamName} 的邀請`,
                        receiverID: item.memberID,
                        typeID: 8,
                        playerID,
                        teamID
                    })
                })
            }
            // 同步更新 此邀請涵狀態 isShow 為 0 
            const notiCateList = await getNotificationCate({ teamID, playerID, typeID: 4 })
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



// 找尋球隊且是否加入過
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
                        const teamPlayer = await isExistTeamPlayer({ teamID: team.pid, memberID })
                        if (teamPlayer) {
                            return {
                                ...team,
                                pid: base64Obj.encode(team.pid),
                                creatorID: base64Obj.encode(team.creatorID),
                                levelID: teamPlayer.levelID,
                                statusID: teamPlayer.statusID,
                            }
                        } else {
                            return {
                                ...team,
                                teamStatusID: team.statusID,
                                statusID: '',
                                pid: base64Obj.encode(team.pid),
                                creatorID: base64Obj.encode(team.creatorID),
                            }
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

// 球隊隊員
router.post('/teamMember/member', async function (req, res, next) {
    try {
        const teamID = base64Obj.decodeNumber(req.body.teamID)
        const result = await getTeamMemberList({ teamID })
        const member = result.map(item => {
            return {
                ...item,
                pid: base64Obj.encode(item.memberID),
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

// email 找尋球員
router.post('/teamMember/:email', async function (req, res, next) {
    try {
        const email = req.params.email
        const teamID = req.body.teamID ? base64Obj.decodeNumber(req.body.teamID) : ''
        const result = await getMemberByEmail({ email })
        const member = await Promise.all(result.map(async item => {
            const status = await isExistTeamPlayer({ teamID, memberID: item.pid })
            return {
                ...item,
                pid: base64Obj.encode(item.pid),
                statusID: status && status.statusID ? status.statusID : ""
            }
        }))
        if (member) {
            res.status(200).json(member)
        } else {
            res.status(500).json(data)
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

// 新增貼文
router.post('/addPost', async function (req, res, next) {
    try {
        const creatorID = base64Obj.decodeNumber(req.session.user.pid)
        const teamID = base64Obj.decodeNumber(req.body.teamID)
        const title = req.body.title
        const content = req.body.content
        const files = req.body.files.toString()
        const tags = req.body.tags.toString()
        const viewRole = req.body.viewRole ? req.body.viewRole : 'all'

        let id = await insertPost({
            teamID,
            title,
            content,
            files,
            tags,
            viewRole,
            creatorID
        })
        let postData = await getPost({ id: id })
        if (postData) {
            postData[0] = {
                ...postData[0],
                pid: base64Obj.encode(postData[0].pid),
                clapCount: 0,
                socialData: {
                    clap: null,
                    createdate: null,
                    creatorID: null,
                    modifydate: null,
                    pid: null,
                    postID: null,
                    remark: null,
                }
            }
            res.status(200).json(postData)
        } else {
            res.status(500)
        }
    } catch (err) {
        next(err)
    }
});

// 取得球隊po文
router.get('/getPost/:teamID', async function (req, res, next) {
    try {
        const teamID = base64Obj.decodeNumber(req.params.teamID)

        let postData = await getPost({ teamID: teamID })
        if (postData) {
            postData = await Promise.all(postData.map(async item => {
                const count = await getPostSocialCount({ postID: item.pid })
                const socialData = await getPostSocial({
                    postID: item.pid,
                    creatorID: base64Obj.decodeNumber(req.session.user.pid)
                })
                if (socialData) {
                    return {
                        ...item,
                        pid: base64Obj.encode(item.pid),
                        clapCount: count,
                        socialData: { ...socialData, clap: socialData.clap === 1, creatorID: base64Obj.encode(socialData.creatorID) }
                    }
                } else {
                    return {
                        ...item,
                        pid: base64Obj.encode(item.pid),
                        clapCount: count,
                        socialData: {
                            clap: null,
                            createdate: null,
                            creatorID: null,
                            modifydate: null,
                            pid: null,
                            postID: null,
                            remark: null,
                        }
                    }
                }

            }))
            res.status(200).json(postData)
        } else {
            res.status(500)
        }
    } catch (err) {
        next(err)
    }
});

// 取得po文
router.get('/getPostSingle/:postID', async function (req, res, next) {
    try {
        const postID = base64Obj.decodeNumber(req.params.postID)
        let postData = await getPost({ id: postID })
        if (postData) {
            postData = await Promise.all(postData.map(async item => {
                const count = await getPostSocialCount({ postID: item.pid })
                const socialData = await getPostSocial({
                    postID: item.pid,
                    creatorID: base64Obj.decodeNumber(req.session.user.pid)
                })
                if (socialData) {
                    return {
                        ...item,
                        pid: base64Obj.encode(item.pid),
                        clapCount: count,
                        socialData: { ...socialData, clap: socialData.clap === 1, creatorID: base64Obj.encode(socialData.creatorID) }
                    }
                } else {
                    return {
                        ...item,
                        pid: base64Obj.encode(item.pid),
                        clapCount: count,
                        socialData: {
                            clap: null,
                            createdate: null,
                            creatorID: null,
                            modifydate: null,
                            pid: null,
                            postID: null,
                            remark: null,
                        }
                    }
                }

            }))
            res.status(200).json(postData)
        } else {
            res.status(500)
        }
    } catch (err) {
        next(err)
    }
});

// 貼文互動
router.post('/addSocial', async function (req, res, next) {
    try {
        const creatorID = base64Obj.decodeNumber(req.session.user.pid)
        const postID = base64Obj.decodeNumber(req.body.postID)
        let returnObj = {}
        let socialData = await getPostSocial({
            creatorID,
            postID,
        })
        if (socialData) {
            let clap = Number(socialData.clap) === 0 ? 1 : 0
            await updatePostSocial({ clap, creatorID, postID })
            returnObj.message = '修改成功'
            res.status(200).json(returnObj)
        } else {
            await insertPostSocial({
                postID,
                clap: 1,
                creatorID
            })
            returnObj.message = '新增成功'
            res.status(200).json(returnObj)
        }
    } catch (err) {
        next(err)
    }
});

// 貼文互動
router.put('/deletePost', async function (req, res, next) {
    try {
        const postID = base64Obj.decodeNumber(req.body.postID)
        let returnObj = {}
        await deletePost({
            postID,
        })
        returnObj.message = '刪除成功'
        res.status(200).json(returnObj)
    } catch (err) {
        next(err)
    }
});

// 修改貼文
router.put('/editPost', async function (req, res, next) {
    try {
        const postID = base64Obj.decodeNumber(req.body.postID)
        const title = req.body.title
        const content = req.body.content
        const files = req.body.files.toString()
        const tags = req.body.tags.toString()
        await editPost({
            postID,
            title,
            content,
            files,
            tags,
        })
        let postData = await getPost({ id: postID })
        if (postData) {
            postData = await Promise.all(postData.map(async item => {
                const count = await getPostSocialCount({ postID: item.pid })
                const socialData = await getPostSocial({
                    postID: item.pid,
                    creatorID: base64Obj.decodeNumber(req.session.user.pid)
                })
                if (socialData) {
                    return {
                        ...item,
                        pid: base64Obj.encode(item.pid),
                        clapCount: count,
                        socialData: { ...socialData, clap: socialData.clap === 1, creatorID: base64Obj.encode(socialData.creatorID) }
                    }
                } else {
                    return {
                        ...item,
                        pid: base64Obj.encode(item.pid),
                        clapCount: count,
                        socialData: {
                            clap: null,
                            createdate: null,
                            creatorID: null,
                            modifydate: null,
                            pid: null,
                            postID: null,
                            remark: null,
                        }
                    }
                }

            }))
            res.status(200).json(postData)
        }
    } catch (err) {
        next(err)
    }
});

// 新增事件
router.post('/addEvent', async function (req, res, next) {
    try {
        const creatorID = base64Obj.decodeNumber(req.session.user.pid)
        const teamID = base64Obj.decodeNumber(req.body.teamID)
        const title = req.body.title ? req.body.title : '未命名事件'
        const date = req.body.date ? req.body.date : ''
        const time = req.body.time ? req.body.time : ''
        const location = req.body.location ? req.body.location : ''
        const position = req.body.position ? JSON.stringify(req.body.position) : ''
        const isGame = req.body.isGame ? 1 : 0
        const opponent = req.body.opponent && isGame ? req.body.opponent : ''
        const season = req.body.season && isGame ? req.body.season : ''
        const isNotify = req.body.isNotify ? 1 : 0
        const remark = req.body.remark ? req.body.remark : ''

        let eventID = await insertEventDB({
            creatorID,
            teamID,
            title,
            season,
            date,
            time,
            location,
            position,
            opponent,
            isGame,
            isNotify,
            remark,
        })
        if (eventID) {
            const event = await getTeamEvent({ eventID })
            console.log(event[0].name)
            // todo 發送通知給成員
            if (isNotify) {
                const result = await getTeamMemberList({ teamID })
                await Promise.all(result.forEach(async item => {
                    //title, content, receiverID, typeID, extra, playerID, teamID,
                    await insertNotificationDB({
                        title: `球隊 ${event[0].name} 新增事件囉`,
                        content: `${title}`,
                        receiverID: item.memberID,
                        typeID: 9,
                        extra: `{eventID:${eventID}}`,
                        teamID
                    })
                }))
            }
            res.status(200).json(event)
        } else {
            res.status(500)
        }
    } catch (err) {
        next(err)
    }
});

// 修改事件
router.put('/event/:id', async function (req, res, next) {
    try {
        const pid = req.params.id
        const modifierID = base64Obj.decodeNumber(req.session.user.pid)
        const teamID = base64Obj.decodeNumber(req.body.teamID)
        const title = req.body.title ? req.body.title : '未命名事件'
        const date = req.body.date ? req.body.date : ''
        const time = req.body.time ? req.body.time : ''
        const location = req.body.location ? req.body.location : ''
        const position = req.body.position ? JSON.stringify(req.body.position) : ''
        const isGame = req.body.isGame ? 1 : 0
        const opponent = req.body.opponent && isGame ? req.body.opponent : ''
        const season = req.body.season && isGame ? req.body.season : ''
        const isNotify = req.body.isNotify ? 1 : 0
        const remark = req.body.remark ? req.body.remark : ''

        await updateEventDB({
            pid,
            modifierID,
            teamID,
            title,
            season,
            date,
            time,
            location,
            position,
            opponent,
            isGame,
            isNotify,
            remark,
        })
        const event = await getTeamEvent({ eventID: pid })
        if (event) {
            res.status(200).json(event)
        } else {
            res.status(500)
        }
    } catch (err) {
        next(err)
    }
});

// 球隊事件列表
router.get('/getEvent/:teamID', async function (req, res, next) {
    try {
        const teamID = base64Obj.decodeNumber(req.params.teamID)
        const startDate = req.query.startDate ? req.query.startDate.toString() : ''
        const endDate = req.query.endDate ? req.query.endDate.toString() : ''
        if (teamID) {
            const event = await getTeamEvent({ teamID, startDate, endDate })
            res.status(200).json(event)
        } else {
            res.status(500)
        }
    } catch (err) {
        next(err)
    }
});



// export module
module.exports = router