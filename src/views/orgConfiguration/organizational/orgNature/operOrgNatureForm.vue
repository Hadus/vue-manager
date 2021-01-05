/*
* @Author: liuhuitao
* @Date: 2019-08-09 14:18:01
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-08-28 15:25:333
* @description: 新增、编辑组织性质表单
*/
<template>
  <div>
    <el-form
      label-width="60px"
      :model="addOrgNatureForm"
      :rules="addOrgNatureFormRules"
      ref="operOrgNatureForm"
    >
      <el-form-item
        label="名 称"
        prop="name"
      >
        <el-input
          v-model="addOrgNatureForm.name"
          maxlength="40"
          placeholder="请输入组织性质名称"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="编 码"
        prop="code"
      >
        <el-input
          v-model="addOrgNatureForm.code"
          maxlength="30"
          placeholder="请输入组织性质编码"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="排 序"
        prop="dictSorted"
      >
        <el-input
          v-model="addOrgNatureForm.dictSorted"
          min="1"
          maxlength="16"
          placeholder="请输入排序序号"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="描 述"
        prop="desc"
      >
        <el-input
          type="textarea"
          v-model="addOrgNatureForm.desc"
          maxlength="100"
          placeholder="请输入组织性质描述内容"
          rows="3"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="orgNature-btn-group">
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
import { addOrgNature, editOrgNature } from '@/api/orgConfiguration';
import { checkNumLetter, checkLetChinNumUnder } from '@/utils/mtiUtils';
export default {
  name: 'operOrgNatureForm',
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
    let checkedDepartNatureCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入代码'));
      } else if (!checkNumLetter(value)) {
        callback(new Error('编码由数字、字母组成'));
      } else {
        callback();
      }
    };
    let checkedDepartNatureName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入组织性质名称'));
      } else if (!checkLetChinNumUnder(value)) {
        callback(new Error('组织性质名称由汉字、数字、字母或下划线组成'));
      } else {
        callback();
      }
    };
    return {
      currentOperType: 'add',
      addOrgNatureForm: {
        name: '',
        code: '',
        dictSorted: 1,
        desc: ''
      },
      addOrgNatureFormRules: {
        name: [
          { required: true, message: '请输入组织性质名称', trigger: 'blur' },
          { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur' },
          { validator: checkedDepartNatureName, trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入组织性质编码', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' },
          { validator: checkedDepartNatureCode, trigger: 'change' }
        ],
        dictSorted: [
          { pattern: /^[0-9]*$/, message: '排序序号只能为数字', trigger: 'change' }
        ],
        desc: [
          {
            max: 100,
            message: '描述内容最大长度为 100 个字符',
            trigger: 'blur'
          }
        ]
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
    this.$refs['operOrgNatureForm'].resetFields();
  },
  methods: {
    initOperOrgNatForm () {
      if (Object.keys(this.rowData).length === 0) {
        this.currentOperType = 'add';
      } else {
        this.currentOperType = 'edit';
        this.addOrgNatureForm.name = this.rowData.dictName;
        this.addOrgNatureForm.desc = this.rowData.dictDesc;
        this.addOrgNatureForm.code = this.rowData.dictCode;
        this.addOrgNatureForm.dictSorted = this.rowData.dictSorted;
      }
    },
    handleDetermine () {
      this.$refs['operOrgNatureForm'].validate((valid) => {
        if (valid) {
          if (this.currentOperType === 'add') {
            this.handleAddOrgNature();
          } else {
            this.handleEditOrgNature();
          }
        } else {
          this.$message({
            type: 'error',
            message: '组织性质信息未按规定录入'
          });
          return false;
        }
      });
    },
    // 新增组织性质
    handleAddOrgNature () {
      addOrgNature({
        dictName: this.addOrgNatureForm.name,
        dictCode: this.addOrgNatureForm.code,
        dictSorted: Number(this.addOrgNatureForm.dictSorted),
        dictType: 'DEPART_NATURE',
        dictDesc: this.addOrgNatureForm.desc
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
    // 修改组织性质
    handleEditOrgNature () {
      editOrgNature({
        dictName: this.addOrgNatureForm.name,
        dictCode: this.addOrgNatureForm.code,
        dictSorted: Number(this.addOrgNatureForm.dictSorted),
        appCode: 'uum',
        dictType: 'DEPART_NATURE',
        dictDesc: this.addOrgNatureForm.desc,
        dictId: this.rowData.dictId
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
.orgNature-btn-group {
  @include flex(row);
  justify-content: center;
}
</style>
