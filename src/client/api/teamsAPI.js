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
        levelID,
        type,
    }) {
        const path = `${API_MODULE}/teams/join/${teamID}/${memberID}`
        try {
            const { data, errors } = await api.post(path, {
                picture,
                levelID,
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
        playerID,
        statusID,
        levelID
    }) {
        const path = `${API_MODULE}/teams/status/${teamID}/${playerID}`
        try {
            const { data, errors } = await api.put(path, {
                statusID,
                levelID,
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

// 新增貼文
export function addPost(api) {
    return async function ({
        teamID,
        content,
        files,
        tags,
    }) {
        const path = `${API_MODULE}/addPost`
        try {
            const { data, errors } = await api.post(path, {
                teamID,
                content,
                files,
                tags,
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

// 取得貼文
export function getPost(api) {
    return async function ({
        teamID,
    }) {
        const path = `${API_MODULE}/getPost/${teamID}`
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

// 取得貼文
export function getPostSingle(api) {
    return async function ({
        postID,
    }) {
        const path = `${API_MODULE}/getPostSingle/${postID}`
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

// 對貼文互動
export function addSocial(api) {
    return async function ({
        postID,
    }) {
        const path = `${API_MODULE}/addSocial`
        try {
            const { data, errors } = await api.post(path, { postID })
            if (errors) {
                return Promise.reject(errors)
            }
            return data
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

// 刪除貼文
export function deletePost(api) {
    return async function ({
        postID,
    }) {
        const path = `${API_MODULE}/deletePost`
        try {
            const { data, errors } = await api.put(path, { postID })
            if (errors) {
                return Promise.reject(errors)
            }
            return data
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

// 刪除貼文
export function editPost(api) {
    return async function ({
        postID,
        title,
        content,
        files,
        tags
    }) {
        const path = `${API_MODULE}/editPost`
        try {
            const { data, errors } = await api.put(path, { postID, title, content, files, tags })
            if (errors) {
                return Promise.reject(errors)
            }
            return data
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

// 新增事件
export function addEvent(api) {
    return async function ({
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
    }) {
        const path = `${API_MODULE}/addEvent`
        try {
            const { data, errors } = await api.post(path, {
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
            if (errors) {
                return Promise.reject(errors)
            }
            return data
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

// 修改事件
export function updateEvent(api) {
    return async function ({
        pid,
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
    }) {
        const path = `${API_MODULE}/event/${pid}`
        try {
            const { data, errors } = await api.put(path, {
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
            if (errors) {
                return Promise.reject(errors)
            }
            return data
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

export function getEvent(api) {
    return async function ({
        teamID,
        startDate,
        endDate,
    }) {
        const path = `${API_MODULE}/getEvent/${teamID}${startDate ? `?startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`
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





