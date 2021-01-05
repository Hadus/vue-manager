/*
 * @Author: liuhuitao
 * @Date: 2019-08-20 14:01:38
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-09-09 17:39:45
 * @description: 用户登录调用接口
 */
import axios from '.';
import { $api } from '@/config';
// 账号登录
export const login = ({
  username,
  password,
  userValidCode,
  userPhone,
  loginType
}) => {
  const data = {
    userName: username,
    passWord: password,
    userValidCode,
    userPhone,
    loginType
  };
  return axios.request({
    url: $api + '/login',
    data,
    method: 'post'
  });
};
// 账号登出
export const loginOut = (data) => {
  return axios.request({
    url: $api + '/logout',
    data,
    method: 'post'
  });
};
// 获取验证码
export const getValidCode = ({ userPhone }) => {
  const data = {
    userPhone
  };
  return axios.request({
    url: $api + '/validcode',
    data,
    method: 'post'
  });
};
// 获取用户信息
export const getUserInfo = () => {
  return axios.request({
    url: $api + '/userinfo',
    method: 'get'
  });
};
