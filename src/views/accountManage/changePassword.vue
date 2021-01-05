/*
* @Author: liuhuitao
* @Date: 2019-08-12 10:17:00
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-10-25 09:28:19
* @description: 修改密码 dialog
*/
<template>
  <div class="reset-pass">
    <el-form
      label-width="90px"
      :model="changePassForm"
      :rules="changePassFormRules"
      ref="changePassPanel"
    >
      <el-form-item
        label="新密码"
        prop="newPassword"
      >
        <el-input
          :type="newPassInputType"
          v-model="changePassForm.newPassword"
          placeholder="请输入新密码"
        >
          <i
            class="el-icon-view view-icon"
            slot="suffix"
            @mousedown="toggleNewPassType('input')"
            @mouseup="toggleNewPassType('password')"
          ></i></el-input>
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="confirmPassword"
      >
        <el-input
          :type="confirmPassInputType"
          v-model="changePassForm.confirmPassword"
          placeholder="请再次输入密码"
        >
          <i
            class="el-icon-view view-icon"
            slot="suffix"
            @mousedown="toggleConfirmPassType('input')"
            @mouseup="toggleConfirmPassType('password')"
          ></i></el-input>
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
import { createNamespacedHelpers } from 'vuex';
import { checkPassword } from '@/utils/mtiUtils';
const { mapState: mapStateFromUser } = createNamespacedHelpers('user');
export default {
  name: 'changePassword',
  components: {},
  data () {
    let checkedPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (!checkPassword(value)) {
        callback(new Error('密码由长度在6~20 之间的字母、数字或下划线组成'));
      } else {
        callback();
      }
    };
    return {
      changePassForm: {
        confirmPassword: '',
        newPassword: ''
      },
      changePassFormRules: {
        newPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkedPass, trigger: 'change' }
        ],
        confirmPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: checkedPass, trigger: 'change' }
        ]
      },
      confirmPassInputType: 'password',
      newPassInputType: 'password'
    };
  },
  computed: {
    ...mapStateFromUser(['userName', 'userId'])
  },
  methods: {
    handleDetermine () {
      if (this.changePassForm.confirmPassword !== this.changePassForm.newPassword) {
        let timer = setTimeout(() => {
          this.changePassForm = {
            confirmPassword: '',
            newPassword: ''
          };
          if (timer) {
            clearTimeout(timer);
          }
        }, 500);
        return this.$message({
          type: 'error',
          message: '两次输入不一致，请重新输入!'
        });
      }
      this.$refs['changePassPanel'].validate((valid) => {
        if (valid) {
          restPass({
            userId: this.userId,
            passWord: this.changePassForm.newPassword,
            userName: this.userName
          }).then((res) => {
            if (res && res.data) {
              this.$message({
                type: 'success',
                message: '修改密码成功!'
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
                message: '修改密码失败!'
              });
            }
          });
        } else {
          return this.$message({
            type: 'error',
            message: '修改密码信息未按规定录入!'
          });
        }
      });
    },
    toggleConfirmPassType (type) {
      this.confirmPassInputType = type;
    },
    toggleNewPassType (type) {
      this.newPassInputType = type;
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
