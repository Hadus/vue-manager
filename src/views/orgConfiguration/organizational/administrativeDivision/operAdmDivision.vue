/*
* @Author: liuhuitao
* @Date: 2019-08-09 14:18:01
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-08-28 17:23:199
* @description: 操作行政区划表单
*/
<template>
  <div>
    <el-form
      label-width="80px"
      :model="addAdmDivisonForm"
      :rules="addAdmDivisonFormRules"
      ref="admDivision"
    >
      <el-form-item
        label="行政编码"
        prop="code"
      >
        <el-input
          v-model="addAdmDivisonForm.code"
          maxlength="30"
          placeholder="请输入行政区划编码"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="名 称"
        prop="name"
      >
        <el-input
          v-model="addAdmDivisonForm.name"
          maxlength="40"
          placeholder="请输入行政区划名称"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="简 称"
        prop="abbreviation"
      >
        <el-input
          v-model="addAdmDivisonForm.abbreviation"
          maxlength="40"
          placeholder="请输入行政区划简称"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="区域等级"
        prop="regionalLevel"
      >
        <el-select
          v-model="addAdmDivisonForm.regionalLevel"
          placeholder="请选择区域等级类型"
          style="width:100%;"
        >
          <!-- <el-option label="请选择组织类型" value="0"></el-option> -->
          <el-option
            v-for="(item, index) in regionalLevelGroup"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="配置范围"
        prop="configRange"
      >
        <div style="display:flex;flex-flow:row nowrap;align-item:center;">
          <el-input
            v-model="addAdmDivisonForm.configRange"
            :readonly="true"
            maxlength="100"
            placeholder="请上传行政区划图层"
          ></el-input>
          <el-upload
            class="upload-demo"
            ref="uploadTool"
            action=""
            :limit="1"
            name='file'
            accept=".json"
            :http-request="uploadAreaJsonFile"
            :headers="headers"
            :show-file-list="false"
            :file-list="fileList"
            style="display: inline-block;"
          >
            <el-button
              type="success"
              style="width: 110px;height: 42px;margin-left:48px;"
            ><i
                class="customize-icon upload-icon"
                style="background-size: 100% 100%;"
              ></i> 上传文件</el-button>
          </el-upload>
        </div>
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
import { $file } from '@/config';
import { uploadFile } from '@/api';
import { addAdmDiv, editAdmDiv } from '@/api/orgConfiguration';
import { checkLetChinNumUnder, checkNumLetter } from '@/utils/mtiUtils';
export default {
  name: 'operAdmDivision',
  props: {
    rowData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    parentId: {
      type: Number,
      default: -1
    },
    regionalLevelGroup: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  components: {},
  data () {
    let checkAreaName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入行政区划全称'));
      } else if (!checkLetChinNumUnder(value)) {
        callback(new Error('行政区划全称由汉字、数字、字母或下划线组成'));
      } else {
        callback();
      }
    };
    let checkAreaAbbrev = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback();
      } else if (!checkLetChinNumUnder(value)) {
        callback(new Error('行政区划简称由汉字、数字、字母或下划线组成'));
      } else {
        callback();
      }
    };
    let checkAreaCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入行政区划编码'));
      } else if (!checkNumLetter(value)) {
        callback(new Error('行政编码由数字或字母组成'));
      } else {
        callback();
      }
    };
    return {
      addAdmDivisonForm: {
        name: '',
        code: '',
        abbreviation: '', // 简称
        regionalLevel: '10', // 区域等级(10:国家级,11:省/直辖市/自治区级 12:地市级,13:区/县级,14:乡镇/街道级,15:村/社区级)
        configRange: ''
      },
      addAdmDivisonFormRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur' },
          { validator: checkAreaName, trigger: 'change' }
        ],
        abbreviation: [
          { required: true, message: '请输入简称', trigger: 'blur' },
          { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur' },
          { validator: checkAreaAbbrev, trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入行政编码', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' },
          { validator: checkAreaCode, trigger: 'change' }
        ],
        regionalLevel: [
          { required: true, message: '请选择区域等级', trigger: 'blur' }
        ],
        configRange: [
          { required: true, message: '请上传行政区划图层', trigger: 'change' },
          { min: 3, max: 200, message: '长度在 3 到 200 个字符', trigger: 'blur' }
        ]
      },
      currentOperType: 'add',

      fileList: [],
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
  },
  watch: {},
  computed: {},
  created () {
    this.initOperOrgNatForm();
  },
  mounted () { },
  beforeDestroy () {
    this.$refs.admDivision.resetFields();
  },
  methods: {
    uploadAreaJsonFile (f) {
      this.$refs.uploadTool.clearFiles();
      uploadFile($file + '/uploadFilesToFast', f.file).then((res) => {
        if (res && res.data) {
          this.addAdmDivisonForm.configRange = res.data.path;
          this.$message({
            type: 'success',
            message: '文件上传成功!'
          });
        } else {
          this.$message({
            type: 'error',
            message: '文件上传失败!'
          });
        }
      });
    },
    initOperOrgNatForm () {
      if (Object.keys(this.rowData).length === 0) {
        this.currentOperType = 'add';
      } else {
        this.currentOperType = 'edit';
        this.addAdmDivisonForm.name = this.rowData.areaFullName;
        this.addAdmDivisonForm.code = this.rowData.areaCode;
        this.addAdmDivisonForm.abbreviation = this.rowData.areaName;
        this.addAdmDivisonForm.regionalLevel = this.rowData.areaLevel;
        this.addAdmDivisonForm.configRange = this.rowData.areaJsonUrl;
      }
    },
    handleDetermine () {
      this.$refs['admDivision'].validate((valid) => {
        if (valid) {
          if (this.currentOperType === 'add') {
            this.handleAddAdmDiv();
          } else {
            this.handleEditAdmDiv();
          }
        } else {
          return this.$message({
            type: 'error',
            message: '行政区划信息未按规定录入!'
          });
        }
      });
    },
    // 新增行政区划
    handleAddAdmDiv () {
      addAdmDiv({
        areaFullName: this.addAdmDivisonForm.name,
        areaName: this.addAdmDivisonForm.abbreviation,
        areaCode: this.addAdmDivisonForm.code,
        areaLevel: this.addAdmDivisonForm.regionalLevel,
        areaJsonUrl: this.addAdmDivisonForm.configRange,
        parentId: this.parentId
      }).then((res) => {
        if (res && res.data) {
          this.$message({
            type: 'success',
            message: '新增成功!'
          });
          let timer = setTimeout(() => {
            this.$emit('oper-success', res.data.parentId, res.data.areaId);
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
    // 修改行政区划
    handleEditAdmDiv () {
      // parentId: this.parentId,
      editAdmDiv({
        areaFullName: this.addAdmDivisonForm.name,
        areaName: this.addAdmDivisonForm.abbreviation,
        areaCode: this.addAdmDivisonForm.code,
        areaLevel: this.addAdmDivisonForm.regionalLevel,
        areaJsonUrl: this.addAdmDivisonForm.configRange,
        areaId: this.rowData.areaId
      }).then((res) => {
        if (res && res.data) {
          this.$message({
            type: 'success',
            message: '编辑成功!'
          });
          let timer = setTimeout(() => {
            this.$emit('oper-success', this.rowData.parentId, this.rowData.areaId);
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
.admDivison-btn-group {
  @include flex(row);
  justify-content: center;
}
</style>
