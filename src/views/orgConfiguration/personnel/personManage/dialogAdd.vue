<template>
  <!-- 编辑和添加 -->
  <div
    class="dialog dialog-person"
    v-if="dialogType!==2"
  >
    <el-form
      ref="dialogForm"
      :model="formData"
      :rules="rules"
      label-width="90px"
      v-show="!dialogAccount.visible"
    >
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item
            label="编号："
            prop="perCode"
          >
            <el-input
              v-model.trim="formData.perCode"
              placeholder="请输入编号"
              :disabled="!!dialogType"
              maxlength="30"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="姓名："
            prop="perName"
          >
            <el-input
              v-model.trim="formData.perName"
              placeholder="请输入姓名"
              maxlength="16"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="性别："
            prop="perSex"
            class="sex"
          >
            <el-select v-model="formData.perSex">
              <el-option
                value="0"
                label="男"
              ></el-option>
              <el-option
                value="1"
                label="女"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="出生日期："
            prop="perBirth"
            class="birthday"
          >
            <el-date-picker
              v-model.trim="formData.perBirth"
              type="date"
              placeholder="请选择日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="职务："
            prop="perTitle"
            class="job input-with-pend"
          >
            <el-input
              v-model.trim="formData.perTitle"
              placeholder="请输入职务"
              maxlength="16"
            >
              <el-button
                slot="append"
                icon="el-icon-plus"
                size="small"
                @click="handleAddJob"
              ></el-button>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="formData.perOtherTitleList&&formData.perOtherTitleList.length"
            class="job input-with-pend"
            prop="perOtherTitleList"
          >
            <div
              style="margin-bottom: 15px;"
              v-for="(item, index) in formData.perOtherTitleList"
              :key="index"
            >
              <el-input
                placeholder="请输入职务"
                v-model.trim="formData.perOtherTitleList[index].departTitle"
                maxlength="16"
              >
                <el-select
                  v-model.trim="formData.perOtherTitleList[index].depart"
                  slot="prepend"
                  filterable
                  clearable
                  placeholder="选择组织"
                  value-key="departId"
                >
                  <el-option
                    v-for="(orgItem, orgIndex) in orgList"
                    :key="orgIndex"
                    :label="orgItem.departName"
                    :value="orgItem"
                  ></el-option>
                </el-select>
                <el-button
                  slot="append"
                  icon="el-icon-minus"
                  size="small"
                  @click="handleDelJob(item, index)"
                ></el-button>
              </el-input>
            </div>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          class="right-box"
        >
          <el-upload
            action=""
            accept="image/png, image/jpeg"
            :before-upload="beforeAvatarUpload"
            :http-request="handleUpload"
            :show-file-list="false"
          >
            <el-col :span="11">
              <img
                :src="sourcePath+'/'+formData.perIcon"
                v-if="formData.perIcon"
              />
              <i
                v-else
                class="default-icon"
              >
                <img src="~@/assets/images/logo-bg.png">
              </i>
            </el-col>
            <el-col
              :span="11"
              class="btn-box"
            >
              <p class="tips">支持文件格式：jpg，png大小不能超过500kb!</p>
              <el-button
                size="small"
                type="success"
              >
                <i class="upload-img-icon"></i>&nbsp;上传照片
              </el-button>
            </el-col>
          </el-upload>
        </el-col>
      </el-row>

      <el-form-item
        label="住址："
        prop="perAddress"
        class="address input-with-pend"
      >
        <el-col :span="16">
          <el-input
            placeholder="请输入详细地址..."
            v-model.trim="formData.perAddress"
            maxlength="50"
          ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item
        style="margin-bottom:5px"
        label-width="0"
      > 主要联系方式： </el-form-item>
      <el-radio-group
        v-model.trim="formData.perMainContact"
        class="contact"
        size="medium"
      >
        <el-row :gutter="50">
          <el-col :span="8">
            <el-radio label="1">
              <el-form-item
                prop="perTelphone"
                label="手机"
                label-width="65px"
              >
                <el-input
                  v-model.trim="formData.perTelphone"
                  type="tel"
                  maxlength="11"
                ></el-input>
              </el-form-item>
            </el-radio>
          </el-col>
          <el-col :span="8">
            <el-radio label="4">
              <el-form-item
                prop="perHandPhone"
                label="手台"
                label-width="65px"
                maxlength="11"
              >
                <el-input v-model.trim="formData.perHandPhone"></el-input>
              </el-form-item>
            </el-radio>
          </el-col>
          <el-col :span="8">
            <el-radio label="5">
              <el-form-item
                prop="perWechat"
                label="微信"
                label-width="65px"
                maxlength="11"
              >
                <el-input v-model.trim="formData.perWechat"></el-input>
              </el-form-item>
            </el-radio>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="8">
            <el-radio label="2">
              <el-form-item
                prop="perOfficePhone"
                label="办公电话"
                label-width="65px"
                maxlength="20"
              >
                <el-input v-model.trim="formData.perOfficePhone"></el-input>
              </el-form-item>
            </el-radio>
          </el-col>
          <el-col :span="8">
            <el-radio label="3">
              <el-form-item
                prop="perHomePhone"
                label="家庭电话"
                label-width="65px"
                maxlength="20"
              >
                <el-input v-model.trim="formData.perHomePhone"></el-input>
              </el-form-item>
            </el-radio>
          </el-col>
          <el-col :span="8">
            <el-radio label="6">
              <el-form-item
                prop="perEmail"
                label="Email"
                label-width="65px"
                maxlength="64"
              >
                <el-input
                  v-model.trim="formData.perEmail"
                  type="email"
                ></el-input>
              </el-form-item>
            </el-radio>
          </el-col>
        </el-row>
      </el-radio-group>
      <el-form-item>
        <el-checkbox
          v-model.trim="formData.sorted"
          label="是否置顶"
          name="type"
          :true-label="0"
          :false-label="formData.sorted?formData.sorted:-1"
        ></el-checkbox>
        <el-checkbox
          v-if="$isHasBtnId('accountManage.add')&&!dialogType"
          v-model.trim="formData.createAccount"
          label="同时创建账号"
          name="type"
        ></el-checkbox>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
      v-show="!dialogAccount.visible"
    >
      <el-button @click="cancel">取 消</el-button>
      <el-button
        @click="ensure('dialogForm')"
        type="primary"
      >确 定</el-button>
    </div>
    <dialog-account
      ref="account"
      :show.sync="dialogAccount.visible"
      v-if="dialogAccount.visible"
      v-bind="$attrs"
      :row-data="dialogAccount.data"
      :dialog-type="dialogAccount.type"
      @oper-success="handleEnsureAndAccountCb"
      @go-back="handelGoBack"
    ></dialog-account>
  </div>
  <!-- 详情 -->
  <div
    class="dialog dialog-see"
    v-else
  >
    <el-form
      :model="formData"
      label-width="90px"
      ref="dialogForm"
      disabled
    >
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item label="编号：">
            <output>{{formData.perCode}}</output>
          </el-form-item>
          <el-form-item label="姓名：">
            <output>{{formData.perName}}</output>
          </el-form-item>
          <el-form-item
            label="性别："
            class="sex"
          >
            <output>{{formData.perSex==='0'?'男':'女'}}</output>
          </el-form-item>
          <el-form-item
            label="出生日期："
            class="birthday"
          >
            <output>{{formData.perBirth}}</output>
          </el-form-item>
          <el-form-item
            label="职务："
            class="job input-with-pend"
          >
            <output>{{formData.perTitle}}</output>
          </el-form-item>
          <el-form-item
            v-if="formData.perOtherTitleList&&formData.perOtherTitleList.length"
            class="job input-with-pend"
          >
            <div
              style="margin-bottom: 15px;"
              v-for="(item, index) in formData.perOtherTitleList"
              :key="index"
              class="other-title"
            >
              <output>{{formData.perOtherTitleList[index].depart.departName}}</output>
              <output>{{formData.perOtherTitleList[index].departTitle}}</output>
            </div>
          </el-form-item>
        </el-col>
        <el-col
          :span="6"
          :offset="2"
          class="right-box"
        >
          <el-upload
            action=""
            :before-upload="beforeAvatarUpload"
            :http-request="handleUpload"
            :show-file-list="false"
          >
            <el-col>
              <img
                :src="sourcePath+'/'+formData.perIcon"
                v-if="formData.perIcon"
              />
              <i
                v-else
                class="default-icon"
              >
                <img src="~@/assets/images/logo-bg.png">
              </i>
            </el-col>
          </el-upload>
        </el-col>
      </el-row>

      <el-form-item
        label="住址："
        class="address input-with-pend"
      >
        <el-col :span="16">
          <output>{{formData.perAddress}}</output>
        </el-col>
      </el-form-item>
      <el-form-item
        style="margin-bottom:5px"
        label-width="0"
      >主要联系方式：</el-form-item>
      <el-radio-group
        v-model.trim="formData.perMainContact"
        class="contact"
        size="medium"
      >
        <el-row :gutter="50">
          <el-col :span="8">
            <el-radio label="1">
              <el-form-item
                label="手机"
                label-width="65px"
              >
                <el-input
                  v-model.trim="formData.perTelphone"
                  type="tel"
                  maxlength="11"
                ></el-input>
              </el-form-item>
            </el-radio>
          </el-col>
          <el-col :span="8">
            <el-radio label="4">
              <el-form-item
                label="手台"
                label-width="65px"
              >
                <el-input v-model.trim="formData.perHandPhone"></el-input>
              </el-form-item>
            </el-radio>
          </el-col>
          <el-col :span="8">
            <el-radio label="5">
              <el-form-item
                label="微信"
                label-width="65px"
              >
                <el-input v-model.trim="formData.perWechat"></el-input>
              </el-form-item>
            </el-radio>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="8">
            <el-radio label="2">
              <el-form-item
                label="办公电话"
                label-width="65px"
              >
                <el-input v-model.trim="formData.perOfficePhone"></el-input>
              </el-form-item>
            </el-radio>
          </el-col>
          <el-col :span="8">
            <el-radio label="3">
              <el-form-item
                label="家庭电话"
                label-width="65px"
              >
                <el-input v-model.trim="formData.perHomePhone"></el-input>
              </el-form-item>
            </el-radio>
          </el-col>
          <el-col :span="8">
            <el-radio label="6">
              <el-form-item
                label="Email"
                label-width="65px"
              >
                <el-input
                  v-model.trim="formData.perEmail"
                  type="email"
                ></el-input>
              </el-form-item>
            </el-radio>
          </el-col>
        </el-row>
      </el-radio-group>
      <el-form-item
        label="是否置顶："
        class="to-top"
      >
        {{formData.sorted===0?'是':'否'}}
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 导入服务
import { $getPersonDetail, $addPersonList, $modPersonDetail } from '@/api/personManage';
import { uploadFile as $uploadFile } from '@/api/';
import { $file, $source } from '@/config';
// 导入utils
import { isPhoneNum as _isPhoneNum, checkLandlineNum as _checkLandlineNum, _deepClone, checkLetterAndChinese } from '@/utils/mtiUtils';
// 组件-doalog账号
import dialogAccount from './operAccount.vue';
export default {
  components: { dialogAccount },
  mixins: [],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    dialogType: {// 0-添加；1-编辑；2-查看;-1添加-同时创建账号
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => {
        return {};
      }
    },
    orgList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    contactTypeDict: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data () {
    let checkTel = (rule, value, callback) => {
      if (value && !_isPhoneNum(value)) {
        callback(new Error('手机号输入有误'));
      } else {
        callback();
      }
    };
    let checkHomeTel = (rule, value, callback) => {
      if (value && (!_isPhoneNum(value) || !_checkLandlineNum(value))) {
        callback(new Error('联系方式不合法'));
      } else {
        callback();
      }
    };
    let checkPerName = (rule, value, callback) => {
      if (value && !checkLetterAndChinese(value)) {
        callback(new Error('人员姓名由汉字或字母组成'));
      } else {
        callback();
      }
    };
    return {
      sourcePath: $source,
      dialogAccount: {
        visible: false,
        type: -1, // 0-账户授权(只创建账号)，-1-同时创建账号
        data: {}
      },
      formData: {
        perOtherTitleList: []
      },
      rules: {
        perCode: [
          { required: true, message: '请输入编号', trigger: 'blur' },
          { min: 2, max: 64, message: '2~64位字符', trigger: ['change', 'blur'] }
        ],
        perName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 16, message: '2~16位字符', trigger: ['change', 'blur'] },
          { validator: checkPerName, trigger: ['change', 'blur'] }
        ],
        perTitle: [
          { required: true, message: '请输入职务', trigger: 'blur' },
          { min: 2, max: 20, message: '2~20位字符', trigger: ['change', 'blur'] }
        ],
        perAddress: [{ min: 2, max: 50, message: '2~50位字符', trigger: 'blur' }],
        perTelphone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkTel, trigger: ['change', 'blur'] }
        ],
        perHandPhone: [
          { required: this.data.perMainContact === '4', message: '主要联系方式必填', trigger: 'blur' },
          { pattern: /^.{2,32}$/, message: '2~32位字符', trigger: ['change', 'blur'] }
        ],
        perWechat: [
          { required: this.data.perMainContact === '5', message: '主要联系方式必填', trigger: 'blur' },
          { validator: checkTel, message: '11位数字(手机号码)', trigger: ['change', 'blur'] }
        ],
        perOfficePhone: [
          { required: this.data.perMainContact === '2', message: '主要联系方式必填', trigger: 'blur' },
          { validator: checkHomeTel, trigger: ['change', 'blur'] }
        ],
        perHomePhone: [
          { required: this.data.perMainContact === '3', message: '主要联系方式必填', trigger: 'blur' },
          { validator: checkHomeTel, trigger: ['change', 'blur'] }
        ],
        perEmail: [
          { required: this.data.perMainContact === '6', message: '主要联系方式必填', trigger: 'blur' },
          { type: 'email', message: 'email不合法', trigger: ['change', 'blur'] }
        ]
      }
    };
  },
  computed: {},
  watch: {
    'formData.perMainContact' (val) {
      this.rules.perHandPhone[0].required = val === '4';
      this.rules.perWechat[0].required = val === '5';
      this.rules.perOfficePhone[0].required = val === '2';
      this.rules.perHomePhone[0].required = val === '3';
      this.rules.perEmail[0].required = val === '6';
      let concatList = [];
      for (let key in this.contactTypeDict) {
        const item = this.contactTypeDict[key];
        if (key > 1) {
          concatList.push(item.value);
        }
      }
      this.$refs['dialogForm'].clearValidate(concatList);// 先清空校验
      concatList.forEach((item) => {
        if (this.formData[item]) { // 如果有值，进行校验
          this.$refs['dialogForm'].validateField(item);
        }
      });
    }
  },
  created () {
    // 初始化表格数据
    const initFormDataDetail = (data) => {
      let temp = _deepClone(data, true);
      temp.createAccount = false;
      // 反解其他职务
      temp.perOtherTitleList = [];
      if (temp.perHasOtherTitle && temp.personTitle) {
        temp.personTitle.forEach((item) => {
          temp.perOtherTitleList.push({
            departTitle: item.departTitle,
            depart: this.orgList.filter((itemOrg) => {
              return itemOrg.departId === item.departId;
            })[0]
          });
        });
      }
      return temp;
    };
    // 初始化表格数据-添加
    const initFormDataAdd = (data) => { // 使用return方式添加或者$set方式，否则对象上添加的属性不触发视图更新
      let temp = _deepClone(data, true);
      temp.createAccount = false;
      temp.perOtherTitleList = [];
      return temp;
    };
    // 获取dialog数据
    if (this.dialogType) { // 详情和编辑
      $getPersonDetail({
        perDepartId: this.data.perDepartId,
        perId: this.data.perId
      }).then((res) => {
        if (res.code === '000000') {
          this.formData = initFormDataDetail(res.data);
          // 数据渲染完成要先清楚校验-async的数据，绑定到页面时会触发change引发的校验
          this.$refs['dialogForm'] && this.$nextTick(() => {
            this.$refs['dialogForm'].clearValidate();
          });
        } else {
          this.$message.error(`查询失败：${res.message}`);
        }
      });
    } else { // 添加
      this.formData = initFormDataAdd(this.data);
    }
  },
  mounted () { },
  destroyed () { },
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
          this.formData.perIcon = res.data.path;
        } else {
          this.$message.error(`上传失败：${res.message}`);
        }
      });
    },
    // 点击添加职务
    handleAddJob () {
      this.formData.perOtherTitleList.push({
        departTitle: '',
        depart: {}
      });
    },
    // 点击删除职务
    handleDelJob (item, index) {
      this.formData.perOtherTitleList.splice(index, 1);
    },
    // 点击取消
    cancel () {
      this.$emit('update:show', false);
    },
    // 点击确定
    ensure (formName) {
      this.$refs[formName].validate((valid, invalidObj) => {
        if (!valid) return false;
        // 校验通过
        const reqData = {
          perDepartId: this.formData.perDepartId,
          perCode: this.formData.perCode,
          perName: this.formData.perName,
          perSex: this.formData.perSex,
          perBirth: this.formData.perBirth,
          perTitle: this.formData.perTitle,
          personTitle: this.getpersonTitle(this.formData.perOtherTitleList),
          perAddress: this.formData.perAddress,
          perMainContact: this.formData.perMainContact,
          perTelphone: this.formData.perTelphone,
          perHandPhone: this.formData.perHandPhone,
          perWechat: this.formData.perWechat,
          perOfficePhone: this.formData.perOfficePhone,
          perHomePhone: this.formData.perHomePhone,
          perEmail: this.formData.perEmail,
          sorted: this.formData.sorted === -1 ? this.formData.perId : this.formData.sorted,
          perIcon: this.formData.perIcon
        };
        reqData.perHasOtherTitle = reqData.personTitle && !!reqData.personTitle.length ? 1 : 0;
        this.reqData = _deepClone(reqData);

        if (this.formData.createAccount) { // 同时创建账号
          this.dialogAccount = {
            visible: true,
            type: -1,
            data: this.reqData// 传入account
          };
          this.$emit('update:dialogType', -1);
          this.$refs[formName].clearValidate();// 验证通过清除验证
        } else { // 不创建账号
          this.ensureSubmit();
        }
      });
    },
    // 确定提交
    ensureSubmit () {
      if (this.dialogType === 0) { // 添加
        $addPersonList({ userVo: null, personVo: this.reqData }).then((res) => {
          if (res.code === '000000') {
            this.$message.success('添加成功');
            this.$emit('update:show', false);
            this.$emit('ensure-add-cb');
          } else {
            this.$message.error(`添加失败：${res.message}`);
          }
        });
      } else {
        this.reqData.perId = this.formData.perId;
        $modPersonDetail(this.reqData).then((res) => {
          if (res.code === '000000') {
            this.$message.success('修改成功');
            this.$emit('update:show', false);
            this.$emit('ensure-add-cb');
          } else {
            this.$message.error(`修改失败：${res.message}`);
          }
        });
      }
    },
    // 处理其他职务
    getpersonTitle (list = []) {
      let temp = [];
      list.forEach((item) => {
        if (item.depart.departId && item.departTitle) {
          temp.push({
            departTitle: item.departTitle,
            departId: item.depart.departId,
            departName: item.depart.departName
          });
        }
      });
      return temp;
    },
    // 点击返回
    handelGoBack () {
      this.$emit('update:dialogType', 0);
      this.dialogAccount.visible = false;
    },
    // 点击确定-同时创建账号的回调
    handleEnsureAndAccountCb () {
      this.$emit('ensure-add-cb');
      this.$emit('update:show', false);
    }
  }
};
</script>
<style lang="scss" scoped>
$imgUrl: '~@/assets/images/common';
.el-dialog {
  .birthday {
    .el-input {
      width: 100%;
    }
  }
  .right-box {
    box-sizing: border-box;

    $img_h: 204px;
    img,
    i.default-icon {
      display: inline-block;
      width: 154px;
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
      padding-top: 100px;
      p.tips {
        width: 182px;
        height: 47px;
        margin-bottom: 20px;
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

.sex .el-select {
  width: 100%;
}

.address,
.job {
  .el-select {
    width: 145px;
  }
}
.contact {
  .el-row {
    margin-bottom: 20px;

    .el-radio {
      .el-form-item {
        margin: 0px;
        display: inline-block;
      }
      .el-input {
        width: 149px;
        height: 42px;
      }
    }
  }
}
.dialog-see {
  output {
    display: inline-block;
    width: 100%;
    height: 40px;
    font-size: inherit;
    line-height: 38px;
    padding: 0 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    background-color: #fff;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  .other-title {
    output {
      &:first-child {
        width: 145px;
        border-right: 0 none;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      &:last-child {
        width: 166px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
}
</style>
