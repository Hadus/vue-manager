/*
 * @Author: liuhuitao
 * @Date: 2019-03-15 8:59:55
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-09-20 14:45:25
 */
import Vue from 'vue';
import { mapActions, mapGetters, createNamespacedHelpers } from 'vuex';
import { Menu, MenuItem, Submenu } from 'element-ui';
import './sider.scss';
import { $source } from '@/config';
import defaultIcon from '@/assets/images/logo-menu.png';
const { mapGetters: mapGettersPermission } = createNamespacedHelpers(
  'permission'
);
Vue.component(Menu.name, Menu);
Vue.component(MenuItem.name, MenuItem);
Vue.component(Submenu.name, Submenu);
export default {
  name: 'sider',
  data () {
    return {
      defaultActive: '',
      sourcePath: $source,
      defaultIcon
    };
  },
  computed: {
    ...mapGetters(['getMenuCollapse', 'getMenuStyle', 'getCurrentMenuStyle']),
    ...mapGettersPermission(['getMenuTreeData'])
  },
  created () {
    this.defaultActive = this.$route.path;
  },
  methods: {
    ...mapActions(['MENU_COLLAPSE']),
    handleMenuFold () {
      this.MENU_COLLAPSE(!this.getMenuCollapse);
    },
    handleOpen (key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath);
    },
    renderMenu (menus) {
      return menus.map((menu) => {
        if (menu.children) {
          let bgImageAttr =
            'backgroundImage: url(' + this.sourcePath + '/' + menu.icon + ')';
          let dftBgImageAttr = 'backgroundImage: url(' + this.defaultIcon + ')';
          // const icon = menu.icon ? <mti-svg-icon icon-class={menu.icon} /> : '';
          const icon = menu.icon ? (
            <i class="menu-icon" style={bgImageAttr}></i>
          ) : (
            <i class="menu-icon" style={dftBgImageAttr}></i>
          );
          return (
            <el-submenu index={menu.path}>
              <template slot="title">
                {icon}
                <span>{menu.name}</span>
              </template>
              {this.renderMenu(menu.children)}
            </el-submenu>
          );
        } else {
          // const icon = menu.icon ? <mti-svg-icon icon-class={menu.icon} /> : '';
          let bgImageAttr =
            'backgroundImage: url(' + this.sourcePath + '/' + menu.icon + ')';
          let dftBgImageAttr = 'backgroundImage: url(' + this.defaultIcon + ')';
          const icon = menu.icon ? (
            <i class="menu-icon" style={bgImageAttr}></i>
          ) : (
            <i class="menu-icon" style={dftBgImageAttr}></i>
          );
          return (
            <el-menu-item index={menu.path}>
              {icon}
              <span slot="title">{menu.name}</span>
            </el-menu-item>
          );
        }
      });
    }
  },

  render () {
    return (
      <div
        class="sider"
        style={{
          backgroundColor: '#F8F8F8',
          position: 'relative'
        }}
      >
        <el-menu
          default-active={this.defaultActive}
          class={[
            'el-menu-vertical-demo',
            this.getCurrentMenuStyle === 'light' ? 'menu-light' : 'menu-dark'
          ]}
          background-color="#F8F8F8"
          text-color={this.getMenuStyle.textColor}
          active-text-color={this.getMenuStyle.activeTextColor}
          router={true}
          collapse={this.getMenuCollapse}
          open={this.handleOpen}
          close={this.handleClose}
        >
          {this.renderMenu(this.getMenuTreeData)}
        </el-menu>
        <span class="collapse-icon">
          <mti-svg-icon
            class-name="menu-fold"
            icon-class="menu-fold"
            style={
              this.getMenuCollapse
                ? 'transform:rotate(180deg)'
                : 'transform:rotate(0)'
            }
            onclick={this.handleMenuFold}
          ></mti-svg-icon>
        </span>
      </div>
    );
  }
};
