<!--
 * @Descripttion:
 * @version:
 * @Author: ZhengPan
 * @Date: 2019-09-10 09:51:05
 * @LastEditors: ZhengPan
 * @LastEditTime: 2019-09-19 18:13:14
 -->
<template>
  <div>
    <h3 class="import-tt">操作步骤：</h3>
    <p class="step">
      1.请先下载 <a
        href="javascript:;"
        @click="handleGetTemplate"
      >数据模板</a> ，保存在本地后，按模板整理数据，注意不能增加模板中的栏位。
    </p>
    <p class="desc">
      说明：人员数据必须挂接在组织机构下面，如果当前账号没有组织机构数据，请先导入组织机构！
    </p>
    <p class="step step-upload">
      2.请选择上传数据文件。
      <el-upload
        ref="upload"
        class="upload-demo"
        action=""
        name='file'
        accept=".xlsx"
        :limit="1"
        :file-list="fileList"
        :http-request="handleUpload"
        :show-file-list="false"
        style="display: inline-block;"
      >
        <el-button
          type="success"
          style="width: 110px;height: 42px;"
          slot="trigger"
        ><i
            class="customize-icon upload-icon"
            style="background-size: 100% 100%;"
          ></i> 上传文件</el-button>
      </el-upload>
    </p>
    <p class="step file-name">
      <transition name="el-zoom-in-top">
        <p
          class="content"
          v-if="inportFile!==null"
        >
          <span>
            &nbsp;&nbsp;<i class="excel-icon"></i>
            {{inportFile.name}}
          </span>
          <span>
            <i
              :class="operFileIconClass"
              @click="removeUploadFile"
              @mouseenter="operFileIconClass='el-icon-circle-close'"
              @mouseleave="operFileIconClass='el-icon-circle-check'"
              style="cursor:pointer;"
            ></i>
          </span>
        </p>
      </transition>
    </p>
    <p class="step">
      3.导入完成后，可以点击
      <a
        href="javascript:;"
        @click="handleGetUploadLog"
      >这里</a>，查看日志文件，了解详细的导入情况
    </p>
    <div class="dataImport-btn-group">
      <el-button
        style="width:150px; height:42px;"
        @click="cancel"
      >取消</el-button>
      <el-button
        type="primary"
        style="margin-left: 67px;width:150px; height:42px;"
        @click="ensure"
      >确定</el-button>
    </div>
  </div>
</template>

<script>
import { exportLog as $exportLog } from '@/api/orgConfiguration';
import { releaseFileStream as _releaseFileStream } from '@/utils/';
// 导入服务
import { $exportFileTemp, $importPersonList } from '@/api/personManage';
export default {
  name: '',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    departId: {
      type: Number,
      default: null
    }
  },
  components: {},
  data () {
    return {
      fileList: [],
      inportFile: null,
      uploadLogFileUrl: '',
      operFileIconClass: 'el-icon-circle-check'
    };
  },
  methods: {
    // 获取模板
    handleGetTemplate () {
      $exportFileTemp().then((res) => {
        if (res) {
          _releaseFileStream(res, '导入人员模板.xlsx');
        } else {
          this.$message.error(`模板获取失败：${res.message}`);
        }
      });
    },
    // 选择文件
    beforeAvatarUpload (file) {
      return true;
    },
    // 上传文件
    handleUpload (uploadRef) {
      this.inportFile = uploadRef.file;
    },
    // 获取上传日志
    handleGetUploadLog (e) {
      if (!this.uploadLogFileUrl) {
        this.$message.error('暂无可查看日志，请上传人员数据');
        return;
      }
      $exportLog(this.uploadLogFileUrl).then((res) => {
        if (res) {
          _releaseFileStream(res, 'log.txt');
        } else {
          this.$message.error(`获取日志失败：${res.message}`);
        }
      });
    },
    // 点击取消
    cancel () {
      this.$emit('update:show', false);
    },
    // 点击确定
    ensure (formName) {
      if (this.inportFile === null) {
        return this.$message({
          type: 'error',
          message: '请上传人员数据!'
        });
      }
      $importPersonList({ departId: this.departId, file: this.inportFile }).then((res) => {
        if (res && res.data) {
          this.uploadLogFileUrl = res.data.path;
          this.$emit('ensure-import-cb');
          this.$message.success('人员数据上传成功，请查看日志是否导入成功!');
        } else {
          this.$message.error('人员数据上传失败!');
        }
      });
    },
    removeUploadFile () {
      this.inportFile = null;
      this.$refs.upload.clearFiles();
    }
  }
};
</script>
<style lang="scss" scoped>
$imgUrl: '~@/assets/images/common';
.customize-icon.upload-icon {
  background-size: 100% 100%;
  display: inline-block;
  margin-left: -8px;
  width: 16px;
  height: 16px;
  margin-bottom: -3px;
  cursor: pointer;
  background: url('#{$imgUrl}/upload.png') no-repeat;
}
.import-tt {
  margin-bottom: 20px;
}
.dataImport-btn-group {
  margin-top: 30px;
  @include flex(row);
  justify-content: center;
}

.step {
  font-size: 16px;
  color: #333333;
  margin-bottom: 20px;
}
.desc {
  font-size: 14px;
  color: #999999;
  line-height: 30px;
  padding: 12px;
}
.file-name {
  margin: 20px 0 30px;
  .content {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }
  span:first-child {
    flex: 1;
  }
  span:last-child {
    width: 30px;
  }
  .excel-icon {
    background-size: 100% 100%;
    display: inline-block;
    width: 24px;
    height: 26px;
    margin-bottom: -8px;
    background: url('#{$imgUrl}/excel.png') no-repeat;
  }
}
</style>
