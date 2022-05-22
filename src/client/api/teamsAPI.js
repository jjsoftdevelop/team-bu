const API_MODULE = `/api`

export function teamCreate(api) {
    return async function ({
        name,
        logoUrl,
        bannerUrl,
        description,
        categoryID,
        typeID,
        rankID,
        leagueTag,
        city,
    }) {
        const path = `${API_MODULE}/teams/create`
        try {
            const { data, errors } = await api.post(path, {
                name,
                logoUrl,
                bannerUrl,
                description,
                categoryID,
                typeID,
                rankID,
                leagueTag,
                city
            })
            if (errors) {
                return Promise.reject(errors)
            }
            return data
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

// 修改球隊
export function teamModify(api) {
    return async function ({
        name,
        logoUrl,
        bannerUrl,
        description,
        categoryID,
        typeID,
        rankID,
        leagueTag,
        city,
        teamID,
    }) {
        const path = `${API_MODULE}/teams/${teamID}`
        try {
            const { data, errors } = await api.put(path, {
                name,
                logoUrl,
                bannerUrl,
                description,
                categoryID,
                typeID,
                rankID,
                leagueTag,
                city,
            })
            if (errors) {
                return Promise.reject(errors)
            }
            return data
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

// 主動/邀請 加入球隊
export function teamJoin(api) {
    return async function ({
        teamID,
        memberID,
        picture,
        teamMemberLevelID,
        type,
    }) {
        const path = `${API_MODULE}/teams/join/${teamID}/${memberID}`
        try {
            const { data, errors } = await api.post(path, {
                picture,
                teamMemberLevelID,
                type
            })
            if (errors) {
                return Promise.reject(errors)
            }
            return data
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

// 修改團隊球員狀態
export function updateTeamMemberStatus(api) {
    return async function ({
        teamID,
        memberID,
        teamMemberStatusID,
        teamMemberLevelID
    }) {
        const path = `${API_MODULE}/teams/status/${teamID}/${memberID}`
        try {
            const { data, errors } = await api.put(path, {
                teamMemberStatusID,
                teamMemberLevelID,
            })
            if (errors) {
                return Promise.reject(errors)
            }
            return data
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

// 取得球隊列表
export function getTeamList(api) {
    return async function ({
        teamID,
        categoryID,
        name,
    }) {
        const path = `${API_MODULE}/teams/${teamID}?categoryID=${categoryID}&name=${name}`
        try {
            const { data, errors } = await api.get(path)
            if (errors) {
                return Promise.reject(errors)
            }
            return data
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

// 用email取得球員
export function getMemberByEmail(api) {
    return async function ({
        email, teamID
    }) {
        const path = `${API_MODULE}/teamMember/${email}`
        try {
            const { data, errors } = await api.post(path, {
                teamID
            })
            if (errors) {
                return Promise.reject(errors)
            }
            return data
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

// 球隊隊員
export function getTeamMemberList(api) {
    return async function ({
        teamID
    }) {
        const path = `${API_MODULE}/teamMember/member`
        try {
            const { data, errors } = await api.post(path, { teamID })
            if (errors) {
                return Promise.reject(errors)
            }
            return data
        } catch (err) {
            return Promise.reject(err)
        }
    }
}
