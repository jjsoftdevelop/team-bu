import { getStudents, addStudents } from '../api/CRUDAPI'
import { sendEmail } from '../api/sendEmailApi'
import { uploadFile } from '../api/uploadFileApi'
import { verifyEmail, verifyPasswd, signUp, logout, enterVerifycode } from '../api/verify'
import { teamCreate, teamJoin, updateTeamMemberStatus, getTeamList } from '../api/teamsAPI'


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
        enterVerifycode: enterVerifycode(axios),
        uploadFile: uploadFile(axios),
        teamCreate: teamCreate(axios),
        teamJoin: teamJoin(axios),
        updateTeamMemberStatus: updateTeamMemberStatus(axios),
        getTeamList: getTeamList(axios),
    }
    inject('api', api)
    inject('axios', axios)
}