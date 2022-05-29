import { getStudents, addStudents } from '../api/CRUDAPI'
import { sendEmail } from '../api/sendEmailApi'
import { uploadFile } from '../api/uploadFileApi'
import { verifyEmail, verifyPasswd, signUp, logout, enterVerifycode, settingPasswd } from '../api/verify'
import { teamCreate, teamJoin, updateTeamMemberStatus, getTeamList, teamModify, getMemberByEmail, getTeamMemberList, addPost, getPost, addSocial, deletePost, editPost, getPostSingle } from '../api/teamsAPI'
import { getNotification, updateNotification } from '../api/notificationApi'
import { getOwnTeam, sendVerifycode, getMyTeam, getMyJoinSport, getMyRoleOnTeams } from '../api/userApi'



export default (context, inject) => {
    const { $axios, store } = context
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
    axios.interceptors.request.use(
        function (config) {
            // Do something before request is sent
            if (store.state.CSRF_TOKEN) {
                config.headers.common['x-csrf-token'] = store.state.CSRF_TOKEN
            }
            return config
        },
        function (error) {
            // Do something with request error
            return Promise.reject(error);
        }
    )

    if (process.client) {
        axios.interceptors.response.use(
            function (response) {
                return response
            },
            function (error) {
                $nuxt.$bvToast.toast('發生錯誤，請稍後在試！', {
                    title: `提示`,
                    variant: 'danger',
                    solid: true,
                    toaster: 'b-toaster-bottom-center',
                    appendToast: false,
                })
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
        getNotification: getNotification(axios),
        getOwnTeam: getOwnTeam(axios),
        sendVerifycode: sendVerifycode(axios),
        settingPasswd: settingPasswd(axios),
        updateNotification: updateNotification(axios),
        getMyTeam: getMyTeam(axios),
        teamModify: teamModify(axios),
        getMemberByEmail: getMemberByEmail(axios),
        getTeamMemberList: getTeamMemberList(axios),
        getMyJoinSport: getMyJoinSport(axios),
        getMyRoleOnTeams: getMyRoleOnTeams(axios),
        addPost: addPost(axios),
        getPost: getPost(axios),
        addSocial: addSocial(axios),
        deletePost: deletePost(axios),
        editPost: editPost(axios),
        getPostSingle: getPostSingle(axios)
    }
    inject('api', api)
    inject('axios', axios)
}