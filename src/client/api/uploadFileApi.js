const API_MODULE = `/api`

export function sendEmail(api) {
    return async function ({ mailto, mailTitle, mailContent }) {
        const path = `${API_MODULE}/sendEmail`
        try {
            const { data, errors } = await api.post(path, { mailto, mailTitle, mailContent })
            if (errors) {
                return Promise.reject(errors)
            }
            return data
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

