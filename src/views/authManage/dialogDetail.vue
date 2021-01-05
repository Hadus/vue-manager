<template>
  <div class="dialog">
    <el-form
      :model="dialog.data"
      ref="dialogForm"
      :rules="dialog.rules"
      label-width="85px"
    >
      <el-row :gutter="40">
        <el-col :span="11">
          <el-form-item label="类型：">
            <!-- 显示菜单/按钮 -->
            <el-radio-group
              v-model.trim="dialog.data.itemType"
              v-if="dialog.flagItemType"
            >
              <el-radio
                :label="1"
                v-if="dialog.flagItemType===1"
              >菜单</el-radio>
              <el-radio
                :label="2"
                v-else
              >按钮</el-radio>
            </el-radio-group>
            <!-- 显示菜单and按钮 -->
            <el-radio-group
              v-model.trim="dialog.data.itemType"
              v-else
            >
              <el-radio :label="1">菜单</el-radio>
              <el-radio :label="2">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="名称："
            prop="itemName"
          >
            <el-input
              v-model.trim="dialog.data.itemName"
              maxlength="30"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="排序："
            prop="sorted"
            v-show="dialog.data.itemType===1"
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
            label="请求地址："
            prop="itemRoute"
            v-show="dialog.data.itemType===1"
          >
            <el-input
              v-model.trim="dialog.data.itemRoute"
              maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="状态："
            v-show="dialog.data.itemType===1"
          >
            <el-switch
              v-model.trim="dialog.data.enabled"
              :active-value="1"
              :inactive-value="0"
              :disabled="dialog.data.itemId<1000||dialog.data.itemType === 2"
              @change="handleSwitch(dialog.data.itemId)"
            ></el-switch>
          </el-form-item>
        </el-col>
        <el-col
          :span="11"
          class="right-box"
          v-if="dialog.data.itemType===1"
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
                :src="sourcePath+'/'+dialog.data.itemIcon"
                v-if="dialog.data.itemIcon"
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
      <el-form-item
        label="描述："
        prop="itemDesc"
      >
        <el-input
          v-model.trim="dialog.data.itemDesc"
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
    >
      <el-button @click="dialog.visible = false">取 消</el-button>
      <el-button
        @click="ensureDialog('dialogForm','dialog')"
        type="primary"
      >确 定</el-button>
    </div>
  </div>
</template>

<script>
// 导入服务
import { $addSystemItem, $modSystemItem } from '@/api/authManage';
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
  destroyed () { },
  methods: {
    // 点击上传图片
    triggerUploadImg () {
      this.$refs['uploadFile'].click();
    },
    // 选择文件
    beforeAvatarUpload (file) {
      const isTypePass = ['image/jpeg', 'image/png'].includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isTypePass) {
        this.$message.error('支持文件格式：jpg，png！');
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
          this['dialog'].data.itemIcon = res.data.path;
        } else {
          this.$message.error(`上传失败：${res.message}`);
        }
      });
    },
    // dialog-switch
    handleSwitch (itemId) {
      return !(itemId < 1000);// 初始数据不允许操作
    },
    // dialog提交
    ensureDialog (formName, dialogName) {
      this.$refs[formName].validate((valid, invalidObj) => {
        if (!valid) return false;
        // 校验通过
        const reqData = {
          enabled: this[dialogName].data.enabled,
          itemName: this[dialogName].data.itemName,
          appId: this[dialogName].data.appId,
          itemType: this[dialogName].data.itemType,
          sorted: this[dialogName].data.sorted,
          parentItemId: this[dialogName].data.parentItemId,
          itemDesc: this[dialogName].data.itemDesc,
          itemRoute: this[dialogName].data.itemRoute,
          itemIcon: this[dialogName].data.itemIcon
        };
        // 按钮没有itemIcon和enabled
        if (reqData.itemType === 2) {
          reqData.itemIcon = '';
          reqData.enabled = 0;
        }

        if (this[dialogName].type === 0) { // 添加
          $addSystemItem(reqData).then((res) => {
            if (res.code === '000000') {
              this.$message.success('添加成功');
              this.$emit('enter-cb');
              this.$emit('update:show', false);
            } else {
              this.$message.error(`添加失败：${res.message}`);
            }
          });
        } else { // 编辑
          reqData.itemId = this[dialogName].data.itemId;
          $modSystemItem(reqData).then((res) => {
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
