import Cookie from "js-cookie"
import jwtDecode from "jwt-decode";

export const state = () => ({
    Info: {
        id_token: '',
        refresh_token: '',
        userUid: '',
        userPicture: '',
        userName: '',
    }
})

export const getters = {

}

export const mutations = {

}

export const actions = {
    nuxtServerInit({ commit }, context) {

    },
}