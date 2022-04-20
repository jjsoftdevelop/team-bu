const API_MODULE = `/auth`

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

// 主動/邀請 加入球隊
export function teamJoin(api) {
    return async function ({
        teamID,
        memberID,
        picture,
        teamMemberLevelID,
        teamMemberStatusID,
    }) {
        const path = `${API_MODULE}/teams/join/${teamID}/${memberID}`
        try {
            const { data, errors } = await api.post(path, {
                picture,
                teamMemberLevelID,
                teamMemberStatusID
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
    }) {
        const path = `${API_MODULE}/teams/status/${teamID}/${memberID}`
        try {
            const { data, errors } = await api.put(path, {
                teamMemberStatusID,
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