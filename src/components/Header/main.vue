<template>
  <header class="header">
    <div><img
        src="~@/assets/images/project_main_title.png"
        alt="mti-logo"
      ></div>
    <div style="flex:1;"></div>
    <div class="header-right">
      <div class="icon-items">
        <span class="avatar"></span>
        <span
          class="user-name"
          style="font-size:18px;color:#fff; margin-left:16px;"
        >{{ userName }}</span>
        <el-dropdown
          @visible-change="dropdownVivibleHandle"
          @command="handleDropdownCommand"
          trigger="click"
        >
          <div
            class="icon-item"
            :class="{
              opened: dropdownVivible
            }"
          ><i
              :class="!dropdownVivible ? 'el-icon-arrow-down':'el-icon-arrow-up el-icon-arrow-right'"
              style="color: #fff;font-size:16px;"
            ></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="item in dropdownList"
              :key="item.name"
              :divided="item.divided"
              :command="item"
            >
              <mti-svg-icon :icon-class="item.icon"></mti-svg-icon>
              <span style="font-size:16px; margin-left:10px;">{{ item.name }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>
<script>
import Vue from 'vue';
import { createNamespacedHelpers } from 'vuex';
import { Breadcrumb, BreadcrumbItem, Badge } from 'element-ui';
const { mapState: mapStateFromUser, mapActions } = createNamespacedHelpers('user');
const { mapActions: mapActionsFromPermission } = createNamespacedHelpers('permission');
const { mapActions: mapActionsFromMonitor, mapState: mapStateFromMonitor } = createNamespacedHelpers('monitor');
Vue.component(Breadcrumb.name, Breadcrumb);
Vue.component(BreadcrumbItem.name, BreadcrumbItem);
Vue.component(Badge.name, Badge);
export default {
  name: 'Header',
  components: {
  },
  data () {
    return {
      dropdownVivible: false,
      noticeVisible: false,
      dropdownList: [
        {
          name: '修改密码',
          icon: 'person'
        },
        {
          name: '退出系统',
          divided: true,
          icon: 'login-out'
        }
      ]
    };
  },
  computed: {
    ...mapStateFromUser(['userName']),
    ...mapStateFromMonitor(['isWsConnect', 'disconnectReason'])
  },
  watch: {
    isWsConnect (newVal, oldVal) {
      if (!newVal && oldVal && this.disconnectReason === 'error') {
        Promise.resolve().then(() => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(this.$notify({
                title: '提示：',
                type: 'error',
                message: '系统登录账户异地登录或异常，请重新登录',
                duration: 6000,
                offset: 100
              }));
            }, 2000);
          });
        }).then(() => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              this.$store.dispatch('user/directEmptyUserState').then((res) => {
                this.$store.dispatch('monitor/WEBSOCKET_CLOSE');
                this.$store.dispatch('permission/clearPermission');
                resolve();
              });
            }, 2000);
          });
        }).then(() => {
          this.$router.replace({
            path: '/login'
          });
        });
      }
    }
  },
  methods: {
    ...mapActions(['loginOut']),
    ...mapActionsFromPermission(['clearPermission']),
    ...mapActionsFromMonitor(['WEBSOCKET_CLOSE']),
    dropdownVivibleHandle (visible) {
      this.dropdownVivible = visible;
    },
    async handleDropdownCommand (dropdownItem) {
      switch (dropdownItem.name) {
      case '修改密码':
        this.$emit('change-password');
        break;
      case '退出系统':
        this.loginOutSys();
        break;
      default:
        this.$message.error(`click on item ${dropdownItem.name}`);
        break;
      }
    },
    loginOutSys () {
      this.loginOut().then((res) => {
        if (res && res.data) {
          this.WEBSOCKET_CLOSE();
          this.clearPermission();
          this.$router.replace('/login');
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
$fontUrl: '~@/assets/font';
$headerHeight: 80px;
.header {
  height: $headerHeight;
  line-height: $headerHeight;
  // @include boxShadow;
  @include flex(row);
  justify-content: flex-start;
  align-items: center;
  position: relative;
  background: url('~@/assets/images/components/header-bg.png') no-repeat;
  background-size: 100% 100%;
  .header-right {
    float: right;
    height: 100%;
    overflow: hidden;
    /deep/ .el-dropdown-link {
      cursor: pointer;
      color: #409eff;
    }
    /deep/ .el-icon-arrow-down {
      font-size: 12px;
    }
    // color: rgba(0, 0, 0, 0.65);
    @include flex(row);
    align-items: center;
    .icon-items {
      margin-right: 10px;
      height: 100%;
      @include flex(row);
      align-items: center;
      .icon-item {
        padding: 0 14px;
        @include flex(row);
        align-items: center;
        cursor: pointer;
        &.opened {
          background: $touchColor;
        }
        &:focus {
          outline: none;
        }
      }
    }
    .el-badge__content.is-fixed {
      top: 25px;
    }
    .icon-avatar {
      @include wh(47px, 47px);
      margin-right: 10px;
      vertical-align: middle !important;

      .user-name {
        font-size: 18px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color: rgba(9, 144, 236, 1);
      }
    }
  }
  > div:first-child {
    width: 339px;
    height: 100%;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .avatar {
    width: 50px;
    height: 50px;
    display: inline-block;
    background: url('~@/assets/images/common/avatar.png') no-repeat;
    background-size: 100% 100%;
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
</style>
