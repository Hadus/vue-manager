/*
 * @Author: liuhuitao
 * @Date: 2019-08-12 10:20:17
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-09-18 17:16:09
 * @description: 账户管理路由
 */
export default [
  {
    name: 'allaccount',
    path: '/accountconfig/allaccount',
    meta: { title: '账户管理' },
    component: () =>
      import(
        /* webpackChunkName: "accountManage" */ '@/views/accountManage/index.vue'
      )
  },
  {
    name: 'onlineaccount',
    path: '/accountconfig/onlineaccount',
    meta: { title: '在线用户管理' },
    component: () =>
      import(
        /* webpackChunkName: "accountManage" */ '@/views/accountManage/onlineAccount.vue'
      )
  }
];
