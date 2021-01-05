export default [
  // 组织
  {
    path: '/logManage/safety-log',
    name: 'safeTyLog',
    meta: { title: '安全日志' },
    component: () =>
      import(
        /* webpackChunkName: "safetyLog" */ '@/views/logManage/safetyLog/index.vue'
      )
  },
  {
    path: '/logManage/operate-log',
    name: 'operateLog',
    meta: { title: '操作日志' },
    component: () =>
      import(
        /* webpackChunkName: "operateLog" */ '@/views/logManage/operateLog/index.vue'
      )
  }
];
