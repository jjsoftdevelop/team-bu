const express = require('express')
const router = express.Router()
const { query } = require('../../config/async-db')

async function insertTeamDB(
    name,
    logoUrl,
    bannerUrl,
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

// 創建球隊
router.post('/teams/create', async function (req, res, next) {
    try {
        const name = req.body.name
        const logoUrl = req.body.logoUrl
        const bannerUrl = req.body.bannerUrl
        const categoryID = req.body.categoryID
        const typeID = req.body.categoryID
        const rankID = req.body.rankID
        const city = req.body.city
        const leagueTag = req.body.leagueTag
        const creatorID = req.session.pid

        let returnObj = {}
        let id = await insertTeamDB(
            name,
            logoUrl,
            bannerUrl,
            categoryID,
            typeID,
            rankID,
            leagueTag,
            city,
            creatorID
        )
        if (id) {
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
        const teamID = req.query.teamID
        const memberID = req.query.pid
        const picture = req.body.picture
        const teamMemberLevelID = req.body.teamMemberLevelID
        const teamMemberStatusID = req.body.teamMemberStatusID
        let returnObj = {}
        const data = isExistTeamMember(teamID, memberID)
        if (data) {
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
        const teamID = req.query.teamID
        const memberID = req.query.teamID
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

// export module
module.exports = router