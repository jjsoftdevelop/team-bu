const express = require('express')
const router = express.Router()
const { query } = require('../../config/async-db')
const authMiddleWare = require('../../server/middleware/authMiddleWare')
const base64Obj = require('../utils/base64')

async function insertTeamDB(
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
) {
    let sql = "INSERT INTO team(name, logoUrl, bannerUrl, description, categoryID, typeID, rankID, statusID, city, leagueTag, creatorID, createdate) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)"
    let values = [
        name,
        logoUrl,
        bannerUrl,
        description,
        categoryID,
        typeID,
        rankID,
        1,
        city,
        leagueTag,
        creatorID,
        new Date()
    ]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data.insertId
}

async function insertTeamMemberDB(
    teamID,
    memberID,
    picture,
    teamMemberLevelID,
    teamMemberStatusID,
) {
    let sql = "INSERT INTO team_member(memberID, teamID, picture, teamMemberLevelID ,teamMemberStatusID, createdate) VALUES(?,?,?,?,?,?)"
    let values = [
        memberID,
        teamID,
        picture,
        teamMemberLevelID,
        teamMemberStatusID,
        new Date()
    ]
    const res = await query(sql, values)

    const data = JSON.parse(JSON.stringify(res))
    return data.insertId
}

async function isExistTeamMember(teamID, memberID) {
    let sql = "SELECT * FROM team_member WHERE memberID = ? AND teamID = ? Limit 1"
    let values = [memberID, teamID]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))

    return data[0]
}

async function updateTeamMemberStatus(teamMemberStatusID, memberID, teamID) {
    let sql = "UPDATE team_member set teamMemberStatusID = ? WHERE memberID = ? AND teamID = ? limit 1"
    let values = [teamMemberStatusID, memberID, teamID]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

async function selectTeamDB(teamID, categoryID, name) {
    let sql = `SELECT A.*,B.nickname AS nickname
                FROM team AS A
                LEFT JOIN member  AS B
                ON A.creatorID = B.pid`
    let values = []
    if (name && categoryID) {
        sql = `SELECT A.*,B.nickname AS nickname
                FROM team AS A
                LEFT JOIN member  AS B
                ON A.creatorID = B.pid
                WHERE A.name = ? AND A.categoryID = ?`
        values = [name, categoryID]
    } else if (teamID && categoryID) {
        sql = `SELECT A.*,B.nickname AS nickname
                FROM team AS A
                LEFT JOIN member  AS B
                ON A.creatorID = B.pid
                WHERE A.pid = ? AND A.categoryID = ?`
        values = [teamID, categoryID]
    } else if (categoryID) {
        sql = `SELECT A.*,B.nickname AS nickname
                FROM team AS A
                LEFT JOIN member  AS B
                ON A.creatorID = B.pid
                WHERE A.categoryID = ?`
        values = [categoryID]
    } else if (teamID) {
        sql = `SELECT A.*,B.nickname AS nickname
                FROM team AS A
                LEFT JOIN member  AS B
                ON A.creatorID = B.pid
                WHERE A.pid = ?`
        values = [teamID]
    }

    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

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
        const teamMemberLevelID = req.body.teamMemberLevelID
        const type = req.body.type
        const teamMemberStatusID = type === 'join' ? 2 : type === 'invite' ? 1 : 4
        let returnObj = {}
        const data = await isExistTeamMember(teamID, memberID)
        if (!data) {
            let id = await insertTeamMemberDB(
                teamID,
                memberID,
                picture,
                teamMemberLevelID,
                teamMemberStatusID,
            )
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
        const memberID = base64Obj.decode(req.params.memberID)
        const teamMemberStatusID = req.body.teamMemberStatusID
        let returnObj = {}
        let data = await updateTeamMemberStatus(
            teamMemberStatusID,
            memberID,
            teamID,
        )
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
router.get('/teams/:teamID', authMiddleWare, async function (req, res, next) {
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