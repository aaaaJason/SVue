// store/index.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    username: ''
  },
  mutations: {
    login(state, username) {
      state.isAuthenticated = true;
      state.username = username;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.username = '';
    }
  },
  actions: {
    login({ commit }, { username }) {
      // 執行登入操作，例如 API 請求等
      // 成功後，觸發 mutation 更新狀態
      commit('login', username);
    },
    logout({ commit }) {
      // 執行登出操作，清除使用者資料等
      commit('logout');
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    getUsername: state => state.username
  }
});
