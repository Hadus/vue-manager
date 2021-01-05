/*
 * @Author: liuhuitao
 * @Date: 2019-07-2 9:10:2
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-09-24 10:06:26
 * description: uum 配置文件(import {} from '@/config')
 */
export const uumConfig = {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '统一用户管理',
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: {
      api: 'uum', // api服务
      map: 'map', // 地图服务
      file: 'file', // 上传文件服务,
      source: 'source', // 上传文件拿到的文件服务
      monitor: 'monitor'
    }, // 开发模式本地服务
    pro: {
      api: 'uum',
      map: 'map',
      file: 'file',
      source: 'source',
      monitor: 'monitor'
    } // 生产模式线上服务
  }
};
let env = process.env.NODE_ENV === 'development' ? 'dev' : 'pro';
export const $api = uumConfig.baseUrl[env].api;
export const $map = uumConfig.baseUrl[env].map;
export const $file = uumConfig.baseUrl[env].file;
export const $source = uumConfig.baseUrl[env].source;
export const $monitor = uumConfig.baseUrl[env].monitor;
export const projectTitle = uumConfig.title;
