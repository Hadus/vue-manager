/*
 * @Descripttion:personManage
 * @version:
 * @Author: ZhengPan
 * @Date: 2019-08-20 16:18:01
 * @LastEditors: ZhengPan
 * @LastEditTime: 2019-09-17 17:04:32
 */
import axios from '.';
import { $api } from '@/config';

// 查询组织列表
export const $getOrgList = () => {
  return axios.request({
    method: 'get',
    url: $api + '/depart/findDepart'
  });
};

// 查询人员列表
export const $getPersonList = (data) => {
  return axios.request({
    method: 'get',
    url: $api + '/person/findPerson/page',
    params: data
  });
};

// 查询人员详情
export const $getPersonDetail = (data) => {
  return axios.request({
    method: 'get',
    url: $api + '/person/findPerson',
    params: data
  });
};

// 添加人员
export const $addPersonList = (data) => {
  return axios.request({
    method: 'put',
    url: $api + '/person',
    data
  });
};

// 添加人员-同时创建账号
export const $addPersonAndAccount = (data) => {
  return axios.request({
    method: 'put',
    url: $api + '/person',
    data
  });
};

// 删除人员
export const $delPersonList = (data) => {
  return axios.request({
    method: 'delete',
    url: $api + `/person/${data}`
  });
};

// 修改人员详情
export const $modPersonDetail = (data) => {
  return axios.request({
    method: 'post',
    url: $api + '/person',
    data
  });
};

// 上移-下移人员
export const $modPersonSorted = (data) => {
  return axios.request({
    method: 'post',
    url: $api + '/person/updown',
    data
  });
};

// 下载导入模板
export const $exportFileTemp = (fileName = 'data.xlsx') => {
  return axios.request({
    method: 'get',
    url: $api + '/person/downtemplate',
    params: {
      fileName
    },
    responseType: 'blob' // 解决乱码
  });
};

// 导入人员
export const $importPersonList = ({ departId, file }) => {
  let data = new FormData();
  data.append('file', file);
  return axios.request({
    method: 'post',
    url: $api + `/person/importPerson?departId=${departId}`,
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// 导出人员
export const $exportPersonList = (data) => {
  return axios.request({
    method: 'get',
    url: $api + '/person/exportPerson',
    params: data,
    responseType: 'blob' // 解决乱码
  });
};
