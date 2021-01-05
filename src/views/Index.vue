<template>
  <div class="main-content">
    <Header @change-password="changePassVisible = true" />
    <div class="main-content-panel">
      <Sider />
      <section class="right-content">
        <div class="viewer">
          <transition name="fade-move">
            <router-view class="viewer-detail"></router-view>
          </transition>
        </div>
      </section>
    </div>
    <!-- 修改密码 -->
    <mti-dialog
      :show.sync="changePassVisible"
      :width="'588px'"
      :title="'修改密码'"
    >
      <change-password
        v-if="changePassVisible"
        @oper-success="operSuccess"
        @close-dialog="changePassVisible = false"
      ></change-password>
    </mti-dialog>
  </div>
</template>

<script>
import Sider from '@/components/sider';
import Header from '@/components/Header';
import MenuConfig from '../config/menuConfig.js';
import { mapActions, mapGetters, createNamespacedHelpers } from 'vuex';
import mtiDialog from '@/components/dialog';
import changePassword from '@/views/accountManage/changePassword.vue';
const { mapActions: mapActionsFromUser } = createNamespacedHelpers('user');
const { mapActions: mapActionsFromPermission } = createNamespacedHelpers('permission');
export default {
  name: 'mainContent',
  components: {
    Sider,
    Header,
    mtiDialog,
    changePassword
  },
  data () {
    return {
      drawerVisible: false,
      changePassVisible: false
    };
  },
  mounted () {
    this.changeBreadcrumb(this.$route);
  },
  computed: {
    ...mapGetters(['getCurrentMenuStyle'])
  },
  watch: {
    $route () {
      this.changeBreadcrumb(this.$route);
    }
  },
  methods: {
    ...mapActions(['BREADCRUMB_ITEMS', 'CURRENT_MENU_STYLE']),
    ...mapActionsFromUser(['loginOut']),
    ...mapActionsFromPermission(['clearPermission']),
    changeBreadcrumb (route) {
      let oneLevelMenu = {};
      let twoLevelMenu = {};
      MenuConfig.forEach((menu) => {
        if (menu.children) {
          const item = menu.children.find((item) => item.path === route.path);
          if (item) {
            oneLevelMenu = menu;
            twoLevelMenu = item;
            return false;
          }
        } else {
          if (menu.path === route.path) {
            oneLevelMenu = menu;
          }
        }
      });
      this.BREADCRUMB_ITEMS([oneLevelMenu, twoLevelMenu]);
    },
    changeStyle (style) {
      this.CURRENT_MENU_STYLE(style);
    },
    // 已修改密码提示
    changedPassTips () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // resolve();
          resolve(this.$notify({
            title: '提示：',
            message: '系统登录账户密码已修改，请重新登录',
            offset: 100
          }));
        }, 2000);
      });
    },
    // 跳转登录页
    jumpLoginPage () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // resolve();
          resolve(this.loginOut().then((res) => {
            if (res && res.data === true) {
              this.clearPermission();
              this.$router.replace('/login');
            }
          }));
        }, 5000);
      });
    },
    // 修改密码成功
    operSuccess () {
      this.changePassVisible = false;
      Promise.resolve().then(() => {
        this.changedPassTips();
      }).then(() => {
        this.jumpLoginPage();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.main-content {
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC,
    Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
  @include flex(column);
  .main-content-panel {
    @include flex(row);
    height: calc(100vh - 80px);
  }
  .right-content {
    flex: 1;
    @include flex;
    height: 100%;
  }
  .viewer {
    background: #ebeef1;
    height: 100%;
    flex: 1;
    overflow: auto;
    overflow-x: hidden;
    position: relative;
    @include flex;
    &-detail {
      width: 100%;
      height: 100%;
      position: absolute;
    }
  }
  .fade-move-enter-active,
  .fade-move-leave-active {
    transition: 0.3s all ease;
    // position: absolute
  }
  .fade-move-enter,
  .fade-move-leave-to {
    opacity: 0;
    transform: translateX(-100px);
  }
  .fade-move-enter-to,
  .fade-move-leave {
    opacity: 1;
    transform: translateX(0);
  }
}

.drawer-handle {
  position: absolute;
  right: 300px;
  top: 240px;
  z-index: 0;
  width: 48px;
  height: 48px;
  font-size: 16px;
  text-align: center;
  background: var(--theme-color);
  color: #fff;
  border-radius: 4px 0 0 4px;
  cursor: pointer;
  pointer-events: auto;
  > div {
    @include center(column);
    width: 100%;
    height: 100%;
  }
}
.drawer-setting {
  &-content {
    .dark-color,
    .light-color {
      width: 48px;
      height: 45px;
      cursor: pointer;
    }
  }
  &-block {
    @include flex(row);
  }
  &-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
    font-weight: 500;
  }
  &-item {
    margin-right: 25px;
    position: relative;
    .style-selected {
      position: absolute;
      right: 10px;
      bottom: 10px;
    }
  }
}
</style>
