/*
 * @Author: liuhuitao
 * @Date: 2019-08-12 10:53:57
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-09-14 12:33:07
 * @description: 角色管理路由
 */
export default [
  {
    name: 'role',
    path: '/rolemanage',
    meta: { title: '角色管理' },
    component: () =>
      import(
        /* webpackChunkName: "accountManage" */ '@/views/roleManage/index.vue'
      )
  }
];
