const API_MODULE = `/auth`

export function verifyEmail(api) {
    return async function ({ email }) {
        const path = `${API_MODULE}/verify/email`
        try {
            const { data, errors } = await api.post(path, { email })
            if (errors) {
                return Promise.reject(errors)
            }
            return data
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

export function verifyPasswd(api) {
    return async function ({ email, passwd }) {
        const path = `${API_MODULE}/verify/passwd`
        try {
            const { data, errors } = await api.post(path, { email, passwd })
            if (errors) {
                return Promise.reject(errors)
            }
            return data
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

export function signUp(api) {
    return async function ({ email, passwd, nickname }) {
        const path = `${API_MODULE}/signUp`
        try {
            const { data, errors } = await api.post(path, { email, passwd, nickname })
            if (errors) {
                return Promise.reject(errors)
            }
            return data
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

export function logout(api) {
    return async function () {
        const path = `${API_MODULE}/logout`
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
