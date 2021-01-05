/*
 * @Descripttion:safetyLog
 * @version:
 * @Author: ZhengPan
 * @Date: 2019-08-20 16:18:01
 * @LastEditors: ZhengPan
 * @LastEditTime: 2019-09-03 15:29:04
 */
import axios from '.';
import { $api } from '@/config';

// 查询安全日志
export const $getLoginlogList = (data) => {
  return axios.request({
    method: 'get',
    url: $api + '/page/loginlog',
    params: data
  });
};

// 查询安全日志详情
export const $getLoginlogDetail = (data) => {
  return axios.request({
    method: 'get',
    url: $api + `/loginlog/${data}`
  });
};

// 删除过往安全日志
export const $delLoginlogList = (data) => {
  return axios.request({
    method: 'delete',
    url: $api + '/loginlog',
    params: data
  });
};

// 查询操作日志
export const $getOptlogList = (data) => {
  return axios.request({
    method: 'get',
    url: $api + '/page/optlog',
    params: data
  });
};

// 查询操作日志详情
export const $getOptlogDetail = (data) => {
  return axios.request({
    method: 'get',
    url: $api + `/optlog/${data}`
  });
};

// 删除过往登操作日志
export const $delOptlogList = (data) => {
  return axios.request({
    method: 'delete',
    url: $api + '/optlog',
    params: data
  });
};
