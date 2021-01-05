/*
 * @Author: liuhuitao
 * @Date: 2019-08-02 11:20:19
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-10-09 17:00:27
 */
<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
const { mapActions: mapActionsFromMonitor } = createNamespacedHelpers('monitor');
export default {
  name: 'App',
  mounted () {
    window.addEventListener('beforeunload', (e) => {
      this.WEBSOCKET_CLOSE();
    });
  },
  methods: {
    ...mapActionsFromMonitor(['WEBSOCKET_CLOSE'])
  }
};
</script>
<style lang="scss">
@import '@/assets/styles/normalize.scss';
@import '@/assets/styles/reset.scss';
body {
  font-size: 18px;
  background: #f4f7fa;
}
#app {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC,
    Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol,
    Microsoft YaHei;
  font-size: 16px;
}
</style>
