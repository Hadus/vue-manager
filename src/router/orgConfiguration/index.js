/*
 * @Author: liuhuitao
 * @Date: 2019-08-6 9:10:17
 * @Last Modified by:
 * @Last Modified time: 2019-08-12 10:21:3131
 * @description: 组织配置路由
 */
export default [
  // 组织
  {
    path: '/orgconfig/organiz/org-manage',
    name: 'orgManage',
    meta: { title: '组织管理' },
    component: () =>
      import(
        /* webpackChunkName: "orgManage" */ '@/views/orgConfiguration/organizational/orgManage/index.vue'
      )
  },
  {
    path: '/orgconfig/organiz/org-nature',
    name: 'orgNature',
    meta: { title: '组织性质管理' },
    component: () =>
      import(
        /* webpackChunkName: "orgNature" */ '@/views/orgConfiguration/organizational/orgNature/index.vue'
      )
  },
  {
    path: '/orgconfig/organiz/administrative-division',
    name: 'administrativeDivision',
    meta: { title: '行政区划管理' },
    component: () =>
      import(
        /* webpackChunkName: "administrativeDivision" */ '@/views/orgConfiguration/organizational/administrativeDivision/index.vue'
      )
  },
  // 人员
  {
    path: '/orgconfig/personnel/person-manage',
    name: 'personManage',
    meta: { title: '人员管理' },
    component: () =>
      import(
        /* webpackChunkName: "personManage" */ '@/views/orgConfiguration/personnel/personManage/index.vue'
      )
  }
];
