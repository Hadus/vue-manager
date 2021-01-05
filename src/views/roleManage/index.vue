/*
* @Author: liuhuitao
* @Date: 2019-08-12 10:51:57
 * @Last Modified by: liuhuitaoo
 * @Last Modified time: 2019-09-02 14:40:255
* @description: 角色管理
*/
<template>
  <div>
    <div class="main-container">
      <!-- 左侧 -->
      <div class="left-panel">
        <div class="l-title-bar">
          <span> <i class="customize-icon org-icon"></i> 应用系统列表 </span>
        </div>
        <div class="tree-panel">
          <table
            class="system-tb"
            cellspacing="0"
            cellpadding="0"
            style="width:100%"
          >
            <thead>
              <tr>
                <th class="tt">应用系统名称</th>
              </tr>
            </thead>
            <tbody v-loading="sysLoading">
              <tr
                v-for="(item,index) in sysAppList"
                :class="selectedSysApp === item.appId?'active-tr':''"
                :key="index"
                @click="sysAppChange(item.appId)"
              >
                <td
                  class="hover-animate"
                  :title="item.appName"
                >
                  {{item.appName}}
                </td>
              </tr>
              <tr v-if="sysAppList.length === 0">
                <td colspan="2">应用系统为空...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="right-panel">
        <div class="r-title-bar">
          <span> <i class="customize-icon list-icon"></i> 角色列表 </span>
          <span @click="handeleAdd">
            <i class="customize-icon add-icon"></i>
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
                v-model="roleName"
                @keyup.enter.native="initRoleTb"
                placeholder="请输入内容"
              > </el-input>
              <i
                class="search-icon"
                @click="initRoleTb"
                style="position:absolute;right:10px;top:10px;z-index:10"
              ></i>
            </div>
            <div class="det-tb">
              <el-table
                id="common-tb"
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
                  prop="roleName"
                  label="角色名称"
                  width="178"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="roleDesc"
                  label="描述"
                ></el-table-column>
                <el-table-column
                  prop="date"
                  label="状态"
                  width="120"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-switch
                      :active-value="1"
                      :inactive-value="0"
                      v-model="scope.row.enabled"
                      :disabled="!($isHasBtnId(permisBtnIdSetting.forbidRole)&&scope.row.roleId>1000)"
                      @change="changeRoleStatus(scope.$index, scope.row,scope.row.enabled)"
                    ></el-switch>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="200"
                  align="center"
                  v-if="this.$isHasBtnId(permisBtnIdSetting.edit) || this.$isHasBtnId(permisBtnIdSetting.del) || this.$isHasBtnId(permisBtnIdSetting.assignPermission)"
                >
                  <template slot-scope="scope">
                    <div
                      class="action-icon-group operation-setting-panel"
                      style="line-height:28px;"
                    >
                      <el-tooltip
                        effect="light"
                        content="编辑"
                        placement="top"
                      >
                        <i
                          :class="[scope.row.roleId<1000?'btn-disabled':'','customize-icon','data-edit-icon']"
                          v-has="permisBtnIdSetting.edit"
                          @click="handleEdit(scope.$index, scope.row)"
                        ></i>
                      </el-tooltip>
                      <el-tooltip
                        effect="light"
                        content="分配权限"
                        placement="top"
                      >
                        <i
                          :class="[scope.row.roleId<1000?'btn-disabled':'','customize-icon','permission-icon']"
                          v-has="permisBtnIdSetting.assignPermission"
                          @click="handlePermission(scope.$index, scope.row)"
                        ></i>
                      </el-tooltip>
                      <el-tooltip
                        effect="light"
                        content="删除"
                        placement="top"
                      >
                        <i
                          :class="[scope.row.roleId<1000?'btn-disabled':'','customize-icon','data-delete-icon']"
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
    <!-- 新增行政区划弹框 -->
    <mti-dialog
      :show.sync="operRoleVisible"
      :width="'660px'"
      :title="dialogTitle + '角色'"
      @close-dialog="operRoleVisible = false"
    >
      <oper-role
        v-if="operRoleVisible"
        :rowData="rowData"
        :selectedSysApp="selectedSysApp"
        @oper-success="operSuccess"
        @close-dialog="operRoleVisible = false"
      ></oper-role>
    </mti-dialog>
    <!-- 设置权限菜单弹框 -->
    <mti-dialog
      :show.sync="assignPermDialogVisible"
      :width="'660px'"
      :title="'功能菜单权限'"
      @close-dialog="assignPermDialogVisible = false"
    >
      <assign-permissions
        v-if="assignPermDialogVisible"
        :rowData="rowData"
        @assign-success="assignPermDialogVisible = false"
        @close-dialog="assignPermDialogVisible = false"
        :selectedSysApp="selectedSysApp"
      ></assign-permissions>
    </mti-dialog>
  </div>
</template>

<script>
import mtiDialog from '@/components/dialog';
import operRole from '@/views/roleManage/operRole.vue';
import assignPermissions from '@/views/roleManage/assignPermissions.vue';
import { getRoleData, deleteRole, editRole } from '@/api/role';
import { getAppListData } from '@/api/app';

export default {
  name: 'roleManage',
  props: {},
  components: {
    mtiDialog,
    operRole,
    assignPermissions
  },
  data () {
    return {
      permisBtnIdSetting: this.$permisBtnIdSetting['roleManage'], // 权限按钮Id
      sysAppList: [],
      sysLoading: true,
      selectedSysApp: -1, // 已选择的系统应用(number)
      roleName: '', // 绑定角色名称查询搜索框
      currentPage: 1,
      pageSize: 10,
      loading: true,
      tableData: [],
      total: 0,
      operRoleVisible: false, // 操作(add,edit)角色弹框显隐
      dialogTitle: '',
      assignPermDialogVisible: false, // 分配权限弹框显隐

      rowData: {} // 待修改的内容
    };
  },
  watch: {},
  computed: {},
  created () {
    this.initAppList();
  },
  mounted () { },
  destroyed () { },
  methods: {
    // 初始化系统应用数据
    initAppList () {
      this.sysLoading = true;
      getAppListData({
        appLoginEndpoint: 'WEB'
      }).then((res) => {
        if (res && res.data) {
          this.sysAppList = res.data;
          // 默认选择第一项
          if (this.sysAppList.length > 0) {
            this.selectedSysApp = this.sysAppList[0].appId;
          }
          this.sysLoading = false;
          this.initRoleTb();
        } else {
          this.sysLoading = false;
        }
      });
    },
    // 初始化当前选择系统下的角色表格
    initRoleTb () {
      this.tableData = [];
      this.loading = true;
      if (this.selectedSysApp === -1) {
        this.loading = false;
        return this.$message({
          type: 'error',
          message: '请选择应用系统!'
        });
      }
      let data = {
        roleTypeValue: this.selectedSysApp,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      };
      if (this.roleName !== '') {
        data.roleName = this.roleName;
      }
      getRoleData(data).then((res) => {
        if (res && res.data) {
          this.tableData = res.data.list;
          this.total = res.data.totalCount;
        }
        this.loading = false;
      });
    },
    // 改变系统应用
    sysAppChange (appId) {
      if (this.selectedSysApp === appId) return;
      this.selectedSysApp = appId;
      this.currentPage = 1;
      this.initRoleTb();
    },
    handeleAdd () {
      if (this.selectedSysApp === -1) {
        return this.$message({
          type: 'error',
          message: '请选择待添加的应用系统!'
        });
      }
      this.rowData = {};
      this.dialogTitle = '新增';
      this.operRoleVisible = true;
    },
    handlePermission (index, row) {
      if (row.roleId < 1000) {
        return this.$message({
          type: 'error',
          message: '无法操作系统默认数据!'
        });
      }
      this.rowData = row;
      this.assignPermDialogVisible = true;
    },
    handleEdit (index, row) {
      if (row.roleId < 1000) {
        return this.$message({
          type: 'error',
          message: '无法操作系统默认数据!'
        });
      }
      this.dialogTitle = '编辑';
      this.rowData = row;
      this.operRoleVisible = true;
    },
    handleDelete (index, row) {
      if (row.roleId < 1000) {
        return this.$message({
          type: 'error',
          message: '无法操作系统默认数据!'
        });
      }
      this.$confirmOperation('此操作将永久删除该角色, 是否继续?', '删除提示')
        .then(() => {
          deleteRole({ id: row.roleId }).then((res) => {
            if (res && res.data) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.initRoleTb();
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
      this.initRoleTb();
    },
    handleCurrentChange (val) {
      this.currentPage = val;
      this.initRoleTb();
    },
    changeRoleStatus (index, row, value) {
      editRole({
        roleId: row.roleId,
        roleName: row.roleName,
        roleTypeValue: this.selectedSysApp,
        roleType: 1, // 角色类型  1:应用角色  2:部门角色
        enabled: value// 是否可用 1:可用  0:不可用
      }).then((res) => {
        if (res && res.data) {
          this.$message({
            type: 'success',
            message: '编辑成功!'
          });
          let timer = setTimeout(() => {
            this.$emit('oper-success');
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
    },
    // 新增或编辑成功后
    operSuccess () {
      this.operRoleVisible = false;
      this.initRoleTb();
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/base.scss';
.tree-panel {
  box-sizing: border-box;
}
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
    .action-icon-group {
      @include flex(row);
      justify-content: space-around;
      align-items: center;
      min-height: 28px;
    }
  }
  .el-page {
    margin: 22px 0;
    text-align: right;
  }
}
// 系统列表表格
.system-tb {
  border-collapse: collapse;
  border: none;
  border-spacing: 0;
  display: block;
  height: 100%;
  .tt {
    font-weight: bold;
  }
  td,
  th {
    border: 1px solid#DDDDDD;
    @include sc(16px, #333333);
    text-align: center;
    height: 44px;
    line-height: 44px;
  }
  thead {
    display: block;
  }
  tbody {
    overflow-y: auto;
    overflow-x: hidden;
    display: block;
    height: calc(100% - 44px);
    tr {
      cursor: pointer;
      margin-top: -1px;
    }
  }
  tr {
    width: 100%;
    display: block;
    transition: 0.3s background-color linear;
    td {
      display: block;
      padding: 0 5px;
      transition: 0.3s color, font-size linear;
    }
    .hover-animate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    th {
      display: block;
    }
  }
  tr:nth-child(odd) {
    background: #f8f8f8;
  }
  .active-tr {
    background-color: #bee4fe !important;
    td {
      font-size: 16px;
      color: rgb(102, 177, 255) !important;
    }
  }
}
.btn-disabled {
  pointer-events: none;
  cursor: default;
  opacity: 0.6;
}
</style>
