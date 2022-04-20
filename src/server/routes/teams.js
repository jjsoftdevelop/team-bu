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
    let sql = "INSERT INTO team(name, logoUrl, bannerUrl, categoryID, typeID, rankID, statusID, city, leagueTag, creatorID, createdate) VALUES(?,?,?,?,?,?,?,?,?,?,?)"
    let values = [
        name,
        logoUrl,
        bannerUrl,
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
        const creatorID = req.session.userID

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

// 加入
router.post('/teams/join', async function (req, res, next) {
    try {
        const teamID = req.body.teamID
        const memberID = req.session.userID
        const picture = req.session.picture
        const teamMemberLevelID = req.body.teamMemberLevelID
        const teamMemberStatusID = 2
        let returnObj = {}
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
    } catch (err) {
        next(err)
    }
});

// 邀請加入球隊
router.post('/teams/invite', async function (req, res, next) {
    try {
        const teamID = req.body.teamID
        const memberID = req.session.userID
        const picture = req.session.picture
        const teamMemberLevelID = req.body.teamMemberLevelID
        const teamMemberStatusID = 1
        let returnObj = {}
        let id = await insertTeamMemberDB(
            teamID,
            memberID,
            picture,
            teamMemberLevelID,
            teamMemberStatusID
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
    } catch (err) {
        next(err)
    }
});

// export module
module.exports = router