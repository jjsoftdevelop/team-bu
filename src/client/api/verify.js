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
    return async function ({ email, passwd, nickname, url }) {
        const path = `${API_MODULE}/signUp`
        try {
            const { data, errors } = await api.post(path, { email, passwd, nickname, url })
            if (errors) {
                return Promise.reject(errors)
            }
            return data
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

export function enterVerifycode(api) {
    return async function ({ email, verifycode }) {
        const path = `${API_MODULE}/enterVerifycode`
        try {
            const { data, errors } = await api.post(path, { email, verifycode })
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

export function settingPasswd(api) {
    return async function ({ passwd, email, verifycode }) {
        const path = `${API_MODULE}/settingPasswd`
        try {
            const { data, errors } = await api.post(path, { passwd, email, verifycode })
            if (errors) {
                return Promise.reject(errors)
            }
            return data
        } catch (err) {
            return Promise.reject(err)
        }
    }
}
