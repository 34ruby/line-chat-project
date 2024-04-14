export default {
  namespaced: true,

  state: () => ({
    selectedUser: null
  }),

  mutations: {
    setSelectedUser(state, user) {
      state.selectedUser = user;
    }
  },

  actions: {
    selectUser({ commit }, user) {
      commit('setSelectedUser', user);
    }
  }
};
