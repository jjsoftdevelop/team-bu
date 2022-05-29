const { query } = require('../../config/async-db')
const axios = require('axios');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

// 新增球隊寫入DB
async function insertTeamDB({
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
}) {
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

async function modifyTeamDB({
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
}) {
    let sql = `UPDATE team SET 
                    name = ?, 
                    logoUrl = ?, 
                    bannerUrl = ?, 
                    description = ?, 
                    categoryID = ?, 
                    typeID = ?, 
                    rankID = ?, 
                    statusID = ?, 
                    city = ?, 
                    leagueTag = ?, 
                    modifierID = ?, 
                    modifyDate = ? 
                WHERE pid = ?`
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
        modifierID,
        new Date(),
        teamID
    ]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
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
    let sql = `SELECT B.nickname AS memberName,B.picture AS memberPicture,C.name AS teamName,C.logoUrl AS teamLogo, A.*, D.statusText AS teamMemberStatusText, E.levelText AS teamMemberLevelText  FROM team_member AS A
                LEFT JOIN member AS B ON B.pid = A.memberID
                LEFT JOIN team AS C ON C.pid = A.teamID
                LEFT JOIN team_member_status AS D ON D.statusID = A.teamMemberStatusID
                LEFT JOIN team_member_level AS E ON E.levelID = A.teamMemberLevelID
                WHERE memberID = ? AND teamID = ? Limit 1`
    let values = [memberID, teamID]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))

    return data[0]
}

// 更新球隊球員加入狀態
async function updateTeamMemberStatus({ teamMemberLevelID, teamMemberStatusID, memberID, teamID }) {
    let sql = `UPDATE team_member set 
    ${teamMemberLevelID ? ` teamMemberLevelID = ${teamMemberLevelID},` : ''}
    ${teamMemberStatusID ? ` teamMemberStatusID = ${teamMemberStatusID},` : ''}
    modifydate = ? WHERE memberID = ? AND teamID = ? limit 1`
    let values = [new Date(), memberID, teamID]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

// 搜尋球隊列表
async function selectTeamDB({ teamID, categoryID, name }) {
    let sql = `SELECT A.*,B.nickname AS nickname,C.rankText, D.categoryText,E.typeText
                FROM team AS A
                LEFT JOIN member  AS B
                ON A.creatorID = B.pid
                LEFT JOIN team_rank AS C ON C.rankID = A.rankID
                LEFT JOIN team_category AS D ON D.categoryID = A.categoryID
                LEFT JOIN team_type AS E ON E.typeID = A.typeID`
    let values = []
    if (name && categoryID) {
        sql = `SELECT A.*,B.nickname AS nickname,C.rankText, D.categoryText,E.typeText
                FROM team AS A
                LEFT JOIN member  AS B
                ON A.creatorID = B.pid
                LEFT JOIN team_rank AS C ON C.rankID = A.rankID
                LEFT JOIN team_category AS D ON D.categoryID = A.categoryID
                LEFT JOIN team_type AS E ON E.typeID = A.typeID
                WHERE A.name like ? AND A.categoryID = ?`
        values = ['%' + name + '%', categoryID]
    } else if (teamID && categoryID) {
        sql = `SELECT A.*,B.nickname AS nickname,C.rankText, D.categoryText,E.typeText
                FROM team AS A
                LEFT JOIN member  AS B
                ON A.creatorID = B.pid
                LEFT JOIN team_rank AS C ON C.rankID = A.rankID
                LEFT JOIN team_category AS D ON D.categoryID = A.categoryID
                LEFT JOIN team_type AS E ON E.typeID = A.typeID
                WHERE A.pid = ? AND A.categoryID = ?`
        values = [teamID, categoryID]
    } else if (categoryID) {
        sql = `SELECT A.*,B.nickname AS nickname,C.rankText, D.categoryText,E.typeText
                FROM team AS A
                LEFT JOIN member  AS B
                ON A.creatorID = B.pid
                LEFT JOIN team_rank AS C ON C.rankID = A.rankID
                LEFT JOIN team_category AS D ON D.categoryID = A.categoryID
                LEFT JOIN team_type AS E ON E.typeID = A.typeID
                WHERE A.categoryID = ?`
        values = [categoryID]
    } else if (teamID) {
        sql = `SELECT A.*, C.rankText, D.categoryText, E.typeText, B.nickname AS nickname
                FROM team AS A
                LEFT JOIN member  AS B
                ON A.creatorID = B.pid
                LEFT JOIN team_rank AS C ON C.rankID = A.rankID
                LEFT JOIN team_category AS D ON D.categoryID = A.categoryID
                LEFT JOIN team_type AS E ON E.typeID = A.typeID
                WHERE A.pid = ?`
        values = [teamID]
    }

    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

// 取得要求加入球隊的人
async function getTeamJoinList(teamID) {
    let sql = "SELECT * FROM team_member WHERE teamID = ? AND teamMemberstatusID = 2"
    let values = [teamID]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

// 取得球隊管理員
async function getTeamManagerList(teamID) {
    let sql = "SELECT * FROM team_member WHERE teamID = ? AND teamMemberstatusID = 3 AND teamMemberLevelID = 3"
    let values = [teamID]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

// 取得球隊資料
async function getTeamInfo(teamID) {
    let sql = `SELECT name FROM team WHERE pid = ?`
    let values = [teamID]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data[0]
}

// 取得球隊成員的頭貼
async function getTeamMemberPic(teamID) {
    let sql = `SELECT B.picture FROM team_member AS A
                LEFT JOIN member AS B ON B.pid = A.memberID
                WHERE A.teamID = ? AND A.teamMemberStatusID = 3`
    let values = [teamID]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

// 找尋球員
async function getMemberByEmail({ email }) {
    let sql = `SELECT A.pid, A.nickname, A.picture, A.email, A.provider FROM member AS A
                WHERE A.email = ?`
    let values = [email]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

// 查詢球隊球員
async function getTeamMemberList({ teamID }) {
    let sql = `SELECT A.picture, B.nickname, A.teamMemberLevelID, A.teamMemberStatusID, C.statusText, D.levelText  FROM team_member AS A
    LEFT JOIN member AS B ON B.pid = A.memberID
    LEFT JOIN team_member_status AS C ON C.statusID = A.teamMemberStatusID
    LEFT JOIN team_member_level AS D ON D.levelID = A.teamMemberLevelID
    WHERE A.teamID = ${teamID}`
    const res = await query(sql)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

// 新增貼文
async function insertPost({
    teamID,
    title,
    content,
    files,
    tags,
    viewRole,
    creatorID,
}) {
    let sql = `INSERT INTO team_post(
            teamID,
            title,
            content,
            files,
            tags,
            viewRole,
            creatorID,
            createdate
        ) VALUES(?,?,?,?,?,?,?,?)`
    let values = [
        teamID,
        title,
        content,
        files,
        tags,
        viewRole,
        creatorID,
        new Date(),
    ]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data.insertId
}

// 找尋 post
async function getPost({ id, teamID }) {
    const condition = id ? `A.pid = ${id}` : `teamID = ${teamID}`
    let sql = `SELECT A.*,M.nickname,M.picture  FROM team_post AS A 
                LEFT JOIN member AS M ON M.pid = A.creatorID WHERE ${condition}
                Order BY A.createdate DESC`
    const res = await query(sql)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

// 取得拍手數量 
async function getPostSocialCount({ postID }) {
    let sql = `SELECT Count(*) AS clapCount FROM team_post_social AS A 
                WHERE A.postID = ${postID} AND A.clap = 1`
    const res = await query(sql)
    const data = JSON.parse(JSON.stringify(res))
    return data[0].clapCount
}

// 使用者是否與這哲貼文有互動過
async function getPostSocial({
    postID,
    creatorID
}) {
    let sql = `Select * FROM team_post_social WHERE postID = ? AND creatorID = ?`
    let values = [
        postID,
        creatorID
    ]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data[0]
}

// 新增按讚
async function insertPostSocial({
    postID,
    clap,
    creatorID
}) {
    let sql = `INSERT INTO team_post_social(
        postID,
        clap,
        creatorID,
        createdate
        ) VALUES(?,?,?,?)`
    let values = [
        postID,
        clap,
        creatorID,
        new Date(),
    ]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data.insertId
}

// 修改按讚
async function updatePostSocial({ clap, postID, creatorID }) {
    let sql = `UPDATE team_post_social set clap = ?, modifydate = ? WHERE postID = ? AND creatorID = ?`
    let values = [clap, new Date(), postID, creatorID]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

// 刪除貼文
async function deletePost({ postID }) {
    let sql = `UPDATE team_post set isDelete = 1, modifydate = ? WHERE pid = ?`
    let values = [new Date(), postID]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

// 修改貼文
async function editPost({
    postID,
    title,
    content,
    files,
    tags,
}) {
    let sql = `UPDATE team_post set title = ?, content = ?,files = ?,tags = ?, modifydate = ? WHERE pid = ?`
    let values = [title, content, files, tags, new Date(), postID]
    const res = await query(sql, values)
    const data = JSON.parse(JSON.stringify(res))
    return data
}

module.exports = {
    insertTeamDB,
    insertTeamMemberDB,
    isExistTeamMember,
    updateTeamMemberStatus,
    selectTeamDB,
    getTeamJoinList,
    getTeamManagerList,
    getTeamInfo,
    getTeamMemberPic,
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
}