export default [
  {
    path: '/authManage',
    name: 'authManage',
    meta: { title: '权限管理' },
    component: () =>
      import(
        /* webpackChunkName: "autnManage" */ '@/views/authManage/index.vue'
      )
  },
  {
    path: '/authManage/authDetail',
    name: 'authDetail',
    meta: { title: '权限详情' },
    component: () =>
      import(
        /* webpackChunkName: "authDetail" */ '@/views/authManage/authDetail.vue'
      )
  }
];
