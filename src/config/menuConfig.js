/*
 * @Author: liuhuitao
 * @Date: 2019-08-23 11:22:50
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-08-23 14:21:28
 * @Description: 左侧菜单jsonTree 配置格式
 */
export default [
  {
    name: '组织配置',
    path: '/orgconfig',
    icon: 'component',
    children: [
      {
        name: '组织管理',
        path: '/orgconfig/organiz/org-manage',
        icon: 'rich-text'
      },
      {
        name: '组织性质管理',
        path: '/orgconfig/organiz/org-nature',
        icon: 'rich-text'
      },
      {
        name: '行政区划管理',
        path: '/orgconfig/organiz/administrative-division',
        icon: 'drawer'
      },
      {
        name: '人员管理',
        path: '/orgconfig/personnel/person-manage',
        icon: 'rich-text'
      }
    ]
  },
  {
    name: '账号配置',
    path: '/accountconfig',
    icon: 'dashboard',
    children: [
      {
        name: '账号管理',
        path: '/accountconfig/allaccount',
        icon: 'rich-text'
      },
      {
        name: '在线用户管理',
        path: '/accountconfig/onlineaccount',
        icon: 'drawer'
      }
    ]
  },
  {
    name: '角色管理',
    path: '/rolemanage',
    icon: 'dashboard'
  },
  {
    name: '权限管理',
    path: '/authManage',
    icon: 'dashboard'
  },
  {
    name: '日志管理',
    path: '/logManage',
    icon: 'component',
    children: [
      {
        name: '安全日志',
        path: '/logManage/safety-log',
        icon: 'rich-text'
      },
      {
        name: '操作日志',
        path: '/logManage/operate-log',
        icon: 'rich-text'
      }
    ]
  }
];
