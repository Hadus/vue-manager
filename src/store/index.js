/*
 * @Author: liuhuitao
 * @Date: 2019-08-21 09:52:50
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-09-25 13:43:30
 * @description:数据存储
 */
/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import permission from './modules/permission';
import monitor from './modules/monitor';
import createPersistedState from 'vuex-persistedstate';
import createLogger from 'vuex/dist/logger';
// 判断环境 vuex提示生产环境中不使用
const flag = process.env.NODE_ENV !== 'production';
const createPersisted = createPersistedState({
  storage: window.sessionStorage //默认缓存所有state,如果想只缓存指定state，只需简单配置
});
Vue.use(Vuex);
export const types = {
  MENU_COLLAPSE: 'MENU_COLLAPSE',
  BREADCRUMB_ITEMS: 'BREADCRUMB_ITEMS',
  MENU_STYLE: 'MENU_STYLE',
  CURRENT_MENU_STYLE: 'CURRENT_MENU_STYLE',
  SVG_ICON_NAME: 'SVG_ICON_NAME'
};
export default new Vuex.Store({
  state: {
    [types.MENU_COLLAPSE]: false,
    [types.BREADCRUMB_ITEMS]: [],
    [types.MENU_STYLE]: {
      light: {
        backgroundColor: '#fff',
        textColor: 'rgba(0, 0, 0, .65)',
        activeTextColor: '#1890ff',
        logoBackgroundColor: '#fff',
        logoColor: '#1890ff'
      },
      dark: {
        backgroundColor: '#001529',
        textColor: '#333',
        activeTextColor: '#0990EC',
        logoBackgroundColor: '#022445',
        logoColor: '#fff'
      }
    },
    [types.CURRENT_MENU_STYLE]: 'dark',
    [types.SVG_ICON_NAME]: []
  },
  getters: {
    getMenuCollapse(state) {
      return state[types.MENU_COLLAPSE];
    },
    getBreadcrumbItems(state) {
      return state[types.BREADCRUMB_ITEMS];
    },
    getMenuStyle(state) {
      return state[types.MENU_STYLE][state[types.CURRENT_MENU_STYLE]];
    },
    getCurrentMenuStyle(state) {
      return state[types.CURRENT_MENU_STYLE];
    },
    getSvgIconName(state) {
      return state[types.SVG_ICON_NAME];
    }
  },
  mutations: {
    [types.MENU_COLLAPSE]: (state, res) => {
      state[types.MENU_COLLAPSE] = res;
    },
    [types.BREADCRUMB_ITEMS]: (state, res) => {
      state[types.BREADCRUMB_ITEMS] = res;
    },
    [types.CURRENT_MENU_STYLE]: (state, res) => {
      state[types.CURRENT_MENU_STYLE] = res;
    },
    [types.SVG_ICON_NAME]: (state, res) => {
      state[types.SVG_ICON_NAME] = res;
    }
  },
  actions: {
    [types.MENU_COLLAPSE]: async ({ commit }, state) => {
      return commit(types.MENU_COLLAPSE, state);
    },
    [types.BREADCRUMB_ITEMS]: async ({ commit }, state) => {
      return commit(types.BREADCRUMB_ITEMS, state);
    },
    [types.CURRENT_MENU_STYLE]: async ({ commit }, state) => {
      return commit(types.CURRENT_MENU_STYLE, state);
    },
    [types.SVG_ICON_NAME]: async ({ commit }, state) => {
      return commit(types.SVG_ICON_NAME, state);
    }
  },
  modules: {
    user,
    permission,
    monitor
  },
  plugins: flag ? [createLogger(), createPersisted] : [createPersisted]
});
