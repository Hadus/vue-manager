/*
 * @Author: liuhuitao
 * @Date: 2019-08-6 9:42:21
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-10-15 16:22:08
 */
import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import Index from '@/views/Index.vue';
import { getUserInfo } from '@/api/user';
import { getToken } from '@/utils';
import { asyncFn, _listToTree, getPageTitle } from '@/utils/mtiUtils';
import { Message } from 'element-ui';
Vue.use(Router);

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
  }
 */

const IndexRoute = {
  path: '/',
  component: Index,
  redirect: '/login',
  children: []
};

let routes = [
  IndexRoute,
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录' },
    component: () =>
      import(/* webpackChunkName: "login" */ '@/views/login/index.vue')
  },
  {
    path: '/404',
    name: '404',
    meta: { title: '404' },
    component: () =>
      import(/* webpackChunkName: "404" */ '@/views/errorPage/404.vue')
  },
  {
    path: '*',
    redirect: '/404'
  }
];
const whiteList = ['/login', '/authManage/authDetail', '/404']; // no redirect whitelist

const routerContext = require.context('./', true, /index\.js$/);
routerContext.keys().forEach((route) => {
  // 如果是根目录的 index.js 、不处理
  if (route.startsWith('./index')) {
    return;
  }
  const routerModule = routerContext(route);
  /**
   * 兼容 import export 和 require module.export 两种规范
   */
  IndexRoute.children = [
    ...IndexRoute.children,
    ...(routerModule.default || routerModule)
  ];
});

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes,
    mode: 'hash' // 后端配置 - https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

const isHasToPath = (toPath, menuData) => {
  if (JSON.stringify(menuData).indexOf(toPath) === -1) {
    return false;
  } else {
    return true;
  }
};
router.beforeEach(async (to, from, next) => {
  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the defaultToPath page
      next({ path: store.getters['permission/getDefaultToPath'] });
    } else {
      // 判断当前路由在菜单数据中是否存在
      let menuData = store.getters['permission/getMenuTreeData'];
      const hasMenu =
        (menuData && menuData.length > 0 && isHasToPath(to.path, menuData)) ||
        whiteList.indexOf(to.path) !== -1;
      if (hasMenu) {
        if (
          store.getters['monitor/getWebSocket'].readyState === undefined &&
          store.getters['user/getUserName']
        ) {
          // 解决 F5 刷新，webSocket 自动关闭问题（保持长连接）
          store.dispatch(
            'monitor/WEBSOCKET_INIT',
            store.getters['user/getUserName']
          );
        }
        next();
      } else {
        try {
          // note: MenuData must be a object array!
          // generate accessible menus
          const [res] = await asyncFn(getUserInfo());
          if (res && res.data) {
            let menusTreeData = _listToTree(
              res.data.menus,
              {
                rootId: -1,
                pidname: 'parentId',
                cidname: 'itemId'
              },
              {}
            );
            menusTreeData = JSON.parse(
              JSON.stringify(menusTreeData)
                .replace(/itemName/g, 'name')
                .replace(/itemRoute/g, 'path')
                .replace(/itemIcon/g, 'icon')
            );
            router.addRoutes(menusTreeData);
            next({ ...to, replace: true });
          } else {
            next({ path: '/404' });
          }
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/loginOut');
          await store.dispatch('permission/clearPermission');
          Message.error(error || 'Has Error');
          next({ path: 'login' });
        }
      }
    }
  } else {
    /* has no token */
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next({ path: 'login' });
    }
  }
});
export default router;
