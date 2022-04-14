export const state = () => ({
    user: undefined,
    isLogin: false,
})

export const getters = {

}

export const mutations = {
    setUserInfo(state, payload) {
        state.user = payload
    },
    setIsLogin(state, payload) {
        state.isLogin = payload
    },
}

export const actions = {
    nuxtServerInit({ commit }, context) {
        const user = context.req.session.user
        if (user) {
            commit('setUserInfo', user);
            commit('setIsLogin', true);
        } else {
            commit('setUserInfo', undefined);
            commit('setIsLogin', false);
        }
    },
}