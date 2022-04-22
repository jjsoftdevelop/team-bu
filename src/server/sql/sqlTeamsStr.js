const { query } = require('../../config/async-db')
const axios = require('axios');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

// 新增球隊寫入DB
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

// 新增球員寫入DB
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

// 檢查是否已在球對
async function isExistTeamMember(teamID, memberID) {
    let sql = "SELECT * FROM team_member WHERE memberID = ? AND teamID = ? Limit 1"
    let values = [memberID, teamID]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))

    return data[0]
}

// 取得球隊管理員列表
async function getTeamManagers(teamID) {
    let sql = "SELECT * FROM team_member WHERE teamID = ? AND teamMemberLevelID = 3 AND teamMemberStatusID = 3"
    let values = [teamID]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

// 更新球隊球員加入狀態
async function updateTeamMemberStatus(teamMemberStatusID, memberID, teamID) {
    let sql = "UPDATE team_member set teamMemberStatusID = ?, modifydate = ? WHERE memberID = ? AND teamID = ? limit 1"
    let values = [teamMemberStatusID, new Date(), memberID, teamID]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

// 搜尋球隊列表
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
                WHERE A.name like ? AND A.categoryID = ?`
        values = ['%' + name + '%', categoryID]
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

// 發送通知 api
async function sendNotification(title, content, receiverID, typeID, extra, playerID,
    teamID) {
    try {
        await axios.post(`${process.env.baseUrl}/api/notification/send`, {
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

// 取得要求加入球隊清單
async function getTeamJoin(teamID) {
    let sql = "SELECT * FROM team_member WHERE teamID = ? AND teamMemberstatusID = 2"
    let values = [teamID]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

module.exports = {
    insertTeamDB,
    insertTeamMemberDB,
    isExistTeamMember,
    getTeamManagers,
    updateTeamMemberStatus,
    selectTeamDB,
    sendNotification,
    getTeamJoin,
}