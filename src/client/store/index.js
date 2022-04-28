export const state = () => ({
    user: undefined,
    CSRF_TOKEN: ''
})

export const getters = {

}

export const mutations = {
    setUserInfo(state, payload) {
        state.user = payload
    },
    SET_CSRF_TOKEN(state, payload) {
        state.CSRF_TOKEN = payload
    }
}

export const actions = {
    nuxtServerInit({ commit }, context) {
        if (context.req.csrfToken && context.req.csrfToken()) {
            const csrfToken = context.req.csrfToken()
            commit('SET_CSRF_TOKEN', csrfToken)
        }
        const user = context.req.session.user
        console.log('user===>', user);
        console.log('sessionID===>', context.req.sessionID);
        if (user) {
            commit('setUserInfo', user);
        } else {
            commit('setUserInfo', undefined);
        }
    },
}