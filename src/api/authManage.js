/*
 * @Descripttion:authManage
 * @version:
 * @Author: ZhengPan
 * @Date: 2019-08-20 16:18:01
 * @LastEditors: ZhengPan
 * @LastEditTime: 2019-09-04 20:18:30
 */
import axios from '.';
import { $api } from '@/config';
// 查询系统列表
export const $getSystemList = () => {
  return axios.request({
    method: 'get',
    url: $api + '/app/findApp'
  });
};

// 修改系统列表
export const $modSystem = (data) => {
  return axios.request({
    method: 'post',
    url: $api + '/app',
    data
  });
};

// 添加系统
export const $addSystem = (data) => {
  return axios.request({
    method: 'put',
    url: $api + '/app',
    data
  });
};

// 权限详情界面
// 查询系统树
export const $getSystemDetail = (data) => {
  return axios.request({
    method: 'get',
    url: $api + '/menubtn/findItem',
    params: data
  });
};

// 修改系统树
export const $modSystemDetail = (data) => {
  return axios.request({
    method: 'post',
    url: $api + '/menubtnItem/tree',
    data
  });
};

// 添加系统详情
export const $addSystemItem = (data) => {
  return axios.request({
    method: 'put',
    url: $api + '/menubtn',
    data
  });
};

// 修改系统详情
export const $modSystemItem = (data) => {
  return axios.request({
    method: 'post',
    url: $api + '/menubtn',
    data
  });
};

// 删除系统详情
export const $delSystemItem = (data) => {
  return axios.request({
    method: 'delete',
    url: $api + `/menubtn/${data}`
  });
};
