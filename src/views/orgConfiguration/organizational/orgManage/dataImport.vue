/*
* @Author: liuhuitao
* @Date: 2019-08-09 15:22:06
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-08-29 18:28:233
*/
<template>
  <div>
    <h3 class="import-tt">操作步骤</h3>
    <p class="step">
      1.请先下载 <a
        href="javascript:void(0);"
        @click="handleDownload"
      >数据模板</a> ，保存在本地后，按模板整理数据，注意不能增加模板中的栏位。
    </p>
    <p class="desc">
      说明：导入数据不会自动增加数据中涉及的字典数据，请在导入前先导入所涉及的相关字典数据。例如：导入组织，涉及到组织性质，那么导入组织之前，请先导入分类数据，才可以导入组织数据。
    </p>
    <p class="step">
      2.请选择上传数据文件。
      <!-- image/*, .pdf, .doc, .docx, .xlsx,.txt -->
      <el-upload
        class="upload-demo"
        ref="uploadTool"
        action=""
        :limit="1"
        name='file'
        accept=".xlsx"
        :headers="headers"
        :on-exceed="handleMoreThanLimit"
        :file-list="fileList"
        :show-file-list="false"
        :http-request="uploadOrgFile"
        style=" display: inline-block;"
      >
        <el-button
          type="success"
          style="width: 110px;height: 42px;"
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
        href="javascript:void(0);"
        @click="exportLog"
      >这里</a>，查看日志文件，了解详细的导入情况
    </p>
    <div class="dataImport-btn-group">
      <el-button
        style="width:150px; height:42px;"
        @click="$emit('close-dialog')"
      >取消</el-button>
      <el-button
        type="primary"
        @click="handleInportOrg"
        style="margin-left: 67px;width:150px; height:42px;"
      >确定</el-button>
    </div>
  </div>
</template>

<script>
import { $api } from '@/config';
import { uploadFile } from '@/api';
import { releaseFileStream } from '@/utils';
import { dowldOrgTem, exportLog } from '@/api/orgConfiguration';
export default {
  name: '',
  props: {
    departParentid: {
      type: [String, Number],
      default: ''
    }
  },
  components: {},
  data () {
    return {
      fileList: [],
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      logUrl: '',
      inportFile: null,
      operFileIconClass: 'el-icon-circle-check'
    };
  },
  methods: {
    handleMoreThanLimit () {
      this.$message({
        type: 'error',
        message: '上传文件已存在，且每次只能上传一个文件'
      });
    },
    uploadOrgFile (f) {
      this.inportFile = f.file;
    },
    // 导入组织机构
    handleInportOrg () {
      if (this.inportFile === null) {
        return this.$message({
          type: 'error',
          message: '请上传组织机构数据!'
        });
      }
      let pId = this.departParentid ? this.departParentid : -1;
      uploadFile($api + '/depart/importDepart?departId=' + pId, this.inportFile).then((res) => {
        if (res && res.data) {
          this.logUrl = res.data.path;
          this.$message({
            type: 'success',
            message: '组织机构数据上传成功，请查看日志是否导入成功!'
          });
        } else {
          this.$message({
            type: 'error',
            message: '组织机构数据上传失败!'
          });
        }
      });
    },
    // 下载模板
    handleDownload () {
      dowldOrgTem({
        fileName: ''
      }).then((res) => {
        releaseFileStream(res, '上传组织机构模板.xlsx');
      });
    },
    // 导出日志
    exportLog () {
      if (!this.logUrl) {
        return this.$message.error('暂无可查看日志，请上传组织机构数据');
      }
      exportLog(this.logUrl).then((res) => {
        releaseFileStream(res, '日志.txt');
      });
    },
    removeUploadFile () {
      this.inportFile = null;
      this.$refs.uploadTool.clearFiles();
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
