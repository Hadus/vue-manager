/*
 * @Author: liuhuitao
 * @Date: 2019-08-22 14:16:35
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-10-22 14:51:20
 * @description: webSocket 心跳监测
 */
/* eslint-disable */
import { $monitor } from '@/config';
import { getToken } from '@/utils';
// 心跳检测
const heartCheck = {
  timeout: 3000, // 每隔三秒发送心跳
  num: 3, //3次心跳均未响应重连
  timeoutObj: null,
  start(ws) {
    var _num = this.num;
    this.timeoutObj && clearTimeout(this.timeoutObj);
    this.timeoutObj = setTimeout(() => {
      // 这里发送一个心跳，后端收到后，返回一个心跳消息，
      // onmessage拿到返回的心跳就说明连接正常
      const token = getToken();
      if (token) {
        ws.send(token); // 心跳包
        // console.log('ws发送!');
      }
      _num--;
      //计算答复的超时次数
      if (_num === 0) {
        ws.colse();
      }
    }, this.timeout);
  }
};
const state = {
  websock: null,
  wsUrl: null,
  isWsConnect: false, // ws 连接状态
  disconnectReason: '', //断开连接原因：error,loginOut,other
  wsReconnectTimer: null,
  lockReconnect: false //避免重复连接
};
const getters = {
  getWebSocket(state) {
    return state.websock;
  }
};
const mutations = {
  WS_CREATE(state, wsUrl) {
    try {
      state.wsUrl = wsUrl;
      state.websock = null;
      state.websock = new WebSocket(wsUrl);
      this._mutations['monitor/WS_INIT'][0](state);
    } catch (e) {
      this._mutations['monitor/WS_RECONNECT'][0](state);
    }
  },
  WS_INIT(state) {
    state.websock.onopen = function() {
      console.log('ws 连接成功！');
      heartCheck.start(state.websock);
    };
    state.websock.onmessage = function(callBack) {
      // console.log('ws接收！');
      // console.log(callBack.data);
      // 当拿到的消息为 'LOGOUT' 时，后台捕获到登录异常通知前端退出系统
      if (callBack.data === 'LOGOUT') {
        state.websock.close();
        state.isWsConnect = false;
        state.disconnectReason = 'error';
        return;
      }
      // 当拿到的消息为 'PONG' 时，连接正常
      heartCheck.start(state.websock);
      state.isWsConnect = true;
    };
    state.websock.οnerrοr = function(e) {
      console.log('ws错误!');
      console.log(e);
      this._mutations['monitor/WS_RECONNECT'][0](state);
    };
    state.websock.onclose = function(e) {
      console.log('ws关闭！');
      console.log(e);
      // 无法捕获的自动断开，重新连接
      if (state.disconnectReason === '' && state.isWsConnect === true) {
        this._mutations['monitor/WS_RECONNECT'][0](state);
      }
    };
  },
  WS_RECONNECT(state) {
    if (state.lockReconnect) {
      // 是否已经执行重连
      return;
    }
    state.lockReconnect = true;
    //没连接上会一直重连，设置延迟避免请求过多
    state.wsReconnectTimer && clearTimeout(state.wsReconnectTimer);
    state.wsReconnectTimer = setTimeout(() => {
      this._mutations['monitor/WS_CREATE'][0](state, state.wsUrl);
      state.slockReconnect = false;
    }, 2000);
  },
  // 前端触发退出系统操作
  WEBSOCKET_CLOSE(state) {
    state.disconnectReason = 'loginOut';
    state.websock.close();
  }
};
const actions = {
  WEBSOCKET_INIT(
    { commit, dispatch, state, rootState, rootGetters },
    userName
  ) {
    let wsUrl = `ws://${location.host}/${$monitor}/ws/${userName}/uum/WEB`;
    commit('WS_CREATE', wsUrl);
  },
  WEBSOCKET_CLOSE({ commit }) {
    commit('WEBSOCKET_CLOSE');
  }
};
export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
