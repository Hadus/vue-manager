/*
* @Author: liuhuitao
* @Date: 2019-08-12 10:17:00
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-10-25 09:28:03
* @description: 重置密码 dialog
*/
<template>
  <div class="reset-pass">
    <el-form
      label-width="90px"
      :model="resetPassForm"
      ref="resetPassPanel"
      :rules="resetPassFormRules"
    >
      <el-form-item
        label="重置密码"
        prop="newPassword"
      >
        <el-input
          :type="passInputType"
          v-model="resetPassForm.newPassword"
          placeholder="请输入重置密码"
          style="width:260px;"
        >
          <i
            class="el-icon-view view-icon"
            slot="suffix"
            @mousedown="togglePassType('input')"
            @mouseup="togglePassType('password')"
          ></i></el-input>
        <span class="tips-content">默认密码：123456</span>
      </el-form-item>
    </el-form>
    <div class="admDivison-btn-group">
      <el-button
        style="width:150px; height:42px;"
        @click="$emit('close-dialog')"
      >取消</el-button>
      <el-button
        type="primary"
        @click="handleDetermine"
        style="margin-left: 67px;width:150px; height:42px;"
      >确定</el-button>
    </div>
  </div>
</template>

<script>
import { restPass } from '@/api/account';
import { checkPassword } from '@/utils/mtiUtils';
export default {
  name: 'resetPassword',
  props: {
    rowData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: {},
  data () {
    let checkedPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入重置密码'));
      } else if (!checkPassword(value)) {
        callback(new Error('密码由长度在6~20 之间的字母、数字或下划线组成'));
      } else {
        callback();
      }
    };
    return {
      resetPassForm: {
        newPassword: '123456'
      },
      resetPassFormRules: {
        newPassword: [
          { required: true, message: '请输入重置密码', trigger: 'blur' },
          { validator: checkedPass, trigger: 'change' }
        ]
      },

      passInputType: 'password'
    };
  },
  methods: {
    handleDetermine () {
      this.$refs['resetPassPanel'].validate((valid) => {
        if (valid) {
          restPass({
            userId: this.rowData.userId,
            passWord: this.resetPassForm.newPassword,
            userName: this.rowData.userName
          }).then((res) => {
            if (res && res.data) {
              this.$message({
                type: 'success',
                message: '重置密码成功!'
              });
              let timer = setTimeout(() => {
                this.$emit('oper-success', 'resetPass');
                if (timer) {
                  clearTimeout(timer);
                }
              }, 1000);
            } else {
              this.$message({
                type: 'error',
                message: '重置密码失败!'
              });
            }
          });
        } else {
          return this.$message({
            type: 'error',
            message: '重置密码信息未按规定录入!'
          });
        }
      });
    },
    togglePassType (type) {
      this.passInputType = type;
    }
  }
};
</script>
<style lang="scss" scoped>
.view-icon {
  cursor: pointer;
}
.admDivison-btn-group {
  @include flex(row);
  justify-content: center;
}
.tips-content {
  color: #999999;
  font-size: 16px;
  margin-left: 28px;
}
</style>
