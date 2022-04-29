const API_MODULE = `/api`

// 取得通知
export function getNotification(api) {
    return async function (typeID = '') {
        const path = `${API_MODULE}/notification${typeID ? `?typeID=${typeID}` : ''}`
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

// 更新通知狀態
export function updateNotification(api) {
    return async function ({ pid, isShow, isRead }) {
        const path = `${API_MODULE}/notification/${pid}`
        try {
            const { data, errors } = await api.put(path, { isShow, isRead })
            if (errors) {
                return Promise.reject(errors)
            }
            return data
        } catch (err) {
            return Promise.reject(err)
        }
    }
}