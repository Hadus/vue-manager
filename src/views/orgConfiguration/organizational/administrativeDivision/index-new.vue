/*
* @Author: liuhuitao
* @Date: 2019-08-08 16:52:33
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-10-25 09:30:44
 * @description: 行政区划管理
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
            :refName="'mtiTree'"
            :tree-list="treeList"
            :search="treeConfig.search"
            :drag="treeConfig.drag"
            :check="treeConfig.check"
            :currentNodeKey="currentNodeKey"
            :defaultExpandedKeys="defaultExpandedKeys"
            :operate="treeConfig.operate"
            :defaultProps="{children: 'children',label: 'areaName'}"
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
import { _listToTree } from '@/utils/mtiUtils';
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
      requireTreeData: [],
      treeConfig: {
        search: false,
        check: false,
        drag: true,
        operate: false
      },
      defaultExpandedKeys: [],
      currentNodeKey: '',
      currentCheckedAdmDiv: {},
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
    this.initTree();
    getDepartTypeDictData('AREA_LEVEL', this.regionalLevelGroup, this.regionalLevelDict);
  },
  mounted () { },
  destroyed () { },
  methods: {
    // 新增或编辑成功后
    operSuccess (pId, id) {
      this.operAdmDivVisible = false;
      this.refreshTreeNode(pId, id);
    },
    // 初始化选择树
    initTree (parentId, nodeId) {
      this.treeList = [];
      if (!parentId) {
        this.requireTreeData = [];
      }
      getAdmDivTreeData({
        parentId // 上一级的父ID
      }).then((res) => {
        if (res && res.data) {
          let data = res.data;
          if (data.length === 0) {
            return;
          }
          for (let item of data) {
            if (!this.isHasEle(this.requireTreeData, item)) {
              this.requireTreeData.push(item);
            }
          }
          this.treeList = _listToTree(this.requireTreeData, {
            rootId: -1,
            pidname: 'parentId',
            cidname: 'areaId'
          }, {});
          // if (!parentId) {
          this.queryConditionInit();
          // 新增、编辑（展示修改的对象下面的内容）
          if (nodeId && parentId) {
            for (let item of data) {
              if (item.areaId === nodeId) {
                // eslint-disable-next-line no-undef
                _.assign(this.currentCheckedAdmDiv, item);
              }
            }
          }
          // 删除（展示被删除对象平级的其他内容）与点击树节点节点
          if (!nodeId && parentId) {
            for (let item of this.requireTreeData) {
              if (item.areaId === parentId) {
                // eslint-disable-next-line no-undef
                _.assign(this.currentCheckedAdmDiv, item);
              }
            }
          }
          // 首次加载
          if (!parentId && !nodeId) {
            // eslint-disable-next-line no-undef
            _.assign(this.currentCheckedAdmDiv, this.treeList[0]);
            this.initTree(this.treeList[0].areaId);
          }
          console.log('刷新：' + this.currentCheckedAdmDiv.areaName);
          this.initTable();
        }
      });
    },
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
      if (!node) return;
      if (!data.leaf && node.childNodes.length === 0) {
        this.currentNodeKey = data.areaId;
        this.initTree(data.areaId);
      } else {
        this.queryConditionInit();
        // eslint-disable-next-line no-undef
        _.assign(this.currentCheckedAdmDiv, data);
        console.log('未刷新：' + this.currentCheckedAdmDiv.areaName);
        this.initTable();
      }
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
              this.refreshTreeNode(row.parentId);
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
    },
    // 数组是否包含某对象
    isHasEle (arr, obj) {
      return arr.some(function (o) {
        return o.areaCode === obj.areaCode;
      });
    },
    // 刷新指定节点数据
    refreshTreeNode (updateId, hightlightNodeId) {
      hightlightNodeId ? this.currentNodeKey = hightlightNodeId : this.currentNodeKey = updateId;
      // 将被删除数据平级的数据全部删除，再请求获取新的数据
      for (let item of this.requireTreeData) {
        if (item.parentId === updateId) {
          this.requireTreeData.splice(this.requireTreeData.indexOf(item), 1);
        }
      }
      this.initTree(updateId, hightlightNodeId);
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
