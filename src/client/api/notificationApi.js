const API_MODULE = `/api`

// 取得加入球隊通知
export function getJoinNotification(api) {
    return async function () {
        const path = `${API_MODULE}/notification/join`
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