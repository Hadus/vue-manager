/*
 * @Author: liuhuitao
 * @Date: 2019-08-12 10:17:00
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-10-25 09:30:13
 * @description: 新增、编辑角色表单
 */
<template>
  <div>
    <el-form
      label-width="80px"
      :model="operateRoleForm"
      :rules="operateRoleFormRules"
      ref="operRoleForm"
    >
      <el-form-item
        label="名 称"
        prop="name"
      >
        <el-input
          v-model="operateRoleForm.name"
          maxlength="40"
          placeholder="请输入角色名称"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="描述"
        prop="desc"
      >
        <el-input
          type="textarea"
          :rows="3"
          maxlength="100"
          placeholder="请输入角色描述内容"
          v-model="operateRoleForm.desc"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="状态"
        prop="status"
      >
        <el-switch
          :active-value="1"
          :inactive-value="0"
          v-model="operateRoleForm.status"
        ></el-switch>
      </el-form-item>
    </el-form>
    <div class="admDivison-btn-group">
      <el-button
        style="width:150px; height:42px;"
        @click="$emit('close-dialog')"
      >取消</el-button>
      <el-button
        type="primary"
        style="margin-left: 67px;width:150px; height:42px;"
        @click="handleDetermine"
      >确定</el-button>
    </div>
  </div>
</template>

<script>
import { addRole, editRole } from '@/api/role';
import { checkLetChinNumUnder } from '@/utils/mtiUtils';
export default {
  name: 'operRole',
  props: {
    rowData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    selectedSysApp: {
      type: Number,
      default: -1
    }
  },
  components: {},
  data () {
    let checkRoleName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入角色名称'));
      } else if (!checkLetChinNumUnder(value)) {
        callback(new Error('角色名称由汉字、数字、字母或下划线组成'));
      } else {
        callback();
      }
    };
    return {
      itemData: this.rowData,
      roleTypeValue: this.selectedSysApp,
      operateRoleForm: {
        name: '',
        desc: '', // 简称
        status: 1
      },
      operateRoleFormRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur' },
          { validator: checkRoleName, trigger: 'change' }
        ],
        desc: [
          { max: 100, message: '描述内容最大长度为 100 个字符', trigger: 'blur' }
        ]
      },
      currentOperType: 'add' // 当前打开弹框的类型(add:新增;edit:编辑)
    };
  },
  watch: {},
  computed: {},
  created () {
    this.initRoleForm();
  },
  mounted () { },
  beforeDestroy () {
    this.$refs['operRoleForm'].resetFields();
  },
  methods: {
    // 初始化表单
    initRoleForm () {
      if (Object.keys(this.rowData).length === 0) {
        this.currentOperType = 'add';
      } else {
        this.currentOperType = 'edit';
        this.operateRoleForm.name = this.rowData.roleName;
        this.operateRoleForm.desc = this.rowData.roleDesc;
        this.operateRoleForm.status = this.rowData.enabled;
      }
    },
    handleDetermine () {
      this.$refs['operRoleForm'].validate((valid) => {
        if (valid) {
          if (this.currentOperType === 'add') {
            this.handleAddRole();
          } else {
            this.handleEditRole();
          }
        } else {
          return this.$message({
            type: 'error',
            message: '角色信息未按规定录入!'
          });
        }
      });
    },
    // 新增角色
    handleAddRole () {
      addRole({
        roleTypeValue: this.roleTypeValue,
        roleName: this.operateRoleForm.name,
        roleDesc: this.operateRoleForm.desc,
        roleType: 1, // 角色类型  1:应用角色  2:部门角色
        enabled: this.operateRoleForm.status // 是否可用 1:可用  0:不可用
      }).then((res) => {
        if (res && res.data) {
          this.$message({
            type: 'success',
            message: '新增成功!'
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
    // 修改角色
    handleEditRole () {
      editRole({
        roleId: this.itemData.roleId,
        roleTypeValue: this.roleTypeValue,
        roleName: this.operateRoleForm.name,
        roleDesc: this.operateRoleForm.desc,
        roleType: 1, // 角色类型  1:应用角色  2:部门角色
        enabled: this.operateRoleForm.status// 是否可用 1:可用  0:不可用
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
    }
  }
};
</script>
<style lang="scss" scoped>
.admDivison-btn-group {
  @include flex(row);
  justify-content: center;
}
</style>
