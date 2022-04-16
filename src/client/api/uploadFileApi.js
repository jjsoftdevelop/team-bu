const API_MODULE = `/api`

export function uploadFile(api) {
    return async function (formData) {
        const path = `${API_MODULE}/uploadFile`
        try {
            const { data, errors } = await api({
                method: 'post',
                url: path,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
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

