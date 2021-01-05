/*
* @Author: liuhuitao
* @Date: 2019-08-12 10:17:00
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-09-17 16:56:20
* @description: 绑定设备设备 dialog
*/
<template>
  <div class="oper-account">
    <el-form
      label-width="90px"
      :model="operAccountForm"
      :label-position="labelPosition"
    >
      <el-form-item
        label="IP"
        prop="ip"
      >
        <div class="form-content-wrap">
          <el-input
            v-model="operAccountForm.ip"
            placeholder="请输入IP"
            style="width: 312px;"
            :disabled="ipBtnType === 'bind'?false:true"
          ></el-input>
          <el-button
            type="primary"
            class="btn"
            v-show="ipBtnType === 'bind'"
            @click="handleBind('ip')"
          >绑定</el-button>
          <el-button
            type="danger"
            class="btn"
            v-show="ipBtnType === 'united'"
            @click="handleUnited('ip')"
          >解绑</el-button>
        </div>
      </el-form-item>
      <el-form-item
        label="手机串号"
        prop="IMEI"
      >
        <div class="form-content-wrap">
          <el-input
            v-model="operAccountForm.IMEI"
            placeholder="请输入手机串号"
            style="width: 312px;"
            :disabled="imetBtnType === 'bind'?false:true"
          ></el-input>
          <el-button
            type="primary"
            class="btn"
            v-show="imetBtnType === 'bind'"
            @click="handleBind('mob')"
          >绑定</el-button>
          <el-button
            type="danger"
            class="btn"
            v-show="imetBtnType === 'united'"
            @click="handleUnited('mob')"
          >解绑</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { bindDevice, unitedBindInfo, getUserBindInfo } from '@/api/account';

export default {
  name: 'deviceManage',
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
    return {
      labelPosition: 'right',
      operAccountForm: {
        ip: '',
        IMEI: ''
      },
      ipBtnType: 'bind',
      imetBtnType: 'bind'
    };
  },
  created () {
    this.initDeviceInfo();
  },
  methods: {
    // 绑定操作
    handleBind (type) {
      let data = {
        userId: this.rowData.userId
      };
      let arrData = [];
      data.userPolicy = type === 'ip' ? 'IP' : 'IMEI';
      data.userPolicyValue = type === 'ip' ? this.operAccountForm.ip : this.operAccountForm.IMEI;
      arrData.push(data);
      bindDevice(arrData).then((res) => {
        if (res && res.data) {
          this.initDeviceInfo();
          if (type === 'ip') {
            return this.$message({
              type: 'success',
              message: '绑定IP成功!'
            });
          } else {
            return this.$message({
              type: 'success',
              message: '绑定手机串号成功!'
            });
          };
        } else {
          if (type === 'ip') {
            return this.$message({
              type: 'error',
              message: '绑定IP失败!'
            });
          } else {
            return this.$message({
              type: 'error',
              message: '绑定手机串号失败!'
            });
          }
        }
      });
    },
    // 获取此用户下的设备信息
    initDeviceInfo () {
      getUserBindInfo({
        userId: this.rowData.userId
      }).then((res) => {
        if (res && res.data) {
          let data = res.data;
          if (data.length === 0) {
            this.operAccountForm = {
              ip: '',
              IMEI: ''
            };
            this.ipBtnType = 'bind';
            this.imetBtnType = 'bind';
          } else if (data.length === 1) {
            for (let item of data) {
              if (item.userPolicy === 'IP') {
                this.operAccountForm.ip = item.userPolicyValue;
                this.ipBtnType = 'united';
                this.operAccountForm.IMEI = '';
                this.imetBtnType = 'bind';
              } else {
                // IMEI
                this.operAccountForm.ip = '';
                this.ipBtnType = 'bind';
                this.operAccountForm.IMEI = item.userPolicyValue;
                this.imetBtnType = 'united';
              }
            }
          } else {
            for (let item of data) {
              if (item.userPolicy === 'IP') {
                this.operAccountForm.ip = item.userPolicyValue;
                this.ipBtnType = 'united';
              } else {
                // IMEI
                this.operAccountForm.IMEI = item.userPolicyValue;
                this.imetBtnType = 'united';
              }
            }
          }
        }
      });
    },
    // 解绑操作
    handleUnited (type) {
      let data = {
        userId: this.rowData.userId
      };
      data.userPolicyValue = type === 'ip' ? 'unbindip' : 'unbindimei';
      unitedBindInfo(data).then((res) => {
        if (res && res.data) {
          this.initDeviceInfo();
          if (type === 'ip') {
            return this.$message({
              type: 'success',
              message: '解绑IP成功!'
            });
          } else {
            return this.$message({
              type: 'success',
              message: '解绑手机串号成功!'
            });
          };
        } else {
          if (type === 'ip') {
            return this.$message({
              type: 'error',
              message: '解绑IP失败!'
            });
          } else {
            return this.$message({
              type: 'error',
              message: '解绑手机串号失败!'
            });
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.form-content-wrap {
  @include flex(row);
  justify-content: space-between;
  .btn {
    width: 98px;
    height: 42px;
  }
}
</style>
