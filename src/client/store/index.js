export const state = () => ({
    user: undefined,
})

export const getters = {

}

export const mutations = {
    setUserInfo(state, payload) {
        state.user = payload
    },
}

export const actions = {
    nuxtServerInit({ commit }, context) {
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