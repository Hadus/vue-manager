/*
* @Author: liuhuitao
* @Date: 2019-08-12 10:17:00
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-10-15 11:01:41
* @description: 用户详情信息dialog
*/
<template>
  <div class="oper-account">
    <el-form
      label-width="90px"
      :model="operAccountForm"
      ref="operAccountForm"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="用户名："
            prop="userName"
          >
            {{operAccountForm.userName}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="姓名："
            prop="name"
          >
            {{operAccountForm.name}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="手机号："
            prop="phoneNumber"
          >
            {{operAccountForm.phoneNumber}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="状态："
            prop="status"
          >
            {{operAccountForm.status===1?'可用':'禁用'}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="密码："
        prop="password"
      >
        {{operAccountForm.password}}
      </el-form-item>
      <el-form-item
        label="账户授权："
        prop="role"
      >
        <el-tabs
          v-model="tabsActiveName"
          v-loading="tabsLoading"
        >
          <!-- @tab-click="handleTabsClick" -->
          <el-tab-pane
            label="分配角色"
            name="role"
          >
            <el-collapse
              v-model="roleActiveNames"
              @change="handleChange"
              accordion
            >
              <el-collapse-item
                v-for="(appItem,appIndex) in allSysAppRole"
                :key="appIndex"
                :name="appItem.appId"
                :title="appItem.appName"
              >
                <el-checkbox-group
                  v-model="allSysConfig[appItem.appId].checkedRoles"
                  @change="handleCheckedRolesChange($event,appItem.roles,appItem.appId)"
                  style="display: flex;flex-flow: column wrap;margin: 8px 0 0 44px;pointerEvents:none;"
                  class="checkbox-group"
                >
                  <el-checkbox
                    v-for="roleItem in appItem.roles"
                    :label="roleItem.roleId"
                    :key="roleItem.roleId"
                  >{{roleItem.roleName}}</el-checkbox>
                </el-checkbox-group>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane
            label="权限设定"
            name="permission"
          >
            <el-collapse
              v-model="roleActiveNames"
              @change="getCurrentItem"
              accordion
            >
              <el-collapse-item
                v-for="(appItem,appIndex) in allSysAppRole"
                :key="appIndex"
                :title="appItem.appName"
                :name="appItem.appId"
              >
                <el-tree
                  :data="appItem.appMenuData"
                  show-checkbox
                  default-expand-all
                  node-key="itemId"
                  :ref="'authTree'+ appItem.appId"
                  highlight-current
                  @check="checkChange($event,$refs['authTree'+ appItem.appId][0],appItem.appMenuData)"
                  :check-strictly='true'
                  :props="defaultProps"
                  style="pointerEvents:none;"
                >
                </el-tree>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { checkChange } from '@/utils';
import { _listToTree, asyncFn } from '@/utils/mtiUtils';
import { getRoleDataByAppIds, getRolePermiByMultRole } from '@/api/role';
import { getUserPrivilege } from '@/api/account';
import { getUsableAppData } from '@/api/app';

export default {
  name: 'operAccount',
  props: {
    rowData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    sysAppList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    selectedDepartId: {
      type: [String, Number],
      default: -1
    }
  },
  components: {},
  data () {
    return {
      checkChange,
      tabsLoading: false,
      tabsActiveName: 'role',
      addUserPerId: -1,
      operAccountForm: {
        userName: '',
        name: '',
        phoneNumber: '',
        password: '123456',
        status: 1
      },
      passInputType: 'password',
      currentOperType: 'add', // 当前打开弹框的类型(add:新增;edit:编辑)

      roleActiveNames: '', // 默认展开所有的应用系统

      allSysConfig: {}, // 选择角色多选框

      roleList: [],
      allSysAppIds: [],
      allSysAppRole: [],

      defaultProps: {
        children: 'children',
        label: 'itemName'
      }
    };
  },
  created () {
    this.initAccountForm();
    this.getAllRoleData();
  },
  beforeDestroy () {
    this.$refs['operAccountForm'].resetFields();
  },
  methods: {
    /**
     * @description: 初始化选择角色、权限数据
     */
    async initRoleData () {
      this.roleActiveNames = this.sysAppList[0].appId;
      for (let item of this.sysAppList) {
        this.allSysAppRole.push({
          roles: this.filterRole(item.appId, this.roleList), // 所有角色
          appMenuData: await this.getItemAppMenuData(item.appId), // 所有权限树
          defaultCheckedKeys: [],
          appId: item.appId,
          appName: item.appName,
          appCode: item.appCode
        });

        // 角色多选框默认数据配置
        this.allSysConfig[item.appId] = {
          isIndeterminate: false, // 新增用户时没有选中的，所以位false,编辑时只要有选中的就为true
          checkAll: false,
          checkedRoles: [],
          allRoles: this.filterRole(item.appId, this.roleList)
        };
      }
      /** ------ 编辑操作 ------ */
      if (this.currentOperType === 'edit') {
        this.initCheckedAuthor(this.rowData.userId);
      }
      this.tabsLoading = false;
    },
    // 获取所有角色数据
    getAllRoleData () {
      for (let item of this.sysAppList) {
        this.allSysAppIds.push(item.appId);
      }
      let data = {
        appIds: this.allSysAppIds.join(',')
      };
      getRoleDataByAppIds(data).then((res) => {
        if (res && res.data) {
          this.roleList = res.data;
          this.initRoleData();
        }
      });
    },
    // 获取对应系统的角色
    filterRole (appId, roleList) {
      return roleList.filter((item, index) => {
        return item.roleTypeValue === appId;
      });
    },
    // 触发角色折叠面板
    handleChange (collapseOpenArr) { },
    // 获取展开的系统
    getCurrentItem (activeAppId) { },
    // 异步获取菜单，按钮数据
    async getItemAppMenuData (appId) {
      const [err, res] = await asyncFn(getUsableAppData({ appId }));
      if (res && res.data) {
        let data = _listToTree(res.data, {
          rootId: -1,
          pidname: 'parentItemId',
          cidname: 'itemId'
        }, { open: false });
        return data;
      }
      if (err) {
        return [];
      }
    },
    /**
     * @description 初始化表单【获取当前操作状态】
     */
    initAccountForm () {
      if (Object.keys(this.rowData).length === 0) {
        this.currentOperType = 'add';
      } else {
        this.currentOperType = 'edit';
        // 初始化表单基础数据
        this.operAccountForm.userName = this.rowData.userName;
        this.operAccountForm.name = this.rowData.userRealName;
        this.operAccountForm.phoneNumber = this.rowData.userPhone;
        this.operAccountForm.password = this.rowData.passWord;
        this.operAccountForm.status = this.rowData.enabled;
      }
    },
    /***
     * @description 编辑状态：根据用户Id 查询对应的权限(页面显示勾选状态)
     */
    initCheckedAuthor (userId) {
      getUserPrivilege({
        userId
      }).then((res) => {
        if (res && res.data) {
          let data = res.data;
          // 当前用户绑定的权限数据
          let currentUserInfo = Object.create({});
          for (let item of data) {
            if (!currentUserInfo[item.appId]) {
              currentUserInfo[item.appId] = {
                roles: [],
                authIds: []
              };
            }
            if (item.privilegeType === 1) { // 1：角色，2：菜单或按钮
              currentUserInfo[item.appId].roles.push(item.privilegeValue);
            } else {
              currentUserInfo[item.appId].authIds.push(item.privilegeValue);
            }
          }
          this.initCheckedAuth(currentUserInfo);
        }
      });
    },
    /***
     * @description: 用户权限【角色、权限树设定选中的元素】
     */
    initCheckedAuth (infoObj) {
      for (let appId in infoObj) {
        if (this.allSysConfig[appId]) {
          this.allSysConfig[appId].checkedRoles = infoObj[appId].roles;
          let checkedCount = this.allSysConfig[appId].checkedRoles.length;
          let allRolesLength = this.allSysConfig[appId].allRoles.length;
          this.allSysConfig[appId].checkAll = checkedCount === allRolesLength;
          this.allSysConfig[appId].isIndeterminate = checkedCount > 0 && checkedCount < allRolesLength.length;
          this.$refs['authTree' + appId][0].setCheckedKeys(
            infoObj[appId].authIds
          );
          this.$forceUpdate();// 手动更新数据
        }
      }
    },
    /**
     * @description: 筛选选中的数据
     */
    checked (id, data, newArr) {
      data.forEach((item) => {
        if (item.itemId === id) {
          if (!item.children) {
            newArr.push(item.itemId);
          }
        } else {
          if (item.children) {
            if (item.children.length !== 0) {
              this.checked(id, item.children, newArr);
            }
          }
        }
      });
    },
    /**
     * @description 获取角色、权限参数
     */
    getRolsParams () {
      let roles = [];
      for (let item in this.allSysConfig) {
        // if (this.allSysConfig[item].checkedRoles.length > 0) { }
        roles.push({
          appId: Number(item),
          roleIds: this.allSysConfig[item].checkedRoles,
          authIds: this.$refs['authTree' + item][0].getCheckedKeys()
        });
      }
      return roles;
    },
    togglePassType (type) {
      this.passInputType = type;
    },
    handleSelectPerson (item) {
      this.operAccountForm.userName = item.perName;
      this.operAccountForm.name = item.perName;
      this.operAccountForm.phoneNumber = item.perTelphone;
      this.addUserPerId = item.perId;
    },
    /**
     * @description 触发 tabs
     */
    handleTabsClick (tab, event) { },
    /**
     * @description 点击角色多选框、角色全选框查询对应权限【每点击一次查一次】
     */
    searchPermisByRoles () {
      let roleIds = [];
      for (let appId in this.allSysConfig) {
        if (this.allSysConfig[appId].checkedRoles.length > 0) {
          roleIds.push(this.allSysConfig[appId].checkedRoles);
        }
      }
      let params = {
        roleIds: roleIds.join(',')
      };
      getRolePermiByMultRole(params).then((res) => {
        if (res && res.data.length > 0) {
          let permisDataObj = {};
          for (let item of res.data) {
            if (!permisDataObj[item.appId]) {
              permisDataObj[item.appId] = [];
              permisDataObj[item.appId].push(item.privilegeValue);
            } else {
              permisDataObj[item.appId].push(item.privilegeValue);
            }
          }
          for (let appId in permisDataObj) {
            this.$refs['authTree' + appId][0].setCheckedKeys(permisDataObj[appId]);
          }
        } else {
          for (let appId in this.allSysConfig) {
            this.$refs['authTree' + appId][0].setCheckedKeys([]);
          }
        }
      });
    },
    /**
     * @description: 触发角色 tabs 下全选框
     */
    handleCheckAllChange (isCheckAll, roles, appId) {
      let tempArr = [];
      for (let item of roles) {
        tempArr.push(item.roleId);
      }
      this.allSysConfig[appId].checkedRoles = isCheckAll ? tempArr : [];
      this.allSysConfig[appId].isIndeterminate = false;
      this.searchPermisByRoles();
    },
    /**
     * @description: 触发角色 tabs 下多选框
     */
    handleCheckedRolesChange (checkedArr, roles, appId) {
      let checkedCount = this.allSysConfig[appId].checkedRoles.length;
      this.allSysConfig[appId].checkAll = checkedCount === roles.length;
      this.allSysConfig[appId].isIndeterminate = checkedCount > 0 && checkedCount < roles.length;
      this.$forceUpdate();// 手动更新数据
      this.searchPermisByRoles();
    }
  }
};
</script>
<style lang="scss" scoped>
.admDivison-btn-group {
  @include flex(row);
  justify-content: center;
}
.view-icon {
  position: absolute;
  right: 18px;
  top: 12px;
  cursor: pointer;
  font-size: 18px;
}

.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
.el-autocomplete {
  display: block;
}
</style>
