<template>
  <div class="dialog">
    <el-form
      :model="dialog.data"
      :rules="dialog.rules"
      ref="dialogForm"
      label-width="90px"
      :disabled="dialog.data.appId===1"
    >
      <el-row :gutter="40">
        <el-col :span="11">
          <el-form-item
            label="名称："
            prop="appName"
          >
            <el-input
              v-model.trim="dialog.data.appName"
              maxlength="30"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="编号："
            prop="appCode"
          >
            <el-input
              v-model.trim="dialog.data.appCode"
              :disabled="!!dialog.type"
              maxlength="30"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="简称："
            prop="appShortName"
          >
            <el-input
              v-model.trim="dialog.data.appShortName"
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="false"
            label="排序："
            prop="sorted"
          >
            <el-input-number
              v-model.trim="dialog.data.sorted"
              :min="1"
              :step="1"
              step-strictly
              size="small"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item
            label="URL："
            prop="appUrl"
          >
            <el-input
              v-model.trim="dialog.data.appUrl"
              maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label="登录策略：">
            <el-checkbox-group
              v-model.trim="dialog.data.appLoginEndpointArr"
              :min="1"
            >
              <el-checkbox label="WEB">PC端</el-checkbox>
              <el-checkbox label="MOBILE">移动端</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="重复登录：">
            <el-radio-group v-model.trim="dialog.data.appLoginTwice">
              <el-radio :label="0">不允许</el-radio>
              <el-radio :label="1">允许</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col
          :span="11"
          class="right-box"
        >
          <el-upload
            action=""
            accept="image/png, image/jpeg"
            :before-upload="beforeAvatarUpload"
            :http-request="handleUpload"
            :show-file-list="false"
          >
            <div>
              <img
                :src="sourcePath+'/'+dialog.data.appLogo"
                v-if="dialog.data.appLogo"
              />
              <i
                v-else
                class="default-icon"
              >
                <img src="~@/assets/images/logo-bg.png">
              </i>
            </div>
            <div class="btn-box">
              <el-button
                size="small"
                type="success"
              >
                <i class="upload-img-icon"></i>&nbsp;上传图标
              </el-button>
              <p class="tips">支持文件格式：jpg，png大小不能超过500kb!</p>
            </div>
          </el-upload>
        </el-col>
      </el-row>
      <el-form-item label="会话策略：">
        <el-radio-group v-model.trim="dialog.data.appSessionTimeout">
          <el-radio label="-1">无限制</el-radio>
          <el-radio label="1440">24小时</el-radio>
          <el-radio label="60">1小时</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态：">
        <el-switch
          v-model.trim="dialog.data.enabled"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
      </el-form-item>
      <el-form-item
        label="描述："
        prop="appDesc"
      >
        <el-input
          v-model.trim="dialog.data.appDesc"
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          maxlength="100"
        ></el-input>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
      v-if="dialog.data.appId!==1"
    >
      <el-button @click="$emit('update:show',false)">取 消</el-button>
      <el-button
        @click="dialog.data.appId!==1&&ensureDialog('dialogForm', 'dialog')"
        type="primary"
      >确 定</el-button>
    </div>
  </div>
</template>

<script>
// 导入服务
import { $modSystem, $addSystem } from '@/api/authManage';
import { uploadFile as $uploadFile } from '@/api/';
import { $file, $source } from '@/config';

export default {
  name: '',
  components: {},
  mixins: [],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    dialog: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      sourcePath: $source
    };
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  beforeDestroy () {
    this.$refs['dialogForm'].resetFields();
  },
  methods: {
    // 选择文件
    beforeAvatarUpload (file) {
      const isTypePass = ['image/jpeg', 'image/png'].includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isTypePass) {
        this.$message.error('支持文件格式：jpg，png!');
      }
      if (!isLt2M) {
        this.$message.error('支持文件大小：不能超过500kb!');
      }
      return isTypePass && isLt2M;
    },
    // 上传文件
    handleUpload (uploadRef) {
      $uploadFile($file + '/uploadFilesToFast', uploadRef.file).then((res) => {
        if (res.code === '000000') {
          this['dialog'].data.appLogo = res.data.path;
        } else {
          this.$message.error(`上传失败：${res.message}`);
        }
      });
    },

    // dialog提交
    ensureDialog (formName, dialogName) {
      this.$refs[formName].validate((valid, invalidObj) => {
        if (!valid) return false;
        // 校验通过
        const reqData = {
          appName: this[dialogName].data.appName,
          appCode: this[dialogName].data.appCode,
          appDesc: this[dialogName].data.appDesc,
          appUrl: this[dialogName].data.appUrl,
          appLogo: this[dialogName].data.appLogo,
          appShortName: this[dialogName].data.appShortName,
          sorted: this[dialogName].data.sorted,
          enabled: this[dialogName].data.enabled,
          appLoginEndpoint: this[dialogName].data.appLoginEndpointArr.toString(),
          appSessionTimeout: this[dialogName].data.appSessionTimeout,
          appLoginTwice: this[dialogName].data.appLoginTwice
        };
        if (this[dialogName].type === 0) { // 添加
          $addSystem(reqData).then((res) => {
            if (res.code === '000000') {
              this.$message.success('添加成功');
              this.$emit('enter-cb');
              this.$emit('update:show', false);
            } else {
              this.$message.error(`添加失败：${res.message}`);
            }
          });
        } else { // 编辑
          reqData.appId = this[dialogName].data.appId;
          $modSystem(reqData).then((res) => {
            if (res.code === '000000') {
              this.$message.success('修改成功');
              this.$emit('enter-cb');
              this.$emit('update:show', false);
            } else {
              this.$message.error(`修改失败：${res.message}`);
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.el-dialog {
  .el-input-number {
    width: 100%;
  }
  .right-box {
    box-sizing: border-box;
    text-align: center;
    div {
      display: inline-block;
      margin-bottom: 20px;
    }
    $img_h: 166px;
    img,
    i.default-icon {
      display: inline-block;
      width: 166px;
      height: $img_h;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      text-align: center;
    }
    i.default-icon {
      overflow: hidden;
      line-height: ($img_h - 54px);
      background: #f7feff;
      &:hover {
        border-color: #409eff;
      }
      img {
        width: 54px;
        height: 54px;
        vertical-align: text-top;
      }
    }
    .btn-box {
      button {
        margin-bottom: 20px;
      }
      p.tips {
        width: 182px;
        height: 47px;
        font-weight: 400;
        color: rgba(221, 221, 221, 1);
        line-height: 20px;
      }
      i.upload-img-icon {
        display: inline-block;
        width: 16px;
        height: 12px;
        background: url('#{$imgUrl}/upload.png') no-repeat;
        background-size: contain;
      }
    }
  }
}
/**dialog**/
.el-dialog {
  .dialog-footer {
    text-align: center;
    button {
      width: 150px;
      height: 42px;
    }
    button + button {
      margin-left: 80px;
    }
  }
}
.dialog {
  padding-right: 32px;
  padding-left: 32px;
}
</style>
