/*
* @Author: liuhuitao
* @Date: 2019-08-08 16:52:33
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-10-25 10:00:10
*/
<template>
  <div>
    <div class="main-container">
      <!-- 左侧 -->
      <div class="left-panel">
        <div class="l-title-bar">
          <span> <i class="customize-icon org-icon"></i> 行政区划 </span>
        </div>
        <!-- 左侧查询树 -->
        <div class="tree-panel">
          <mti-tree
            :refName="'areaTree'"
            :tree-list="treeList"
            :search="treeConfig.search"
            :drag="treeConfig.drag"
            :check="treeConfig.check"
            :lazy="treeConfig.lazy"
            @load-tree-data="loadTreeData"
            :currentNodekey="currentNodekey"
            :expandedkeys="expandedkeys"
            :isDefaultExpandAll='false'
            :operate="treeConfig.operate"
            :defaultProps="{children: 'children',label: 'areaName',isLeaf: 'leaf'}"
            :icon="true"
            :is-admin="true"
            :node-key="'areaId'"
            @onNodeClick="handleNodeClick"
            @onNodeDrag="handleNodeDrag"
          ></mti-tree>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="right-panel">
        <div class="r-title-bar">
          <span> <i class="customize-icon list-icon"></i> 行政区划 </span>
          <span v-has="permisBtnIdSetting.add">
            <i
              class="customize-icon add-icon"
              @click="handeleAdd"
            ></i>
          </span>
        </div>
        <!-- 右侧 -->
        <div class="content-panel">
          <!-- 下级组织内容 -->
          <div class="bottom-tb">
            <div
              class="search-from"
              style="width: 257px; position:relative;"
            >
              <el-input
                v-model="queryKey"
                placeholder="请输入内容"
                @keyup.enter.native="handleBtnSearch"
              > </el-input>
              <i
                class="search-icon"
                @click="handleBtnSearch"
                style="position:absolute;right:10px;top:10px;z-index:10"
              ></i>
            </div>
            <div class="det-tb">
              <el-table
                :header-row-style="{ color: '#333333' }"
                :header-cell-style="{ backgroundColor: '#F8F8F8' }"
                stripe
                :data="tableData"
                border
                style="width: 100%;"
                height="100%"
                v-loading="loading"
              >
                <el-table-column
                  type="index"
                  width="80"
                  label="序号"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="areaCode"
                  label="行政编码"
                  width="108"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="areaFullName"
                  label="名称"
                  width="178"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="areaName"
                  label="简称"
                  width="148"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="areaLevel"
                  label="区域等级"
                  align="center"
                  width="148"
                >
                  <template slot-scope="scope">
                    <div>
                      {{regionalLevelDict[scope.row.areaLevel]}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="areaJsonUrl"
                  label="配置范围"
                  align="center"
                ></el-table-column>
                <el-table-column
                  label="操作"
                  align="center"
                  width="150"
                  v-if="this.$isHasBtnId(permisBtnIdSetting.edit) || this.$isHasBtnId(permisBtnIdSetting.del)"
                >
                  <template slot-scope="scope">
                    <div
                      class="operation-setting-panel"
                      style="line-height:28px;display:flex;justify-content:space-around;"
                    >
                      <el-tooltip
                        class="item"
                        effect="light"
                        content="编辑"
                        placement="top"
                      >
                        <i
                          class="customize-icon data-edit-icon"
                          @click="handleEdit(scope.$index, scope.row)"
                          v-has="permisBtnIdSetting.edit"
                        ></i>
                      </el-tooltip>
                      <el-tooltip
                        class="item"
                        effect="light"
                        content="删除"
                        placement="top"
                      >
                        <i
                          class="customize-icon data-delete-icon"
                          v-has="permisBtnIdSetting.del"
                          @click="handleDelete(scope.$index, scope.row)"
                        ></i>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-pagination
              class="el-page"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 40, 60, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增，编辑行政区划弹框 -->
    <mti-dialog
      :show.sync="operAdmDivVisible"
      :width="'660px'"
      :title="dialogTitle + '行政区划'"
      @close-dialog="operAdmDivVisible = false"
    >
      <oper-admDivision
        v-if="operAdmDivVisible"
        :rowData="rowData"
        :regionalLevelGroup="regionalLevelGroup"
        :parent-id="currentCheckedAdmDiv.areaId"
        @close-dialog="operAdmDivVisible = false"
        @oper-success="operSuccess"
      ></oper-admDivision>
    </mti-dialog>
  </div>
</template>

<script>
import mtiTree from '@/components/tree';
import mtiDialog from '@/components/dialog';
import { getAdmDivTreeData, getAdmDivTableData, deleteAdmDiv, saveChangedAreaTree } from '@/api/orgConfiguration';
import { getDepartTypeDictData } from '@/assets/js/common/dictionary';
import operAdmDivision from '@/views/orgConfiguration/organizational/administrativeDivision/operAdmDivision.vue';

export default {
  name: 'orgManage',
  props: {},
  components: {
    mtiTree,
    mtiDialog,
    operAdmDivision
  },
  data () {
    return {
      permisBtnIdSetting: this.$permisBtnIdSetting['adminDiv'], // 权限按钮Id
      // 组织机构树
      treeList: [],
      treeConfig: {
        search: false,
        check: false,
        drag: true,
        operate: false,
        lazy: true
      },
      expandedkeys: [],
      currentNodekey: '',
      currentCheckedAdmDiv: {},
      treeNode: null,
      treeResolve: null,
      // 表格
      queryKey: '',
      currentPage: 1,
      pageSize: 10,
      loading: true,
      tableData: [],
      total: 0,
      isVisible: false, // 控制操作表单显隐
      // 弹框
      operAdmDivVisible: false,
      dialogTitle: '',
      rowData: {},
      regionalLevelGroup: [],
      regionalLevelDict: {} // 区域等级字典
    };
  },
  watch: {},
  computed: {},
  created () {
    getDepartTypeDictData('AREA_LEVEL', this.regionalLevelGroup, this.regionalLevelDict);
  },
  mounted () { },
  destroyed () { },
  methods: {
    // 新增或编辑成功后
    operSuccess () {
      this.operAdmDivVisible = false;
      this.initTree();
    },
    // 初始化选择树
    initTree () {
      this.treeNode.childNodes = [];
      this.loadTreeData(this.treeNode, this.treeResolve);
      this.$children['0'].loading = false;
    },
    getAreaTreeData (node, resolve, parentId) {
      getAdmDivTreeData({
        parentId // 上一级的父ID
      }).then((res) => {
        if (res && res.data) {
          let data = res.data;
          if (data.length === 0) {
            return;
          }
          resolve(data);
          // 加载根目录下的表格数据
          if (node.level === 0) {
            // eslint-disable-next-line no-undef
            _.assign(this.currentCheckedAdmDiv, data);
            this.initTable();
          }
          // if (node.level === 0) {
          //   let _this = this;
          //   let timer = setInterval(function () {
          //     if (timer && document.querySelector('.mti-tree .el-tree-node>.el-tree-node__content')) {
          //       clearInterval(timer);
          //       _this.trigger(document.querySelector('.mti-tree .el-tree-node>.el-tree-node__content'));
          //     }
          //   }, 500);
          //   // _this.treeNode.childNodes[0].expanded = true;
          // }
        }
      });
    },
    // 异步加载数据
    loadTreeData (node, resolve) {
      // this.$children['0'].loading = true;
      resolve([]);
      if (node.level === 0) {
        this.treeResolve = resolve;
        this.treeNode = node;
        this.getAreaTreeData(node, resolve);
      }
      if (node.level >= 1) {
        this.getAreaTreeData(node, resolve, node.data.areaId);
      }
    },
    // dom点击事件
    trigger (el) {
      // IE
      if (document.all) {
        el.click();
      } else { // 其它浏览器
        let e = document.createEvent('MouseEvents');
        e.initEvent('click', true, true);// 这里的click可以换成你想触发的行为
        el.dispatchEvent(e);// 这里的clickME可以换成你想触发行为的DOM结点
      }
    },
    // 获取表格数据
    initTable () {
      this.loading = true;
      this.tableData = [];
      if (this.currentCheckedAdmDiv === {}) {
        return this.$message({
          type: 'error',
          message: '请选择行政区划树!'
        });
      }
      getAdmDivTableData({
        parentId: this.currentCheckedAdmDiv.areaId,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        queryKey: this.queryKey
      }).then((res) => {
        if (res && res.data) {
          this.tableData = res.data.list;
          this.total = res.data.totalCount;
          this.loading = false;
        }
      });
    },
    // 点击tree的节点
    handleNodeClick (data, node, el) {
      this.$children['0'].loading = false;
      this.queryConditionInit();
      // eslint-disable-next-line no-undef
      _.assign(this.currentCheckedAdmDiv, data);
      // console.log(this.currentCheckedAdmDiv);
      this.initTable();
    },
    // 拖拽tree的节点
    handleNodeDrag (targetNodeData, destinationParentNodeData) {
      let data = {
        areaId: targetNodeData.areaId,
        parentId: destinationParentNodeData.areaId
      };
      saveChangedAreaTree(data).then((res) => {
        if (res && res.data) {
          this.initTree();
        } else {
          this.$message({
            type: 'error',
            message: res.message
          });
        }
      });
    },
    handeleAdd () {
      this.dialogTitle = '新增';
      this.rowData = {};
      this.operAdmDivVisible = true;
    },
    handleEdit (index, row) {
      this.dialogTitle = '编辑';
      this.rowData = row;
      this.operAdmDivVisible = true;
    },
    handleDelete (index, row) {
      this.$confirmOperation('此操作将永久删除此行政区划信息, 是否继续?', '删除提示')
        .then(() => {
          deleteAdmDiv(row.areaId).then((res) => {
            if (res && res.data === true) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.initTree();
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
    handleSizeChange (val) {
      this.pageSize = val;
      this.initTable();
    },
    handleCurrentChange (val) {
      this.currentPage = val;
      this.initTable();
    },
    handleBtnSearch () {
      this.currentPage = 1;
      this.pageSize = 10;
      this.total = 0;
      this.initTable();
    },
    /***
     * @description 查询参数置为初始值
     */
    queryConditionInit () {
      this.queryKey = '';
      this.currentPage = 1;
      this.pageSize = 10;
      this.total = 0;
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/base.scss';
.content-panel {
  .bottom-tb {
    display: flex;
    flex-flow: column wrap;
    height: 100%;
  }
  .search-from {
    margin: 22px 0;
    width: 100%;
  }
  .det-tb {
    flex: 1;
    overflow-y: auto;
    width: 100%;
  }
  .el-page {
    margin: 22px 0;
    text-align: right;
  }
}
</style>
