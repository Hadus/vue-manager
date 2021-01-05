/*
 * @Author: liuhuitao
 * @Date: 2019-08-22 13:32:34
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-10-25 10:04:29
 * @description: 组织配置调用接口
 */
import axios from '.';
import { $api, $source } from '@/config';
/** ----------------------- 组织管理 START ----------------------- */
// 查询组织机构树列表
export const getOrgTreeData = (params) => {
  return axios.request({
    url: $api + '/depart/findDepart',
    params,
    method: 'get'
  });
};
// 保存拖拽组织树结构
export const saveChangedOrgTree = (data) => {
  return axios.request({
    url: $api + '/depart/tree',
    data,
    method: 'post'
  });
};
// 查询业务上级数据
export const getAllSuperDepartData = (params) => {
  return axios.request({
    url: $api + '/depart/superDepart',
    params,
    method: 'get'
  });
};
// 查询组织机构表格列表
export const getOrgList = (params) => {
  return axios.request({
    url: $api + '/depart/findDepart/page',
    params,
    method: 'get'
  });
};
// 添加组织机构
export const addOrg = (data) => {
  return axios.request({
    url: $api + '/depart',
    data,
    method: 'put'
  });
};
// { departName, departId, departType, departNature }
// 删除组织机构
export const deleteOrg = (id) => {
  return axios.request({
    url: $api + `/depart/${id}`,
    method: 'delete'
  });
};
// 编辑组织机构
export const editOrg = (data) => {
  return axios.request({
    url: $api + '/depart',
    data,
    method: 'post'
  });
};
// 导出组织机构
export const exportOrg = ({ departParentId }) => {
  let params = { departParentId };
  return axios.request({
    url: $api + '/depart/exportDepart',
    params,
    method: 'get',
    responseType: 'blob' // 解决乱码
  });
};
// 下载组织机构模板excel
export const dowldOrgTem = ({ fileName }) => {
  let params = { fileName };
  return axios.request({
    url: $api + '/depart/downtemplate',
    params,
    method: 'get',
    responseType: 'blob' // 解决乱码
  });
};
// 导出日志
export const exportLog = (url) => {
  return axios.request({
    url: $source + '/' + url,
    method: 'get',
    responseType: 'blob' // 解决乱码
  });
};

/** ----------------------- 组织管理 END ----------------------- */
/** -------------------- 组织性质管理 START -------------------- */
// 获取组织性质列表【获取字典类型】
export const getOrgNatureList = (params) => {
  return axios.request({
    url: $api + '/dict',
    params,
    method: 'get'
  });
};
// 新增组织性质
export const addOrgNature = ({
  dictName,
  dictCode,
  appCode,
  dictType,
  dictSorted,
  dictDesc
}) => {
  let data = {
    dictName,
    dictCode,
    appCode,
    dictType,
    dictSorted,
    dictDesc
  };
  return axios.request({
    url: $api + '/dict',
    data,
    method: 'put'
  });
};
// 编辑组织性质
export const editOrgNature = ({
  dictName,
  dictCode,
  appCode,
  dictType,
  dictDesc,
  dictId,
  dictSorted
}) => {
  let data = {
    dictName,
    dictCode,
    appCode,
    dictType,
    dictDesc,
    dictId,
    dictSorted
  };
  return axios.request({
    url: $api + '/dict',
    data,
    method: 'post'
  });
};
// 删除组织性质
export const deleteOrgNature = (id) => {
  return axios.request({
    url: $api + `/dict/${id}`,
    method: 'delete'
  });
};
/** -------------------- 组织性质管理 END ---------------------- */
/** -------------------- 行政区划管理 START -------------------- */
// 添加行政区划
export const addAdmDiv = ({
  areaFullName,
  areaName,
  areaCode,
  areaLevel,
  areaJsonUrl,
  parentId
}) => {
  let data = {
    areaFullName,
    areaName,
    areaCode,
    areaLevel,
    areaJsonUrl,
    parentId
  };
  return axios.request({
    url: $api + '/area',
    data,
    method: 'put'
  });
};
// 保存拖拽组织树结构
export const saveChangedAreaTree = (data) => {
  return axios.request({
    url: $api + '/area/tree',
    data,
    method: 'post'
  });
};
// 修改行政区划
export const editAdmDiv = ({
  areaId,
  areaName,
  areaFullName,
  areaCode,
  areaLevel,
  areaJsonUrl,
  parentId
}) => {
  let data = {
    areaId,
    areaName,
    areaFullName,
    areaCode,
    areaLevel,
    areaJsonUrl,
    parentId
  };
  return axios.request({
    url: $api + '/area',
    data,
    method: 'post'
  });
};
// 删除行政区划
export const deleteAdmDiv = (id) => {
  return axios.request({
    url: $api + `/area/${id}`,
    method: 'delete'
  });
};
// 查询行政区划树
export const getAdmDivTreeData = ({ parentId }) => {
  let params = { parentId };
  return axios.request({
    // url: $api + '/area/tree',
    url: $api + '/area/findArea',
    params,
    method: 'get'
  });
};
// 查询行政区划表格
export const getAdmDivTableData = ({
  parentId,
  currentPage,
  pageSize,
  queryKey
}) => {
  let params = { parentId, currentPage, pageSize, queryKey };
  return axios.request({
    url: $api + '/area/findArea/page',
    params,
    method: 'get'
  });
};
/** -------------------- 行政区划管理 END ---------------------- */
