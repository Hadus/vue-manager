/*
 * @Author: liuhuitao
 * @Date: 2019-08-30 17:48:57
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-09-15 11:38:18
 * @description:账户配置请求api
 */
import axios from '.';
import { $api } from '@/config';
/** -------------------- 账户管理 START -------------------- */
// 获取账户列表
export const getAccountList = (params) => {
  return axios.request({
    url: $api + '/user/findUser/page',
    params,
    method: 'get'
  });
};
// 新增账户
export const addAccount = (data) => {
  return axios.request({
    url: $api + '/user',
    data,
    method: 'put'
  });
};
export const editAccount = (data) => {
  return axios.request({
    url: $api + '/user',
    data,
    method: 'post'
  });
};
// 重置密码
export const restPass = (data) => {
  return axios.request({
    url: $api + '/user/resetuserpwd',
    data,
    method: 'post'
  });
};
// 修改密码
export const changePass = (data) => {
  // return axios.request({
  //   url: $api + '/user/resetuserpwd',
  //   data,
  //   method: 'post'
  // });
};
// 绑定设备
export const bindDevice = (data) => {
  return axios.request({
    url: $api + '/user/policy',
    data,
    method: 'put'
  });
};
// 获取用户解绑信息
export const getUserBindInfo = (params) => {
  return axios.request({
    url: $api + '/user/policy',
    params,
    method: 'get'
  });
};
// 解绑手机、解绑
export const unitedBindInfo = (data) => {
  return axios.request({
    url: $api + '/user/update',
    data,
    method: 'post'
  });
};
// 删除账户
export const deleteAccount = (id) => {
  return axios.request({
    url: $api + `/user/${id}`,
    method: 'delete'
  });
};
// 根据用户 id 获取权限
export const getUserPrivilege = (params) => {
  return axios.request({
    url: $api + '/user/privilege',
    params,
    method: 'get'
  });
};
/** -------------------- 账户管理 END -------------------- */
/** ------------------- 在线用户管理 START ------------------- */
// 查询在线用户
export const getOnlineAccount = ({
  appCode,
  endPoint,
  queryKey,
  startTime,
  endTime,
  currentPage,
  pageSize
}) => {
  const params = {
    appCode,
    endPoint,
    queryKey,
    startTime,
    endTime,
    currentPage,
    pageSize
  };

  return axios.request({
    url: $api + '/page/useronline',
    params,
    method: 'get'
  });
};
// 强踢下线
export const enforceOffline = (id) => {
  return axios.request({
    url: $api + `/useronline/${id}`,
    method: 'delete'
  });
};
/** -------------------- 在线用户管理 END -------------------- */
