const TEAM_PLAYER_STATUS = {
    INVITE: 1,
    APPLY: 2,
    JOIN: 3,
    REJECT_APPLY: 4,
    REJECT_INVITE: 5,
    DELETE: 9
}
//1:邀請球員中 2:申請加入中 3:申請球員已加入 4:申請已拒絕 5:邀請已拒絕 9:已移除
module.exports = { TEAM_PLAYER_STATUS }