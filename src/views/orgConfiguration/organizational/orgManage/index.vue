/*
 * @Author: liuhuitao
 * @Date: 2019-08-08 16:51:53
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-10-25 09:30:30
 * @description: 组织管理
 */
<template>
  <div>
    <div class="main-container">
      <!-- 左侧 -->
      <div class="left-panel">
        <div class="l-title-bar">
          <span> <i class="customize-icon org-icon"></i> 组织架构 </span>
          <span
            @click="handelOperOrg('add')"
            v-has="permisBtnIdSetting.addOrgBtn"
          >
            <i
              class="customize-icon add-icon"
              v-show="!operOrgFormVisible"
            ></i>
          </span>
        </div>
        <!-- 左侧查询树 -->
        <div class="tree-panel">
          <mti-tree
            :refName="'mtiTree'"
            :tree-list="treeList"
            :search="treeConfig.search"
            :drag="treeConfig.drag"
            :check="treeConfig.check"
            :currentNodeKey="currentNodeKey"
            :isShowDisableMark="treeConfig.isShowDisableMark"
            :expandedkeys="expandedkeys"
            :operate="treeConfig.operate"
            :defaultProps="{children: 'children',label: 'departFullName'}"
            :icon="true"
            :is-admin="false"
            :node-key="'departId'"
            @onNodeClick="handleNodeClick"
            @onNodeDrag="handleNodeDrag"
          ></mti-tree>
          <transition name="el-fade-in">
            <div
              class="action-btn-group"
              v-show="!operOrgFormVisible"
            >
              <el-button
                type="success"
                @click="dataImportVisible = true"
                v-has="permisBtnIdSetting.importOrgBtn"
                style="width:110px; height:42px;"
              >
                <i class="customize-icon import-icon"></i>&nbsp;&nbsp;&nbsp;&nbsp;导入
              </el-button>
              <el-button
                type="warning"
                v-has="permisBtnIdSetting.exportOrgBtn"
                style="width:110px; height:42px;"
                @click="exportOrgData"
              >
                <i class="customize-icon export-icon"></i>&nbsp;&nbsp;&nbsp;&nbsp;导出
              </el-button>
            </div>
          </transition>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="right-panel">
        <div class="r-title-bar">
          <span> <i class="customize-icon list-icon"></i> 组织详情 </span>
          <span v-show="!operOrgFormVisible && treeList.length !== 0">
            <i
              class="customize-icon edit-icon"
              @click="handelOperOrg('edit')"
              v-has="permisBtnIdSetting.editOrgBtn"
            ></i>
            <i
              class="customize-icon delete-icon"
              v-has="permisBtnIdSetting.deleteOrgBtn"
              @click="deleteOrg"
            ></i>
          </span>
        </div>
        <!-- 右侧 -->
        <div class="content-panel">
          <div class="org-det-container">
            <!-- 左侧点击树详情内容 -->
            <div class="top-det">
              <table
                v-show="!operOrgFormVisible"
                class="det-tb"
                cellspacing="0"
                cellpadding="0"
                v-loading="mtiTreeLoading"
              >
                <tbody>
                  <tr>
                    <td
                      class="ell1 max-width"
                      style="width: 50%;"
                    >组织代码：<span :title="currentDisplayOrgInfo.departCode">{{currentDisplayOrgInfo.departCode}}</span></td>
                    <td
                      class="ell1 max-width"
                      style="width: 50%;"
                    >业务上级：<span :title="allBusSuperiorDataDict[currentDisplayOrgInfo.departBizParentId]">{{allBusSuperiorDataDict[currentDisplayOrgInfo.departBizParentId]}}</span> </td>
                  </tr>
                  <tr>
                    <td class="ell1 max-width">组织全称：<span :title="currentDisplayOrgInfo.departFullName">{{currentDisplayOrgInfo.departFullName}}</span></td>
                    <td>组织简称：<span :title="currentDisplayOrgInfo.departName">{{currentDisplayOrgInfo.departName}}</span></td>
                  </tr>
                  <tr>
                    <td>组织类型：{{departTypeDict[currentDisplayOrgInfo.departType]}}</td>
                    <td>组织性质：{{departNatureDict[currentDisplayOrgInfo.departNature]}}</td>
                  </tr>
                  <tr>
                    <td>负&nbsp;&nbsp;责&nbsp;人：{{currentDisplayOrgInfo.departCharger}}</td>
                    <td>组织电话：{{currentDisplayOrgInfo.departPhone}}</td>
                  </tr>
                  <tr>
                    <td>行政区划：{{currentDisplayOrgInfo.areaName}}</td>
                    <td>下级组织数：{{currentDisplayOrgInfo.childDepartCount}}</td>
                  </tr>
                  <tr>
                    <td class="ell1 max-width">绑定网段：<span :title="currentDisplayOrgInfo.departNetmask">{{currentDisplayOrgInfo.departNetmask}}</span></td>
                    <td>在职人数：{{currentDisplayOrgInfo.perCount}}</td>
                  </tr>
                  <tr>
                    <td
                      style="position:relative;"
                      @mouseover="isSeeMoreNum = true"
                      @mouseleave="isSeeMoreNum = false"
                    >绑定串号：
                      <span
                        class="ell1"
                        style="width: 170px; display: inline-block;"
                      >{{currentDisplayOrgInfo.departImei}}</span>
                      <transition name="el-zoom-in-top">
                        <div
                          class="tipPanel"
                          v-show="isSeeMoreNum && handleDepartImei(currentDisplayOrgInfo.departImei).length>0"
                        >
                          <ul>
                            <li
                              v-for="(item,index) in handleDepartImei(currentDisplayOrgInfo.departImei)"
                              :key="index"
                            >{{item}}</li>
                          </ul>
                        </div>
                      </transition>
                    </td>
                    <td>组织状态：{{currentDisplayOrgInfo.enabled === 1 ? '启用':'未启用'}}</td>
                  </tr>
                  <tr>
                    <td colspan="2">组织地址：<span
                        class="ell1"
                        :title="currentDisplayOrgInfo.departAddress"
                        style="width: 520px; display: inline-block;"
                      >{{currentDisplayOrgInfo.departAddress}}</span></td>
                  </tr>
                  <tr>
                    <td
                      colspan="2"
                      style="height:147px;vertical-align: top; padding-top: 10px; box-sizing: border-box; line-height: 32px;"
                    >组织描述：{{currentDisplayOrgInfo.departDesc}}</td>
                  </tr>
                </tbody>
              </table>
              <el-form
                v-show="operOrgFormVisible"
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="90px"
                class="action-org-form"
              >
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item
                      label="组织代码 :"
                      prop="departCode"
                    >
                      <el-input
                        v-model="ruleForm.departCode"
                        maxlength="30"
                        placeholder="请输入组织代码"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      label="业务上级 :"
                      prop="departBizParentId"
                    >
                      <el-select
                        v-model="ruleForm.departBizParentId"
                        filterable
                        remote
                        :remote-method="getAllSuperiorData"
                        @clear="getAllSuperiorData('')"
                        :loading="superiorLoading"
                        clearable
                        placeholder="请选择业务上级"
                        style="width:100%;"
                      >
                        <el-option
                          v-for="item in allBusSuperiorData"
                          :key="item.departCode"
                          :label="item.departFullName"
                          :value="item.departCode"
                          style="height:68px;"
                        >
                          <p style="text-overflow: ellipsis; overflow: hidden;">名称：{{ item.departFullName }}</p>
                          <p style="font-size: 12px; color: #b4b4b4;">编码：{{ item.departCode }}</p>
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item
                      label="组织全称 :"
                      prop="departFullName"
                    >
                      <el-input
                        v-model="ruleForm.departFullName"
                        maxlength="40"
                        placeholder="请输入组织全称"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      label="组织简称 :"
                      prop="departName"
                    >
                      <el-input
                        v-model="ruleForm.departName"
                        maxlength="40"
                        placeholder="请输入组织简称"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item
                      label="组织类型 :"
                      prop="departType"
                    >
                      <el-select
                        v-model="ruleForm.departType"
                        placeholder="请选择组织类型"
                        style="width:100%;"
                      >
                        <!-- <el-option label="请选择组织类型" value="0"></el-option> -->
                        <el-option
                          v-for="(item, index) in departTypeGroup"
                          :key="index"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      label="组织性质 :"
                      prop="departNature"
                    >
                      <el-select
                        v-model="ruleForm.departNature"
                        placeholder="请选择组织性质"
                        style="width:100%;"
                      >
                        <!-- <el-option label="请选择组织性质" value="0"></el-option> -->
                        <el-option
                          v-for="(item, index) in departNatureGroup"
                          :key="index"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                        <div
                          id="add-departNature-btn"
                          v-has="orgNatepermisBtnIdSetting.add"
                          @click="adddepartNatureVisible = true"
                        >
                          新增组织性质
                        </div>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item
                      label="负责人 :"
                      prop="departCharger"
                    >
                      <el-input
                        v-model="ruleForm.departCharger"
                        maxlength="32"
                        placeholder="请输入负责人名称"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      label="组织电话 :"
                      prop="departPhone"
                    >
                      <el-input
                        v-model="ruleForm.departPhone"
                        maxlength="16"
                        placeholder="请输入组织电话"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item
                      label="绑定网段 :"
                      prop="departNetmask"
                    >
                      <el-input
                        v-model="ruleForm.departNetmask"
                        maxlength="120"
                        placeholder="请输入网段，多个英文逗号隔开"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      label="行政区划 :"
                      prop="areaCode"
                    >
                      <div style="display:flex;flex-flow:row nowrap;">
                        <el-select
                          v-model="ruleForm.areaCode"
                          filterable
                          remote
                          :remote-method="getAllAdminDiviData"
                          :loading="adminDiviLoading"
                          clearable
                          @clear="getAllAdminDiviData('')"
                          placeholder="请选择行政区划"
                          @change="handleAdminDiviSelect"
                        >
                          <el-option
                            v-for="item in allAdminDiviData"
                            :key="item.areaCode"
                            :label="item.areaName"
                            :value="item.areaCode"
                            style="height:68px;"
                          >
                            <p style="text-overflow: ellipsis; overflow: hidden;">名称：{{ item.areaName }}</p>
                            <p style="font-size: 12px; color: #b4b4b4;">编码：{{ item.areaCode }}</p>
                          </el-option>
                        </el-select>
                        <el-upload
                          action=""
                          :limit="1"
                          name='file'
                          accept=".json"
                          :http-request="uploadAreaJsonFile"
                          :headers="headers"
                          :show-file-list="false"
                          :file-list="fileList"
                          style="width: 42px;background-color: #6ab946;text-align: center;border-radius: 4px;"
                        >
                          <i
                            class="customize-icon upload-icon"
                            style="width: 16px;height: 16px; margin-bottom: -3px;background-size: 100% 100%;"
                          ></i>
                        </el-upload>
                      </div>
                      <!-- 行政区划：采用基础代码数据，不用下拉框，快捷输入，自动匹配行政区划管理里面的数据 -->
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item
                      label="绑定串号 :"
                      prop="departImei"
                    >
                      <el-input
                        v-model="ruleForm.departImei"
                        placeholder="请输入串号，多个英文逗号隔开"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      label="组织状态 :"
                      prop="enabled"
                    >
                      <el-switch
                        v-model="ruleForm.enabled"
                        :active-value="1"
                        :inactive-value="0"
                      >
                      </el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="24">
                    <!-- 参考：https://blog.csdn.net/izengjing/article/details/81354908 -->
                    <el-form-item
                      label="组织地址 :"
                      prop="departAddress"
                    >
                      <el-input
                        id="search_input"
                        @input="clearAddress"
                        v-model="ruleForm.departAddress"
                        placeholder="请输入详细地址"
                      >
                        <!-- <el-cascader
                        id="select_city"
                        clearable
                        size="large"
                        :options="options"
                        v-model="ruleForm.departAddressCode"
                        @change="selectCityChange"
                        slot="prepend"
                        style="width:242px"
                      ></el-cascader> -->
                        <i
                          class="customize-icon point-icon"
                          slot="suffix"
                        ></i>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="24">
                    <el-form-item
                      label="组织描述 :"
                      prop="departDesc"
                    >
                      <el-input
                        type="textarea"
                        v-model="ruleForm.departDesc"
                        rows="3"
                        maxlength="100"
                        placeholder="请输入组织描述内容"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <!-- 地图 -->

              <div class="map-wrapper">
                <div id="map_container"></div>
              </div>
            </div>
            <div
              class="btn-group"
              :style="{height:!operOrgFormVisible?'0':'86px'}"
            >
              <span v-show="operOrgFormVisible">
                <el-button
                  class="btn"
                  @click="cancelSave('ruleForm')"
                >取消</el-button>
                <el-button
                  class="btn"
                  type="primary"
                  @click="saveOrg('ruleForm')"
                  style="margin-left:90px;"
                >保存</el-button>
              </span>
            </div>
            <!-- 下级组织内容 -->
            <div class="bottom-tb">
              <div class="title-panel">
                <i
                  class="subordinate-icon"
                  style="width: 30px;height: 30px;"
                ></i>
                下级组织
              </div>

              <div
                class="next-det"
                :style="{pointerEvents:!operOrgFormVisible ? 'auto': 'none'}"
              >
                <!-- 分页器 -->
                <el-pagination
                  class="el-page"
                  background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[4, 8, 12, 16, 20]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                ></el-pagination>
                <!-- 下级组织详情表格 -->
                <el-table
                  class="next-tb"
                  :header-row-style="{ color: '#333333'}"
                  :header-cell-style="{ backgroundColor: '#F8F8F8' }"
                  stripe
                  :data="tableData"
                  border
                  style="width: 100%"
                  v-loading="loading"
                >
                  <el-table-column
                    type="index"
                    width="80"
                    label="序号"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="departCode"
                    label="组织代码"
                    width="180"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="departBizParentId"
                    label="业务上级"
                    width="180"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <div>
                        {{allBusSuperiorDataDict[scope.row.departBizParentId]}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="departFullName"
                    label="组织全称"
                    width="180"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="departName"
                    label="组织简称"
                    width="180"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="departType"
                    label="组织类型"
                    width="180"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <div>
                        {{departTypeDict[scope.row.departType]}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="departNature"
                    label="组织性质"
                    width="180"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <div>
                        {{departNatureDict[scope.row.departNature]}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="departCharger"
                    label="负责人"
                    width="180"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="departPhone"
                    label="组织电话"
                    width="180"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="areaName"
                    label="行政区划"
                    width="180"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="childDepartCount"
                    label="下级组织数"
                    width="180"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="perCount"
                    label="在职人数"
                    width="180"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="departNetmask"
                    label="绑定网段"
                    width="180"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="departAddress"
                    label="组织地址"
                    width="280"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="departDesc"
                    label="组织描述"
                    width="320"
                    align="center"
                  ></el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增组织性质弹框 -->
    <mti-dialog
      :show.sync="adddepartNatureVisible"
      :width="'660px'"
      :title="'新增组织性质'"
      @close-dialog="adddepartNatureVisible = false"
    >
      <oper-orgNature-form
        v-if="adddepartNatureVisible"
        @oper-success="addOrgNatureSuccess"
        @close-dialog="adddepartNatureVisible = false"
      ></oper-orgNature-form>
    </mti-dialog>
    <!-- 数据导入弹框 -->
    <mti-dialog
      :show.sync="dataImportVisible"
      :width="'660px'"
      :title="'数据导入'"
      @close-dialog="closeImportDialog"
    >
      <data-import
        v-if="dataImportVisible"
        :departParentid="currentDisplayOrgInfo.departId"
        @close-dialog="closeImportDialog"
        @import-success="importSuccess"
      ></data-import>
    </mti-dialog>
  </div>
</template>

<script>
import { $file } from '@/config';
import { uploadFile } from '@/api';
import { getDepartTypeDictData } from '@/assets/js/common/dictionary';
import mtiTree from '@/components/tree';
import { regionData, CodeToText } from 'element-china-area-data';
/**
 * CodeToText是个大对象，属性是区域码，属性值是汉字 用法例如：CodeToText['110000']输出北京市
TextToCode是个大对象，属性是汉字，属性值是区域码 用法例如：TextToCode['北京市']['市辖区'].code输出110100
 */
import { releaseFileStream } from '@/utils';
import { orgMapInstance } from '@/assets/js/orgConfig/org/map';
import mtiDialog from '@/components/dialog';
import dataImport from './dataImport';
import { asyncFn, checkPhoneNumber, checkLetChinNumComma, checkNumLetterComma, _listToTree, checkNumLetter, checkMultiNetworkSegment, checkLetChinNumUnder } from '@/utils/mtiUtils';
import operOrgNatureForm from '@/views/orgConfiguration/organizational/orgNature/operOrgNatureForm.vue';
import { getOrgTreeData, saveChangedOrgTree, getAllSuperDepartData, addOrg, deleteOrg, editOrg, getOrgList, exportOrg, getAdmDivTableData } from '@/api/orgConfiguration';

export default {
  name: 'orgManage',
  props: {},
  components: {
    mtiTree,
    mtiDialog,
    dataImport,
    operOrgNatureForm
  },
  data () {
    let checkTel = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入组织电话'));
      } else if (!checkPhoneNumber(value)) {
        callback(new Error('组织电话输入格式有误'));
      } else {
        callback();
      }
    };
    let checkdepartCharger = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入负责人，多个逗号隔开'));
      } else if (!checkLetChinNumComma(value)) {
        callback(new Error('负责人由汉字、数字、字母组成'));
      } else {
        callback();
      }
    };
    let checkedDepartCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入组织代码'));
      } else if (!checkNumLetter(value)) {
        callback(new Error('组织代码由数字或字母组成'));
      } else {
        callback();
      }
    };
    let checkedNetmask = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback();
      } else if (!checkMultiNetworkSegment(value)) {
        callback(new Error('绑定网段格式有误,例如：0.0.0.0/8'));
      } else {
        callback();
      }
    };
    let checkedImei = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback();
      } else if (!checkNumLetterComma(value)) {
        callback(new Error('绑定串号由数字、字母组成'));
      } else {
        callback();
      }
    };
    let checkDepartFullName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入组织全称'));
      } else if (!checkLetChinNumUnder(value)) {
        callback(new Error('全称由汉字、数字、字母或下划线组成'));
      } else {
        callback();
      }
    };
    let checkDepartName = (rule, value, callback) => {
      if (value === '') {
        callback();
      } else if (!checkLetChinNumUnder(value)) {
        callback(new Error('简称由汉字、数字、字母或下划线组成'));
      } else {
        callback();
      }
    };
    return {
      permisBtnIdSetting: this.$permisBtnIdSetting['orgManage'], // 权限按钮Id
      orgNatepermisBtnIdSetting: this.$permisBtnIdSetting['orgNature'], // 权限按钮Id
      // 组织机构树
      treeList: [],
      mtiTreeLoading: true,
      treeConfig: {
        search: true,
        check: false,
        drag: true,
        operate: false,
        isShowDisableMark: true
      },
      expandedkeys: [],
      currentNodeKey: '',
      // 当前展示的组织机构信息
      currentDisplayOrgInfo: {
        departCode: '',
        departBizParentId: '',
        departFullName: '',
        departName: '',
        departType: '',
        departNature: '',
        departCharger: '', // 负责人(2人)
        departPhone: '',
        areaCode: '',
        departNetmask: '',
        departImei: '',
        enabled: 1,
        departAddress: '',
        departDesc: ''
      },
      isSeeMoreNum: false,

      // 新增，编辑组织机构
      operOrgFormVisible: false, // 控制操作表单显隐
      operFormTitle: 'add', // edit、add
      options: regionData,
      mapSearchInput: '', // 地图搜索框

      superiorLoading: false,
      allBusSuperiorData: [], // 业务上级所有数据
      allBusSuperiorDataDict: {}, // 业务上级所有字典数据

      allAdminDiviData: [], // 行政区划所有数据
      adminDiviLoading: false,

      lnglatXY: {
        lng: '',
        lat: ''
      }, // 地图经纬度

      departJsonUrl: '', // 组织区划土层Json Url
      ruleForm: {
        departCode: '',
        departBizParentId: '',
        departFullName: '',
        departName: '',
        departType: '10',
        departNature: '10',
        departCharger: '', // 负责人(2人)
        departPhone: '',
        areaCode: '',
        departNetmask: '',
        departImei: '',
        enabled: 1,
        departAddressCode: [], // ['120000', '120100']
        departAddress: '',
        departDesc: ''
      },
      rules: {
        departCode: [
          { required: true, message: '请输入组织代码', trigger: 'blur' },
          {
            min: 2,
            max: 30,
            message: '长度在 2 到 30 个字符',
            trigger: 'blur'
          },
          { validator: checkedDepartCode, trigger: 'change' }
        ],
        departFullName: [
          { required: true, message: '请输入组织全称', trigger: 'blur' },
          { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur' },
          { validator: checkDepartFullName, trigger: 'change' }
        ],
        departName: [
          { required: true, message: '请输入组织简称', trigger: 'blur' },
          { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur' },
          { validator: checkDepartName, trigger: 'change' }
        ],
        departType: [
          { required: true, message: '请选择组织类型', trigger: 'change' }
        ],
        departNature: [
          { required: true, message: '请选择组织性质', trigger: 'change' }
        ],
        departCharger: [
          { required: true, message: '请输入负责人名称，多个逗号隔开', trigger: 'blur' },
          { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur' },
          { validator: checkdepartCharger, trigger: 'change' }
        ],
        departPhone: [
          { required: true, message: '请输入组织电话', trigger: 'blur' },
          { min: 7, max: 11, message: '长度在 7 到 11 个字符', trigger: 'blur' },
          { validator: checkTel, trigger: 'change' }
        ],
        departNetmask: [
          { validator: checkedNetmask, trigger: 'change' }
        ],
        departImei: [
          { min: 0, max: 120, message: '长度在 0 到 120 个字符', trigger: 'blur' },
          { validator: checkedImei, trigger: 'change' }
        ],
        areaCode: [
          { required: true, message: '请输入选择行政区划', trigger: 'change' }
        ],
        departAddress: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { min: 1, max: 70, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        departDesc: [
          { max: 100, message: '描述内容最大长度为 100 个字符', trigger: 'blur' }
        ]
      },
      departTypeGroup: [], // 组织类型下拉菜单
      departTypeDict: {}, // 组织类型字典
      departNatureGroup: [], // 组织性质下拉菜单
      departNatureDict: {}, // 组织性质字典
      adddepartNatureVisible: false,
      dataImportVisible: false, // 数据导入

      currentPage: 1,
      pageSize: 4,
      total: 0,
      tableData: [],
      loading: true,

      // 上传行政区划图层Json 文件
      fileList: [],
      fileServerUrl: $file + '/uploadFilesToFast',
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
  },
  watch: {},
  computed: {},
  created () {
    this.initTree();
    getDepartTypeDictData('DEPART_TYPE', this.departTypeGroup, this.departTypeDict);
    getDepartTypeDictData('DEPART_NATURE', this.departNatureGroup, this.departNatureDict);
  },
  async mounted () {
    orgMapInstance.initMap();
    this.loadBusSuperData();
    // 地图实例绑定方法
    orgMapInstance.getDetAddress = this.getPointAddress;
  },
  beforeDestroy () {
    orgMapInstance.oThisMap = null;
  },
  methods: {
    /**
     * @description:初始化选择树(同时显示当前选择组织机构的信息及其行政区划地图)
     */
    initTree () {
      this.mtiTreeLoading = true;
      this.treeList = [];
      getOrgTreeData({
        // departName: '' // 组织机构简称
      }).then((res) => {
        if (res && res.data) {
          let data = res.data;
          if (data.length === 0) {
            return;
          }
          this.treeList = _listToTree(data, {
            rootId: -1,
            pidname: 'departParentId',
            cidname: 'departId'
          }, {});
        }
      });
    },
    /**
     * @description：初始化详情表格数据(首次加载显示根节点组织信息，新增后显示新增后的组织信息)
     */
    initOrgListTable () {
      this.tableData = [];
      this.loading = true;
      getOrgList({
        departParentId: this.currentDisplayOrgInfo.departId,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }).then((res) => {
        if (res && res.data) {
          this.total = res.data.totalCount;
          this.tableData = res.data.list;
          this.loading = false;
        }
      });
    },
    // 点击tree的节点
    handleNodeClick (data) {
      this.queryConditionInit();
      // 组织详情
      // eslint-disable-next-line no-undef
      _.assign(this.currentDisplayOrgInfo, data);
      // 地图
      this.removeMapAllInfo();
      if (this.operOrgFormVisible === false) {
        this.loadMapInfo(data);
      }
      // 表格
      this.initOrgListTable();

      if (this.operOrgFormVisible === true) {
        if (this.operFormTitle === 'edit') {
          this.handelOperOrg('edit');
        }
        if (this.operFormTitle === 'add') {
          this.handelOperOrg('add');
        }
      }

      this.mtiTreeLoading = false;
    },
    /**
     * @description: 清空地图上的图层和点位
     */
    removeMapAllInfo () {
      orgMapInstance.clearAllMark();
      orgMapInstance.clearAllLayer();
      orgMapInstance.infoWindow.close();
    },
    /**
     * @description: 加载地图上的图层和点位
     */
    loadMapInfo (data) {
      if (data.departLng && data.departLat) {
        if (this.operFormTitle === 'add') {
          orgMapInstance.addFirstMark([data.departLng, data.departLat]); // let lnglatXY = [lng, lat];
        } else {
          orgMapInstance.addFirstDraggableMark([data.departLng, data.departLat]);
        }
      }
      /** ---- 可能存在：两个图层(areaJsonUrl,departJsonUrl) ----- */
      if (data.areaJsonUrl) {
        orgMapInstance.initAreaLayer(data.areaJsonUrl, 'area');
      }
      if (data.departJsonUrl) {
        orgMapInstance.initAreaLayer(data.departJsonUrl, 'org');
      }
    },
    // 拖拽tree的节点
    handleNodeDrag (targetNodeData, destinationParentNodeData) {
      let data = {
        departId: targetNodeData.departId,
        departParentId: destinationParentNodeData.departId,
        sorted: 1
      };
      saveChangedOrgTree(data).then((res) => {
        if (res && res.data) {
          this.initTree();
          // this.$message({
          //   type: 'success',
          //   message: '拖拽数据保存成功!'
          // });
        } else {
          this.$message({
            type: 'error',
            message: res.message
          });
        }
      });
    },
    // 导出组织数据
    exportOrgData () {
      exportOrg({
        departParentId: this.currentDisplayOrgInfo.departId
      }).then((res) => {
        if (res) {
          releaseFileStream(res, this.currentDisplayOrgInfo.departFullName + '.xls');
        } else {
          this.$message({
            type: 'error',
            message: '导出失败!'
          });
        }
      });
    },
    handleSizeChange (val) {
      this.pageSize = val;
      this.initOrgListTable();
    },
    handleCurrentChange (val) {
      this.currentPage = val;
      this.initOrgListTable();
    },
    // 点击新增、编辑组织机构
    handelOperOrg (type) {
      this.operFormTitle = type;
      // 清空地图内容
      this.removeMapAllInfo();

      if (type === 'edit') {
        for (let item in this.ruleForm) {
          this.ruleForm[item] = this.currentDisplayOrgInfo[item];
        }
        this.lnglatXY = {
          lng: this.currentDisplayOrgInfo.departLng,
          lat: this.currentDisplayOrgInfo.departLat
        };

        this.loadMapInfo(this.currentDisplayOrgInfo);
        this.getAllAdminDiviData(this.ruleForm.areaCode);
      } else {
        this.ruleForm.departAddress = '';
        this.lnglatXY = {
          lng: '',
          lat: ''
        };
        this.ruleForm.departAddress = '';
        this.getAllAdminDiviData('');
      }
      this.operOrgFormVisible = true;
    },
    /**
     * @description: 删除组织机构(注：删除组织机构时判断其组织下面是否有子组织，如果有子组织不允许删除，反之直接删除)
     */
    deleteOrg () {
      if (!this.currentDisplayOrgInfo.departId) {
        return this.$message({
          type: 'error',
          message: '请选择需要删除的组织机构'
        });
      }
      this.$confirmOperation('此操作将永久删除该组织机构, 是否继续?', '删除提示')
        .then(() => {
          deleteOrg(this.currentDisplayOrgInfo.departId).then((res) => {
            if (res.code === '000000') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.loadBusSuperData();
              this.initTree();
              this.currentNodeKey = '';
            } else {
              this.$message({
                type: 'error',
                message: res.message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '已取消删除'
          });
        });
    },
    /**
     * @description 取消操作
     */
    cancelSave (formName) {
      this.loadBusSuperData();
      this.$refs[formName].resetFields();
      this.operOrgFormVisible = false;
      this.operFormTitle = 'add';
      this.initTree();
    },
    saveOrg (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.handleSaveOrgInfo(this.operFormTitle, formName);
        } else {
          this.$message({
            type: 'error',
            message: '组织信息未按规定录入'
          });
          return false;
        }
      });
    },
    /**
     * @description: 获取新增，编辑组织机构所传参数【编辑的时候如果departParentId为 -1 ，就不用传了】
     */
    getOperOrgParams () {
      let data = {
        departJsonUrl: this.departJsonUrl,
        departLat: this.lnglatXY.lat,
        departLng: this.lnglatXY.lng
      };
      // eslint-disable-next-line no-undef
      _.assign(data, this.ruleForm);
      if (this.ruleForm.departBizParentId !== '') {
        data.departBizParentId = this.ruleForm.departBizParentId;
      }
      if (this.operFormTitle === 'add') {
        data.enabled = 1;
        data.departParentId = this.currentDisplayOrgInfo.departId ? this.currentDisplayOrgInfo.departId : -1;
      } else {
        data.departId = this.currentDisplayOrgInfo.departId;
      }
      return data;
    },
    /**
     * @description:保存新增(注：现根据需求只给观山湖分局下面新增组织机构)、编辑内容
     */
    handleSaveOrgInfo (type, formName) {
      if (type === 'add') {
        let data = this.getOperOrgParams();
        addOrg(data).then((res) => {
          if (res && res.data) {
            this.$message({
              type: 'success',
              message: '新增成功'
            });
            this.loadBusSuperData();
            let timer = setTimeout(() => {
              this.$refs[formName].resetFields();
              this.operOrgFormVisible = false;
              this.initTree();
              this.currentNodeKey = res.data.departId;
              if (timer) {
                clearTimeout(timer);
              }
            }, 1000);
          } else {
            this.$message({
              type: 'error',
              message: res.message
            });
          }
        });
      } else {
        let data = this.getOperOrgParams();
        editOrg(data).then((res) => {
          if (res && res.data) {
            this.$message({
              type: 'success',
              message: '编辑成功'
            });
            this.loadBusSuperData();
            let timer = setTimeout(() => {
              this.$refs[formName].resetFields();
              this.operOrgFormVisible = false;
              this.operFormTitle = 'add';
              this.initTree();
              this.currentNodeKey = this.currentDisplayOrgInfo.departId;
              if (timer) {
                clearTimeout(timer);
              }
            }, 1000);
          } else {
            this.$message({
              type: 'error',
              message: res.message
            });
          }
        });
      }
    },
    // 获取所有行政区划内容
    getAllAdminDiviData (query) {
      this.adminDiviLoading = true;
      getAdmDivTableData({
        queryKey: query,
        currentPage: 1,
        pageSize: 30
      }).then((res) => {
        if (res && res.data) {
          this.adminDiviLoading = false;
          this.allAdminDiviData = res.data.list.filter((item) => {
            // 用行政区划简称查
            return item.areaName.indexOf(query) > -1 || item.areaFullName.indexOf(query) > -1 || item.areaCode.indexOf(query) > -1;
          });
        } else {
          this.allAdminDiviData = [];
        }
      });
    },
    // 选择联想匹配的行政区划
    handleAdminDiviSelect (selectedAreaCode) {
      let selectedArea = this.allAdminDiviData.find((item) => {
        return item.areaCode === selectedAreaCode;
      });
      orgMapInstance.clearAreaAllLayer();
      if (selectedArea && selectedArea.areaJsonUrl) {
        orgMapInstance.initAreaLayer(selectedArea.areaJsonUrl, 'area');
      }
    },
    // 地址栏没有地址，移除地图上的点
    clearAddress (value) {
      if (value === '') {
        orgMapInstance.clearAllMark();
        orgMapInstance.infoWindow.close();
      }
    },
    // 表格数据匹配字典
    matchDict (dictList, row) {
      let arr = dictList.filter((item, index) => {
        return item.value === row.areaLevel;
      });
      if (arr.length > 0) {
        return arr[0].label;
      } else {
        return '';
      }
    },
    selectCityChange (codeArr) {
      let cityStr = '';
      for (let item of codeArr) {
        cityStr += CodeToText[item];
      }
      this.ruleForm.departAddress = cityStr;
    },
    // 处理手机串号
    handleDepartImei (str) {
      if (str !== null && str !== '') {
        return str.split(',');
      } else {
        return [];
      }
    },
    // 上传行政区划Json 文件
    uploadAreaJsonFile (f) {
      uploadFile(this.fileServerUrl, f.file).then((res) => {
        if (res && res.data) {
          this.departJsonUrl = res.data.path;
          orgMapInstance.initAreaLayer(this.departJsonUrl, 'org');
          this.$message({
            type: 'success',
            message: '组织机构区域图层上传成功!'
          });
        } else {
          this.$message({
            type: 'error',
            message: '组织机构区域图层上传失败!'
          });
        }
      });
    },
    // 过滤查询业务上级数据
    async getAllSuperiorData (queryKey) {
      this.allBusSuperiorData = [];
      this.allBusSuperiorDataDict = {};
      this.superiorLoading = true;
      getAllSuperDepartData({
        queryKey
      }).then((res) => {
        if (res && res.data) {
          this.allBusSuperiorData = res.data.filter((item) => {
            return item.departName.indexOf(queryKey) > -1 || item.departCode.indexOf(queryKey) > -1;
          });
          for (let item of this.allBusSuperiorData) {
            this.allBusSuperiorDataDict[item.departCode] = item.departFullName;
          }
          this.superiorLoading = false;
        }
      });
    },
    async getAllBusSuperiorData (queryKey = '') {
      let params = {
        queryKey
      };
      let superiorData = [];
      const [err, res] = await asyncFn(getAllSuperDepartData(params));
      if (res && res.data) {
        superiorData = res.data;
      }
      if (err) {
        superiorData = [];
      }
      return superiorData;
    },
    /***
     * @description: 请求系统所有业务上级数据
     */
    async loadBusSuperData () {
      this.allBusSuperiorData = await this.getAllBusSuperiorData();
      for (let item of this.allBusSuperiorData) {
        this.allBusSuperiorDataDict[item.departCode] = item.departFullName;
      }
    },
    /**
     * @description - 获取详细地址【编辑、新增组织操作时】
     */
    getPointAddress (address, lnglatXY) {
      this.ruleForm.departAddress = address;
      this.lnglatXY = {
        lng: lnglatXY[0],
        lat: lnglatXY[1]
      };
    },
    importSuccess () {
      this.dataImportVisible = false;
      this.loadBusSuperData();
      this.initTree();
    },
    closeImportDialog () {
      this.dataImportVisible = false;
      this.loadBusSuperData();
      this.operFormTitle = 'add';
      this.initTree();
    },
    /***
     * @description 查询参数置为初始值
     */
    queryConditionInit () {
      this.currentPage = 1;
      this.pageSize = 4;
      this.total = 0;
    },
    // 新增组织机构成功
    addOrgNatureSuccess () {
      this.adddepartNatureVisible = false;
      this.departNatureGroup = []; // 组织性质下拉菜单
      this.departNatureDict = {};// 组织性质字典
      getDepartTypeDictData('DEPART_NATURE', this.departNatureGroup, this.departNatureDict);
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/base.scss';
.main-container {
  @include flex(row);
  .left-panel {
    .tree-panel {
      display: flex;
      flex-flow: column wrap;
      min-height: 130px;
    }
    .tree {
      flex: 1;
    }
    .action-btn-group {
      height: 82px;
      width: 100%;
      @include flex(row);
      justify-content: space-around;
      align-items: center;
      font-size: 16px;
      color: #ffffff;
      .customize-icon import-icon,
      .customize-icon export-icon {
        background-size: 100% 100%;
        width: 20px;
        height: 18px;
        margin-bottom: -4px;
      }
    }
  }
  .right-panel {
    .point-icon {
      cursor: pointer;
      background: url('#{$imgUrl}/point.png') no-repeat;
    }
    .content-panel {
      .org-det-container {
        height: calc(100% - 34px);
        overflow-y: auto;
        overflow-x: hidden;
        margin-top: 20px;
      }
      .top-det {
        box-sizing: border-box;
        @include flex(row);
      }
      .max-width {
        max-width: 288px;
      }
      // 机构详情表格
      .det-tb {
        width: 654px;
        height: 449px;
        border-collapse: collapse;
        border: none;
        border-spacing: 0;
        td {
          border: 1px solid#DDDDDD;
          padding: 0 18px;
          @include sc(18px, #333333);
        }
        .tipPanel {
          position: absolute;
          left: 108px;
          top: 52px;
          width: 177px;
          height: 226px;
          border-radius: 4px;
          background-color: rgba(248, 248, 248, 1);
          border: 1px solid #dddddd;
          padding: 20px;
          box-sizing: border-box;
          > :before,
          > :after {
            content: '';
            display: block;
            border-width: 15px;
            position: absolute;
            top: -30px;
            left: 28px;
            border-style: solid dashed dashed solid;
            border-color: transparent transparent #dddddd transparent;
            font-size: 0;
            line-height: 0;
          }
          > :after {
            top: -29px;
            border-color: transparent transparent rgba(248, 248, 248, 1)
              transparent;
          }
          ul {
            overflow-y: auto;
            height: 100%;
          }
          li {
            line-height: 30px;
            width: 100%;
          }
        }
      }
      // 机构操作表单
      .action-org-form {
        width: 654px;
        height: 508px;
      }
      .map-wrapper {
        margin-left: 28px;
        flex: 1;
        height: 508px;
        position: relative;
      }
      .loading-img {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        display: block;
        width: 150px;
        height: 150px;
      }
      #map_container {
        width: 100%;
        height: 100%;
      }
      // 操作按钮
      .btn-group {
        transition: 0.2s height linear;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        .btn {
          width: 150px;
          height: 42px;
        }
      }

      // 下级组织内容
      .bottom-tb {
        .title-panel {
          line-height: 48px;
          height: 48px;
          background-color: #ffffff;
          border-bottom: 2px solid #dedede;
          @include sc(18px, #333333);
          .subordinate-icon {
            background: url('#{$imgUrl}/tree.png') no-repeat;
          }
        }

        .next-det {
          padding: 12px 0 0;
          box-sizing: border-box;
          font-size: 16px !important;
          .el-page {
            text-align: right;
            font-size: 18px !important;
            margin-right: 18px;
          }
          .next-tb {
            margin-top: 14px;
            font-size: 16px;
          }
        }
      }
    }
  }
}

#add-departNature-btn {
  height: 42px;
  font-size: 18px;
  background-color: #eea236;
  text-indent: 1em;
  line-height: 42px;
  color: #fff;
  margin-bottom: -4px;
  cursor: pointer;
  border-radius: 0 0 4px 4px;
}
.ell1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
