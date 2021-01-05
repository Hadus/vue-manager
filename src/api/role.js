/*
 * @Author: liuhuitao
 * @Date: 2019-08-22 13:32:34
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-10-08 16:52:18
 * @description: 角色调用接口
 */
import axios from '.';
import { $api } from '@/config';
// 获取角色列表数据
export const getRoleData = (params) => {
  return axios.request({
    url: $api + '/role/findRole/page',
    params,
    method: 'get'
  });
};
// 根据应用ID查询有效角色
export const getRoleDataByAppIds = (params) => {
  return axios.request({
    url: $api + '/approle',
    params,
    method: 'get'
  });
};
// 添加角色
export const addRole = ({
  roleTypeValue,
  roleName,
  roleDesc,
  roleType,
  enabled
}) => {
  const data = {
    roleTypeValue,
    roleName,
    roleDesc,
    roleType,
    enabled
  };
  return axios.request({
    url: $api + '/role',
    data,
    method: 'put'
  });
};
// 删除角色
export const deleteRole = ({ id }) => {
  return axios.request({
    url: $api + `/role/${id}`,
    method: 'delete'
  });
};
// 修改角色
export const editRole = ({
  roleDesc,
  roleName,
  roleType,
  roleTypeValue,
  enabled,
  roleId
}) => {
  const data = {
    roleDesc,
    roleName,
    roleType,
    roleTypeValue,
    enabled,
    roleId
  };
  return axios.request({
    url: $api + '/role',
    data,
    method: 'post'
  });
};
// 查询角色权限列表
export const getRolePermission = ({ roleId, appId }) => {
  const params = {
    roleId,
    appId
  };

  return axios.request({
    url: $api + '/role/privilege',
    params,
    method: 'get'
  });
};
// 传入多个角色查询权限列表
export const getRolePermiByMultRole = ({ roleIds }) => {
  const params = {
    roleIds
  };

  return axios.request({
    url: $api + '/role/app',
    params,
    method: 'get'
  });
};

// 角色赋权限
export const grantAuthority = ({
  roleId,
  privilegeType,
  roleType,
  itemIds,
  appId
}) => {
  const data = {
    roleId,
    privilegeType,
    roleType,
    itemIds, //  []
    appId
  };
  return axios.request({
    url: $api + '/role/privilege',
    data,
    method: 'put'
  });
};
