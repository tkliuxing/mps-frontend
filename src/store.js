import Vue from "vue";
import Vuex from "vuex";
import SecureLS from "secure-ls";
import axios from "axios";
import createPersistedState from "vuex-persistedstate";
import { BACKEND_URL } from "./constvars";

Vue.use(Vuex);

let ls = new SecureLS({ isCompression: false });

const SYS_ID = 0;

const getDefaultState = () => {
  return {
    backend_url: BACKEND_URL,
    token: "",
    sys_id: SYS_ID,
    currentSystemId: "",
    currentSystemName: "",
    userinfo: {
      pk: null,
      sys_id: SYS_ID,
      username: "",
      mobile: "",
      department_id: null,
      is_active: false,
      is_superuser: false,
      full_name: "",
      func_names: [],
      func_codenames: [],
      func_group_names: [],
    },
    systemlist: [],
  };
};

const state = getDefaultState();

const actions = {};

export const BACKEND = "BACKEND";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const USERINFO = "USERINFO";
export const SYSTEMLIST = "SYSTEMLIST";
export const SETSYSTEM = "setSystem";
export const SETSYSTEMNAME = "setSystemName";

const mutations = {
  [BACKEND](state, url) {
    state.backend_url = url;
    axios.defaults.baseURL = url;
  },
  [USERINFO](state, userinfo) {
    state.userinfo = userinfo;
  },
  [LOGIN](state, token) {
    state.token = token;
  },
  [LOGOUT](state) {
    Object.assign(state, getDefaultState());
  },
  [SYSTEMLIST](state, systemlist) {
    state.systemlist = systemlist;
  },
  [SETSYSTEM](state, system_id) {
    state.currentSystemId = system_id;
  },
  [SETSYSTEMNAME](state, system_name) {
    state.currentSystemName = system_name;
  },
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
    }),
  ],
});
