/*
 * @Author: liuhuitao
 * @Date: 2019-08-23 09:44:47
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-10-08 18:09:49
 * @description: 应用系统调用接口
 */
import axios from '.';
import { $api } from '@/config';
// 获取系统应用列表
export const getAppListData = ({
  enabled,
  appName,
  appLoginEndpoint,
  appCode,
  sorted
}) => {
  const params = {
    enabled,
    appName,
    appLoginEndpoint,
    appCode,
    sorted
  };

  return axios.request({
    url: $api + '/app/findApp',
    params,
    method: 'get'
  });
};
// 根据应用ID查询有效菜单和按钮
export const getUsableAppData = ({ appId }) => {
  const params = {
    appId
  };
  return axios.request({
    url: $api + '/menubtn/app',
    params,
    method: 'get'
  });
};
/**
 * @description 获取字典数据
 */
export const getDictList = ({ dictTypes, queryKey }) => {
  let params = {
    dictTypes, // 字典类型
    queryKey // 名称
  };
  return axios.request({
    url: $api + '/dict',
    params,
    method: 'get'
  });
};
