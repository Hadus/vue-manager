/* eslint-disable */
/*
 * @Author: liuhuitao
 * @Date: 2019-08-09 11:03:51
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-10-21 09:49:55
 */
import { Message } from 'element-ui';
import { $source } from '@/config';
export const orgMapInstance = {
  oThisMap: null,
  allMarkers: [], // 所有标记
  areaAllLayer: [], // 行政区划所有图层
  orgAllLayer: [], // 组织机构所有图层
  infoWindow: new AMap.InfoWindow({
    offset: new AMap.Pixel(0, -24)
  }),
  // 初始化地图
  initMap: function() {
    try {
      orgMapInstance.oThisMap = new AMap.Map('map_container', {
        zoom: 6, // 级别
        center: [108.93, 34.27], // 中心点坐标
        resizeEnable: true,
        pitch: 0
      });
      // 加载搜索插件
      orgMapInstance.searchPlugin();
    } catch (e) {
      console.log(e);
    }
  },
  addFirstMark: lnglatXY => {
    let initPointMarker = new AMap.Marker({
      position: lnglatXY, //关键值
      offset: new AMap.Pixel(-13, -30)
      // 设置是否可以拖拽
      // draggable: true,
      // cursor: 'move',
      // // 设置拖拽效果
      // raiseOnDrag: true
    });
    orgMapInstance.allMarkers.push(initPointMarker);
    initPointMarker.setMap(orgMapInstance.oThisMap);
    orgMapInstance.getMarkDetInfoBylnglat(initPointMarker.B.position);
    initPointMarker.on('click', orgMapInstance.getMarkDetInfo);
  },
  addFirstDraggableMark: lnglatXY => {
    let initPointMarker = new AMap.Marker({
      position: lnglatXY, //关键值
      offset: new AMap.Pixel(-13, -30),
      // 设置是否可以拖拽
      draggable: true,
      cursor: 'move',
      // // 设置拖拽效果
      raiseOnDrag: true
    });
    orgMapInstance.allMarkers.push(initPointMarker);
    initPointMarker.setMap(orgMapInstance.oThisMap);
    orgMapInstance.getMarkDetInfoBylnglat(initPointMarker.B.position);
    initPointMarker.on('click', orgMapInstance.getMarkDetInfo);
    initPointMarker.on('dragend', orgMapInstance.getMarkDetInfo);
  },
  //删除已标记的点
  clearAllMark: () => {
    if (orgMapInstance.allMarkers.length > 0) {
      orgMapInstance.oThisMap.remove(orgMapInstance.allMarkers);
      orgMapInstance.allMarkers = [];
    }
  },
  // 移除所有图层
  clearAllLayer: () => {
    orgMapInstance.oThisMap.remove(orgMapInstance.areaAllLayer);
    orgMapInstance.oThisMap.remove(orgMapInstance.orgAllLayer);
    orgMapInstance.orgAllLayer = [];
    orgMapInstance.areaAllLayer = [];
  },
  // 移除行政区划所有图层
  clearAreaAllLayer: () => {
    if (orgMapInstance.areaAllLayer.length > 0) {
      orgMapInstance.oThisMap.remove(orgMapInstance.areaAllLayer);
      orgMapInstance.areaAllLayer = [];
    }
  },
  // 移除组织机构所有图层
  clearOrgAllLayer: () => {
    if (orgMapInstance.orgAllLayer.length > 0) {
      orgMapInstance.oThisMap.remove(orgMapInstance.orgAllLayer);
      orgMapInstance.orgAllLayer = [];
    }
  },
  // 搜素插件
  searchPlugin: () => {
    orgMapInstance.oThisMap.plugin(['AMap.ToolBar'], () => {
      orgMapInstance.oThisMap.addControl(new AMap.ToolBar());
    });
    if (location.href.indexOf('&guide=1') !== -1) {
      orgMapInstance.oThisMap.setStatus({ scrollWheel: false });
    }

    AMapUI.loadUI(['misc/PoiPicker'], PoiPicker => {
      let poiPicker = new PoiPicker({
        // city:'北京',
        input: 'search_input'
      });
      // 初始化poiPicker
      orgMapInstance.poiPickerReady(poiPicker);
    });
  },
  // 查询
  poiPickerReady: poiPicker => {
    window.poiPicker = poiPicker;
    let newMarker = new AMap.Marker({
      offset: new AMap.Pixel(-13, -30),
      // 设置是否可以拖拽
      draggable: true,
      cursor: 'move',
      // 设置拖拽效果
      raiseOnDrag: true
    });
    newMarker.on('dragend', orgMapInstance.getMarkDetInfo);
    newMarker.on('click', orgMapInstance.getMarkDetInfo);
    orgMapInstance.allMarkers.push(newMarker);

    // 选取了某个POI
    poiPicker.on('poiPicked', poiResult => {
      let poi = poiResult.item;
      orgMapInstance.clearAllMark(); //删除已标记的点
      newMarker.setMap(orgMapInstance.oThisMap);
      newMarker.setPosition(poi.location);
      orgMapInstance.getMarkDetInfoBylnglat(poi.location);
    });
  },
  /**
   *
   * @param {Object} lnglat :{P: 34.27, Q: 108.93, lng: 108.93, lat: 34.27}
   * @description 获取点信息
   */
  getMarkDetInfoBylnglat: lnglat => {
    let lng = lnglat.getLng();
    let lat = lnglat.getLat();
    // console.log("经度："+lng+"纬度"+lat);
    let lnglatXY = [lng, lat]; // 地图上所标点的坐标
    let oThisMark = lnglat;
    orgMapInstance.mapDetInfo(lnglatXY, oThisMark);
  },
  // 获取点信息
  getMarkDetInfo: e => {
    let lng = e.lnglat.getLng();
    let lat = e.lnglat.getLat();
    let oThisMark = e.lnglat;
    // console.log('经度：' + lng + '纬度' + lat);
    let lnglatXY = [lng, lat]; // 地图上所标点的坐标
    orgMapInstance.mapDetInfo(lnglatXY, oThisMark);
  },
  mapDetInfo: (lnglatXY, oThisMark) => {
    AMap.service('AMap.Geocoder', () => {
      // 回调函数
      let geocoder = new AMap.Geocoder({});
      geocoder.getAddress(lnglatXY, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          // 获得了有效的地址信息:即，result.regeocode.formattedAddress
          let address = result.regeocode.formattedAddress; //地址
          orgMapInstance.getDetAddress(address, lnglatXY);
          orgMapInstance.infoWindow.setContent(
            '<em style="font-weight:700;">地址信息:</em> <br/>' + address
          );
          orgMapInstance.infoWindow.open(orgMapInstance.oThisMap, oThisMark);
          orgMapInstance.oThisMap.setCenter(oThisMark);
        } else {
          // 获取地址失败
          console.log('获取地址失败');
        }
      });
    });
  },
  initAreaLayer: (jsonUrl, layerType) => {
    ajax($source + '/' + jsonUrl, (err, geoJSON) => {
      if (!err) {
        var geojson = new AMap.GeoJSON({
          geoJSON: geoJSON,
          // 还可以自定义getMarker和getPolyline
          getPolygon: (geojson, lnglats) => {
            // 计算面积
            var area = AMap.GeometryUtil.ringArea(lnglats[0]);

            let polygon = new AMap.Polygon({
              path: lnglats,
              fillOpacity: 1 - Math.sqrt(area / 8000000000), // 面积越大透明度越高
              strokeColor: 'white',
              fillColor: '#409EFF'
            });
            if (layerType === 'area') {
              orgMapInstance.areaAllLayer.push(polygon);
            } else {
              orgMapInstance.orgAllLayer.push(polygon);
            }
            return polygon;
          }
        });

        geojson.setMap(orgMapInstance.oThisMap);
      } else {
        Message({
          message: 'GeoJSON 服务请求失败',
          type: 'error'
        });
      }
    });
  }
};
