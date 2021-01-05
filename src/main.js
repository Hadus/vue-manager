import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './components';
import './assets/icons';
import './lib/element-ui';
// eslint-disable-next-line no-unused-vars
import _ from 'lodash';
// 引入字典
import { permisBtnIdSetting } from '@/assets/js/common/dictionary';

import { confirmOperation, isHasPerms } from '@/utils';
// 判断按钮权限（可以传入btnId或者btnModule.btnName）
const isHasBtnId = (btnMsg) => {
  let btnId;
  if (typeof btnMsg === 'number') {
    btnId = btnMsg;
  } else if (btnMsg.includes('.')) {
    const btnMsgArr = btnMsg.split('.');
    try {
      btnId = permisBtnIdSetting[btnMsgArr[0]][btnMsgArr[1]];
    } catch (err) {
      throw err;
    }
  }
  let flag = isHasPerms(btnId, store.getters['permission/getPermisBtnIds']);
  return flag;
};

// vue实例扩展属性和方法
Object.assign(Vue.prototype, {
  $confirmOperation: confirmOperation,
  $permisBtnIdSetting: permisBtnIdSetting, // 按钮id字典
  $isHasBtnId: isHasBtnId // :disabled="this.$isHasBtnId(121)"
});

Vue.config.productionTip = false;

/**
 * @description 按钮权限指令
 */
Vue.directive('has', {
  bind (el, binding) {
    let btnId;
    if (typeof binding.value === 'number') {
      btnId = binding.value;
    } else if (binding.value.includes('.')) {
      const btnMsgArr = binding.value.split('.');
      try {
        btnId = permisBtnIdSetting[btnMsgArr[0]][btnMsgArr[1]];
      } catch (err) {
        throw err;
      }
    }
    if (!isHasPerms(btnId, store.getters['permission/getPermisBtnIds'])) {
      el.style.display = 'none';
    }
  }
});

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
