/*
* @Author: liuhuitao
* @Date: 2019-08-12 10:16:41
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-10-25 09:33:24
* @description: 账户管理
*/
<template>
  <div>
    <div class="main-container account-panel">
      <!-- 左侧 -->
      <div class="left-panel">
        <div class="l-title-bar">
          <span> <i class="customize-icon org-icon"></i> 组织架构 </span>
        </div>
        <!-- 左侧查询树 -->
        <div class="tree-panel">
          <mti-tree
            :refName="'mtiTree'"
            :tree-list="treeList"
            :search="treeConfig.search"
            :drag="treeConfig.drag"
            :check="treeConfig.check"
            :isShowDisableMark="treeConfig.isShowDisableMark"
            :currentNodekey="currentNodekey"
            :expandedkeys="expandedkeys"
            :operate="treeConfig.operate"
            :defaultProps="{children: 'children',label: 'departFullName'}"
            :icon="true"
            :is-admin="false"
            node-key="departId"
            @onNodeClick="handleNodeClick"
            @onNodeDrag="handleNodeDrag"
          ></mti-tree>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="right-panel">
        <div class="r-title-bar">
          <span> <i class="customize-icon list-icon"></i> 账户详情 </span>
          <span
            @click="handeleAdd"
            v-show="treeList.length !==0"
            v-has="permisBtnIdSetting.add"
          >
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
            <div class="search-from">
              <el-input
                v-model="queryKey"
                placeholder="请输入内容"
                style="width:276px;"
              > </el-input>
              <div>
                所属应用：<el-select
                  v-model="slctSys"
                  placeholder="请选择"
                  style="width:276px;"
                >
                  <el-option
                    label="所有系统"
                    value=""
                  >
                  </el-option>
                  <el-option
                    v-for="item in slctSysOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-button
                  @click="handelBtnSearch"
                  type="primary"
                  style="width:110px; height:42px;margin-left:24px;"
                ><i
                    class="customize-icon btn-search-icon"
                    style="color:#ffffff;"
                  ></i> 查询</el-button>
              </div>
            </div>
            <div class="det-tb account-manage-table">
              <el-table
                :header-row-style="{ color: '#333333' }"
                :header-cell-style="{ backgroundColor: '#F8F8F8' }"
                stripe
                highlight-current-row
                :data="tableData"
                border
                style="width: 100%;font-size:18px;"
                height="100%"
                v-loading="loading"
              >
                <!-- :row-key="rowKey"
              :expand-row-keys="expandRowKeys" -->
                <el-table-column
                  type="index"
                  width="80"
                  label="序号"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="userName"
                  label="用户名"
                  width="130"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="userRealName"
                  label="姓名"
                  width="130"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="userPhone"
                  label="手机号"
                  width="168"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="roles"
                  label="所属应用"
                  align="center"
                  width="360"
                >
                  <template slot-scope="scope">
                    <ul>
                      <li
                        v-for="(trItem, trIndex) in scope.row.roles"
                        :key="trIndex"
                        :ref="'sys'+trIndex"
                        class="item-system"
                        :style="{borderTop: trIndex === 0 ? '' : '1px solid #EBEEF5'}"
                      >
                        {{ trItem.appName }}
                      </li>
                    </ul>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="roles"
                  label="角色"
                  align="center"
                  width="360"
                >
                  <template slot-scope="scope">
                    <ul>
                      <li
                        v-for="(trItem, trIndex) in scope.row.roles"
                        :key="trIndex"
                        :ref="'role'+trIndex"
                        :style="{borderTop: trIndex === 0 ? '' : '1px solid #EBEEF5'}"
                        class="item-role"
                      >
                        <!-- <span
                          v-for="(tdItem, tdIndex) in trItem.roleNames"
                          :key="tdIndex"
                        >{{ tdItem}}<em v-if="tdIndex < trItem.roleNames.length - 1">，</em></span> -->
                        <el-tag
                          size="medium"
                          v-for="(tdItem, tdIndex) in trItem.roleNames"
                          :key="tdIndex"
                        >{{ tdItem}}</el-tag>
                      </li>
                    </ul>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="enabled"
                  label="状态"
                  width="100"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-switch
                      :active-value="1"
                      :inactive-value="0"
                      v-model="scope.row.enabled"
                      :disabled="!$isHasBtnId(permisBtnIdSetting.forbid)"
                      @change="changeAccountStatus(scope.row,scope.row.enabled)"
                    ></el-switch>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="200"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div class="action-icon-group">
                      <el-button
                        type="text"
                        size="small"
                        @click="seeAccountDet(scope.row)"
                      >详情</el-button>
                      <el-dropdown
                        @command="handleClick"
                        placement="bottom"
                        v-if="moreOperationList(scope.row).length > 0"
                      >
                        <span class="el-dropdown-link">
                          更多<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu
                          slot="dropdown"
                          class="more-operation-setting"
                        >
                          <el-dropdown-item
                            v-for="(item,index) in moreOperationList(scope.row)"
                            :key="index"
                            :command="{type:item.command,rowIndex:scope.$index,rowData:scope.row}"
                          ><i :class="['oper-icon',item.iconClass]"></i>{{item.name}}</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
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
    <!-- 账户详情弹框 -->
    <mti-dialog
      :show.sync="accountDetVisible"
      :width="'660px'"
      :title="'账户详情'"
      @close-dialog="accountDetVisible = false"
    >
      <detail
        v-if="accountDetVisible"
        :sysAppList="sysAppList"
        :row-data="rowData"
        :selectedDepartId="selectedDepartId"
      ></detail>
    </mti-dialog>
    <!-- 新增账户弹框 -->
    <mti-dialog
      :show.sync="operAccountVisible"
      :width="'660px'"
      :title="dialogTitle + '用户'"
      @close-dialog="operAccountVisible = false"
    >
      <oper-account
        v-if="operAccountVisible"
        :sysAppList="sysAppList"
        :row-data="rowData"
        :selectedDepartId="selectedDepartId"
        @close-dialog="operAccountVisible = false"
        @oper-success="operSuccess"
      ></oper-account>
    </mti-dialog>
    <!-- 重置密码 -->
    <mti-dialog
      :show.sync="resetPassVisible"
      :width="'588px'"
      :title="'重置密码'"
      @close-dialog="resetPassVisible = false"
    >
      <reset-password
        v-if="resetPassVisible"
        :row-data="rowData"
        @close-dialog="resetPassVisible = false"
        @oper-success="operSuccess"
      ></reset-password>
    </mti-dialog>
    <!-- 绑定设备 -->
    <mti-dialog
      :show.sync="bindDeviVisible"
      :width="'588px'"
      :title="'绑定设备'"
      @close-dialog="bindDeviVisible = false"
    >
      <device-manage
        v-if="bindDeviVisible"
        :row-data="rowData"
        @close-dialog="bindDeviVisible = false"
        @oper-success="operSuccess"
      ></device-manage>
    </mti-dialog>
  </div>
</template>

<script>
import mtiTree from '@/components/tree';
import mtiDialog from '@/components/dialog';
import operAccount from '@/views/accountManage/operAccount.vue';
import detail from '@/views/accountManage/detail.vue';
import resetPassword from '@/views/accountManage/resetPassword.vue';
import deviceManage from '@/views/accountManage/deviceManage.vue';
import { _listToTree } from '@/utils/mtiUtils';
import { getOrgTreeData } from '@/api/orgConfiguration';
import { getAccountList, unitedBindInfo, deleteAccount, editAccount } from '@/api/account';
import { getAppListData } from '@/api/app';
import { createNamespacedHelpers } from 'vuex';
const { mapState: mapStateFromUser, mapActions: mapActionsFromUser } = createNamespacedHelpers('user');
const { mapActions: mapActionsFromPermission } = createNamespacedHelpers('permission');

export default {
  name: 'accountManage',
  props: {},
  components: {
    mtiTree,
    detail,
    mtiDialog,
    operAccount,
    resetPassword,
    deviceManage
  },
  data () {
    return {
      permisBtnIdSetting: this.$permisBtnIdSetting['accountManage'], // 权限按钮Id
      selectedDepartId: -1, // 默认选择的组织id
      // 组织机构树
      treeList: [],
      treeConfig: {
        search: true,
        check: false,
        drag: false,
        operate: false,
        isShowDisableMark: true
      },
      expandedkeys: [],
      currentNodekey: '',

      queryKey: '', // 查询
      slctSys: '',
      slctSysOptions: [],
      sysAppList: [], // 系统应用列表

      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      loading: true,
      rowData: {},
      operAccountVisible: false,
      dialogTitle: '',
      // 更多操作下拉菜单
      dropdownList: [
        {
          iconClass: 'customize-icon data-edit-icon',
          name: '编辑',
          command: 'edit'
        },
        {
          iconClass: 'customize-icon reset_pass-icon',
          name: '重置密码',
          command: 'resetPass'
        },
        {
          iconClass: 'customize-icon device-manage-icon',
          name: '设备管理',
          command: 'deviceManage'
        },
        {
          iconClass: 'customize-icon united-mobphone-icon',
          name: '解绑手机号',
          command: 'unitedPhoNum'
        },
        {
          iconClass: 'customize-icon data-delete-icon',
          name: '删除',
          command: 'delete'
        }
      ],
      // 账户详情
      accountDetVisible: false,
      // 重置密码
      resetPassVisible: false,
      // 解绑设备
      bindDeviVisible: false,

      expandRowKeys: []
    };
  },
  watch: {},
  computed: {
    ...mapStateFromUser(['userName', 'userId'])
  },
  created () {
    this.initTree();
    this.initAppList();
  },
  mounted () {
  },
  destroyed () { },
  methods: {
    ...mapActionsFromUser(['loginOut']),
    ...mapActionsFromPermission(['clearPermission']),
    // 初始化系统应用数据
    initAppList () {
      getAppListData({
        appLoginEndpoint: 'WEB'
      }).then((res) => {
        if (res && res.data) {
          this.sysAppList = res.data;
          for (let item of res.data) {
            this.slctSysOptions.push({
              value: item.appId,
              label: item.appName
            });
          }
        }
      });
    },
    // 初始化选择树
    initTree () {
      this.treeList = [];
      getOrgTreeData({
        departName: '' // 组织机构简称
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

          this.selectedDepartId = this.treeList[0].departParentId;
        }
      });
    },
    initAccountTable () {
      this.loading = true;
      this.tableData = [];
      let data = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        queryKey: this.queryKey,
        departId: this.selectedDepartId
      };
      if (this.slctSys !== '') {
        data.appId = this.slctSys;
      }
      getAccountList(data).then((res) => {
        if (res && res.data) {
          this.tableData = res.data.list;
          this.total = res.data.totalCount;
          this.refactorTbStyle();
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
    },
    // 点击tree的节点
    handleNodeClick (data) {
      this.selectedDepartId = data.departId;
      this.queryConditionInit();
      this.initAccountTable();
    },
    // 拖拽tree的节点
    handleNodeDrag (data, cb) {

    },
    moreOperationList (rowData) {
      let arr = [];
      for (let item of this.dropdownList) {
        if (item.command === 'edit' && this.$isHasBtnId(this.permisBtnIdSetting.edit)) {
          arr.push(item);
        }
        if (item.command === 'resetPass' && this.$isHasBtnId(this.permisBtnIdSetting.resetPassword)) {
          arr.push(item);
        }
        if (item.command === 'deviceManage' && this.$isHasBtnId(this.permisBtnIdSetting.deviceManage)) {
          arr.push(item);
        }
        if (item.command === 'unitedPhoNum' && this.$isHasBtnId(this.permisBtnIdSetting.unbindPhone) && rowData.userPhone !== null) {
          arr.push(item);
        }
        if (item.command === 'delete' && this.$isHasBtnId(this.permisBtnIdSetting.del)) {
          arr.push(item);
        }
      }
      return arr;
    },
    // 查看详情
    seeAccountDet (rowData) {
      this.rowData = rowData;
      this.accountDetVisible = true;
    },
    // 更多操作
    handleClick (command) {
      let rowData = command.rowData;
      this.rowData = command.rowData;
      let rowIndex = command.rowIndex;
      let operType = command.type;
      switch (operType) {
      case 'edit':
        this.dialogTitle = '编辑';
        this.operAccountVisible = true;
        break;
      case 'resetPass':
        this.resetPassVisible = true;
        break;
      case 'deviceManage':
        this.bindDeviVisible = true;
        break;
      case 'unitedPhoNum':
        this.unitedPhoneNum(rowIndex, rowData);
        break;
      case 'delete':
        this.handleDelete(rowIndex, rowData);
        break;
      default:
        break;
      }
    },
    handeleAdd () {
      this.rowData = {};
      this.dialogTitle = '新增';
      this.operAccountVisible = true;
    },
    handleDelete (index, row) {
      this.$confirmOperation('此操作将永久删除此用户, 是否继续?', '删除提示')
        .then(() => {
          if (this.userName === row.userName && this.userId === row.userId) {
            return this.$message({
              type: 'error',
              message: '无法删除当前登录用户！'
            });
          }
          deleteAccount(row.userId).then((res) => {
            if (res && res.data) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.initAccountTable();
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '已取消操作'
          });
        });
    },
    // 解绑手机号
    unitedPhoneNum (index, row) {
      this.$confirmOperation('此操作将永久解绑该手机号, 是否继续?')
        .then(() => {
          unitedBindInfo({
            userId: row.userId,
            userPhone: 'unbindphone'
          }).then((res) => {
            if (res && res.data) {
              this.$message({
                type: 'success',
                message: '解绑手机号成功!'
              });
              this.initAccountTable();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '已取消解绑'
          });
        });
    },
    // 修改账户状态
    changeAccountStatus (rowData, status) {
      let data = {
        userId: rowData.userId,
        userName: rowData.userName,
        enabled: status,
        perId: rowData.perId
      };
      editAccount(data).then((res) => {
        if (res && res.data) {
          this.$message({
            type: 'success',
            message: '状态修改成功!'
          });
          this.initAccountTable();
        } else {
          this.$message({
            type: 'error',
            message: res.message
          });
        }
      });
    },
    handleSizeChange (val) {
      this.pageSize = val;
      this.initAccountTable();
    },
    handleCurrentChange (val) {
      this.currentPage = val;
      this.initAccountTable();
    },
    operSuccess (operType) {
      this.resetPassVisible = false;
      this.operAccountVisible = false;
      this.bindDeviVisible = false;
      this.initAccountTable();
      if ((operType === 'resetPass' || operType === 'passModified') && (this.rowData.userName === this.userName || this.userId === this.rowData.userId)) {
        Promise.resolve().then(() => {
          this.changedPassTips();
        }).then(() => {
          this.jumpLoginPage();
        });
      }
    },
    // 已修改密码提示
    changedPassTips () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // resolve();
          resolve(this.$notify({
            title: '提示：',
            message: '系统登录账户密码已修改，请重新登录',
            offset: 100
          }));
        }, 2000);
      });
    },
    // 跳转登录页
    jumpLoginPage () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // resolve();
          resolve(this.loginOut().then((res) => {
            if (res && res.data === true) {
              this.clearPermission();
              this.$router.replace('/login');
            }
          }));
        }, 5000);
      });
    },
    handelBtnSearch () {
      this.currentPage = 1;
      this.pageSize = 10;
      this.total = 0;
      this.initAccountTable();
    },
    /***
     * @description 查询参数置为初始值
     */
    queryConditionInit () {
      this.queryKey = '';
      this.slctSys = '';
      this.currentPage = 1;
      this.pageSize = 10;
      this.total = 0;
    },
    // 重构表格样式
    refactorTbStyle () {
      this.$nextTick(() => {
        let elGroup = this.$refs;
        let rowIndex = Object.keys(elGroup).length / 2;

        for (let i = 0; i < rowIndex; i++) {
          let sysElGroup = elGroup['sys' + i];
          let roleElGroup = elGroup['role' + i];
          for (let j = 0; j < sysElGroup.length; j++) {
            let oThisSysElHeight = sysElGroup[j].offsetHeight;
            let oThisRoleElHeight = roleElGroup[j].offsetHeight;
            if (oThisSysElHeight > oThisRoleElHeight) {
              roleElGroup[j].style.height = roleElGroup[j].style.height = oThisSysElHeight + 'px';
              roleElGroup[j].style.display = 'flex';
              roleElGroup[j].style.alignItems = 'center';
              roleElGroup[j].style.justifyContent = 'center';
            } else {
              sysElGroup[j].style.height = roleElGroup[j].style.height = oThisRoleElHeight + 'px';
              sysElGroup[j].style.display = 'flex';
              sysElGroup[j].style.alignItems = 'center';
              sysElGroup[j].style.justifyContent = 'center';
            }
            this.$forceUpdate();// 手动更新数据
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/base.scss';
.tree-panel {
  display: flex;
  flex-flow: column wrap;
  min-height: 130px;
}
.tree {
  flex: 1;
  overflow-y: auto;
}
.content-panel {
  .bottom-tb {
    display: flex;
    flex-flow: column wrap;
    height: 100%;
  }
  .search-from {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
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

    .item-system,
    .item-role {
      width: 360px;
      padding: 5px;
      box-sizing: border-box;
    }
    .item-role {
      span {
        display: inline-block;
        // line-height: 32px;
        margin: 2px 4px;
      }
    }
  }
  .el-page {
    margin: 22px 0;
    text-align: right;
  }
}
.el-dropdown-menu,
.contact-type-body {
  i {
    width: 18px;
    height: 18px;
    display: inline-block;
    vertical-align: middle;
    background-size: 100% 100%;
  }
}
.self-app-panel {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: space-evenly;
  li {
    flex: 1;
    width: 100%;
  }
}
.ell1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
