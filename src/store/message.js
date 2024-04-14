import axios from 'axios'

export default {
  namespaced: true,
  state: {
    messages: []
  },
  mutations: {
    setMessages(state, messages) {
      state.messages = [...messages]
    }
  },
  actions: {
    async fetchMessages({ commit }, userId) {
      try {
        const response = await axios.get(`http://localhost:3000/api/messages/${userId}`);
        commit('setMessages', response.data)
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }
  }

}