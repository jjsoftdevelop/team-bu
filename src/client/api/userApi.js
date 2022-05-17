const API_MODULE = `/api`
const API_MODULE2 = `/auth`

// 取得我創建的球隊
export function getOwnTeam(api) {
    return async function () {
        const path = `${API_MODULE}/user/own`
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

// 發送驗證馬
export function sendVerifycode(api) {
    return async function ({ email }) {
        const path = `${API_MODULE2}/sendVerifycode?mailto=${email}`
        try {
            const { data, errors } = await api.post(path)
            if (errors) {
                return Promise.reject(errors)
            }
            return data
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

// 取得我創建的球隊
export function getMyTeam(api) {
    return async function () {
        const path = `${API_MODULE}/user/myTeam`
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
// 取得我餐宇的運動
export function getMyJoinSport(api) {
    return async function () {
        const path = `${API_MODULE}/user/getMyJoinSport`
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
// 取得我的腳色在每個團隊
export function getMyRoleOnTeams(api) {
    return async function () {
        const path = `${API_MODULE}/user/getMyRoleOnTeams`
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
