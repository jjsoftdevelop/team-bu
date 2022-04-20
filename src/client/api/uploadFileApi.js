const API_MODULE = `/api`

export function uploadFile(api) {
    return async function (file) {
        const path = `${API_MODULE}/uploadFile`
        try {
            const formData = new FormData();
            formData.append("uploadBox", file);
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

