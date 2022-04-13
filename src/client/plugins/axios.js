import { getStudents, addStudents } from '../api/CRUDAPI'
import { sendEmail } from '../api/sendEmailApi'
import { verifyEmail, verifyPasswd, signUp, logout } from '../api/verify'

export default (context, inject) => {
    const { $axios } = context
    const axios = $axios.create({
        headers: { 'Cache-Control': 'no-cache' },
    })
    let api_url
    if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'local') {
        api_url = 'http://localhost:3000'
    } else {
        api_url = 'https://team-bu.com'
    }
    axios.setBaseURL(api_url)
    axios.interceptors.request.use(config => {
        return config
    })
    if (process.client) {
        axios.interceptors.response.use(
            function (response) {
                return response
            },
            function (error) {
                if (!error.response) return Promise.reject(error)
                return Promise.reject(error)
            },
        )
    }
    const api = {
        getStudents: getStudents(axios),
        addStudents: addStudents(axios),
        sendEmail: sendEmail(axios),
        verifyEmail: verifyEmail(axios),
        verifyPasswd: verifyPasswd(axios),
        signUp: signUp(axios),
        logout: logout(axios),
    }
    inject('api', api)
    inject('axios', axios)
}