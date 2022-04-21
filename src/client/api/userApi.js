const API_MODULE = `/api`

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