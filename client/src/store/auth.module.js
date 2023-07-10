import AuthService from '../services/auth.service';

const user = AuthService.getUser();
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, user) {
      return AuthService.login(user).then(
        response => {
          commit('loginSuccess');
          return Promise.resolve(response);
        },
        error => {
          commit('loginFailure');
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      AuthService.logout();
      commit('logout');
    }
  },
  mutations: {
    loginSuccess(state) {
      state.status.loggedIn = true;
      state.user = AuthService.getUser();
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      localStorage.setItem("jwt-token", "");
      state.user = null;
    }
  }
};