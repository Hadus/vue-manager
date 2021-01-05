/*
* @Author: liuhuitao
* @Date: 2019-08-14 09:48:01
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-08-23 16:09:366
* @description: 分配权限弹框界面
*/
<template>
  <div>
    <div class="assign-permis-tree-panel">
      <el-tree
        v-loading="treeLoading"
        :data="menuTreeData"
        show-checkbox
        default-expand-all
        node-key="itemId"
        ref="menuTree"
        highlight-current
        @check="checkChange($event,$refs['menuTree'],menuTreeData)"
        :check-strictly='true'
        :props="defaultProps"
      >
      </el-tree>
    </div>
    <div class="assgnPer-btn-group">
      <el-button
        style="width:150px; height:42px;"
        @click="resetChecked"
      >取消</el-button>
      <el-button
        type="primary"
        @click="assignAuthority"
        style="margin-left: 67px;width:150px; height:42px;"
      >确定</el-button>
    </div>
  </div>
</template>

<script>
import { grantAuthority, getRolePermission } from '@/api/role';
import { getUsableAppData } from '@/api/app';
import { checkChange } from '@/utils';
import { _listToTree } from '@/utils/mtiUtils';
export default {
  name: 'assignPermissions',
  props: {
    selectedSysApp: {
      type: Number,
      default: -1
    },
    rowData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: {},
  data () {
    return {
      checkChange,
      appId: this.selectedSysApp,
      itemRowData: this.rowData,
      menuTreeData: [],
      treeLoading: false,
      defaultProps: {
        children: 'children',
        label: 'itemName'
      }
    };
  },
  watch: {},
  computed: {},
  created () {
    this.initCurrentRolePermi();
    this.initMenuTree();
  },
  mounted () { },
  beforeDestroy () {
    this.menuTreeData = [];
  },
  methods: {
    initMenuTree () {
      this.treeLoading = true;
      getUsableAppData({
        appId: this.appId
      }).then((res) => {
        if (res && res.data) {
          this.menuTreeData = _listToTree(res.data, {
            rootId: -1,
            pidname: 'parentItemId',
            cidname: 'itemId'
          }, {});
          this.treeLoading = false;
        }
      });
    },
    // 分配权限
    assignAuthority () {
      grantAuthority({
        roleId: this.itemRowData.roleId,
        // privilegeType: 1, // 角色关联的类型 1:菜单或按钮,2:角色
        roleType: 1, // 角色类型  1:应用角色  2:部门角色
        itemIds: this.getMenuBtnList(this.$refs.menuTree.getCheckedNodes()), // [](菜单按钮都有)
        appId: this.selectedSysApp
      }).then((res) => {
        if (res && res.code === '000000') {
          this.$message({
            type: 'success',
            message: '权限设定成功!'
          });
          let timer = setTimeout(() => {
            this.$emit('assign-success');
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
    // 清空选中的菜单
    resetChecked () {
      this.$refs.menuTree.setCheckedKeys([]);
      this.$emit('close-dialog');
    },
    getMenuBtnList (menuBtnList) {
      let arr = [];
      for (let item of menuBtnList) {
        arr.push(item.itemId);
      }
      return arr;
    },
    // 获取选中用户的权限
    initCurrentRolePermi () {
      getRolePermission({
        roleId: this.itemRowData.roleId,
        appId: this.selectedSysApp
      }).then((res) => {
        if (res && res.data) {
          let data = res.data;
          if (data.length !== 0) {
            let defaultCheckedKeys = [];
            for (let item of data) {
              defaultCheckedKeys.push(item.privilegeValue);
            }
            this.$refs.menuTree.setCheckedKeys(defaultCheckedKeys);
          }
        } else {
          this.$message({
            type: 'error',
            message: '查询当前角色权限失败!'
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.assgnPer-btn-group {
  @include flex(row);
  justify-content: center;
}
</style>
