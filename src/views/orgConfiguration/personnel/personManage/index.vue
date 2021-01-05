<template>
  <div>
    <div class="main-container">
      <!-- 左侧 -->
      <div class="left-panel">
        <div class="l-title-bar">
          <span>
            <i class="customize-icon org-icon"></i> 人员管理
          </span>
        </div>
        <!-- 左侧查询树 -->
        <div class="tree-panel">
          <mti-tree
            :tree-list="treeList"
            :search="true"
            :icon="true"
            :isShowDisableMark="true"
            node-key="departId"
            :default-props="{label: 'departFullName'}"
            @onNodeClick="handleNodeClick"
          ></mti-tree>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="right-panel">
        <div class="r-title-bar">
          <span>
            <i class="customize-icon list-icon"></i> 人员列表
          </span>
          <span
            @click="handleAdd"
            v-if="$isHasBtnId('personManage.add')"
          >
            <i class="customize-icon add-icon"></i>
          </span>
        </div>
        <!-- 下级组织内容 -->
        <div class="content-panel">
          <div class="bottom-tb">
            <div class="search-from">
              <el-input
                placeholder="输入关键字查询"
                v-model.trim="searchConditionTable.keywords"
                @keyup.enter.native="handleQuery"
                maxlength="32"
                style="width:276px;"
              >
                <i
                  class="search-icon"
                  slot="suffix"
                  @click="handleQuery"
                  style="position:absolute;right:10px;top:10px;z-index:10"
                ></i>
              </el-input>
              <div>
                <el-button
                  type="success"
                  size="medium"
                  @click="importExcel"
                  v-if="$isHasBtnId('personManage.import')"
                >
                  <i class="customize-icon import-icon"></i>
                  &nbsp;&nbsp;导入
                </el-button>
                <el-button
                  type="warning"
                  size="medium"
                  @click="exportExcel"
                  v-if="$isHasBtnId('personManage.export')"
                >
                  <i class="customize-icon export-icon"></i>
                  &nbsp;&nbsp;导出
                </el-button>
              </div>
            </div>
            <div class="det-tb">
              <el-table
                :data="tableList"
                highlight-current-row
                border
                stripe
                :header-row-style="{ color: '#333333'}"
                :header-cell-style="{ backgroundColor: '#F8F8F8' }"
                height="100%"
                v-loading="personLoading"
              >
                <el-table-column
                  type="index"
                  :index="getIndex"
                  label="序号"
                  width="80"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="perCode"
                  label="编号"
                  width="120"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="perName"
                  label="姓名"
                  width="180"
                  align="center"
                ></el-table-column>
                <el-table-column
                  label="职务"
                  align="center"
                >
                  <template slot-scope="{row}">
                    <el-popover
                      placement="top-start"
                      width="240"
                      trigger="hover"
                      :open-delay="600"
                      popper-class="popover-title"
                      :disabled="!row.perHasOtherTitle||!row.personTitle||!row.personTitle.length"
                    >
                      <div class="popover-box">
                        <h4>其他职务</h4>
                        <p
                          v-for="(item,index) in row.personTitle"
                          :key="index"
                        >
                          <span class="depart-name">{{item.departName}}</span>：
                          <span class="depart-title">{{item.departTitle}}</span>
                        </p>
                        <p>
                        </p>
                      </div>
                      <span slot="reference">{{row.perTitle}}
                        <i
                          class="el-icon-info"
                          v-if="row.personTitle.length"
                          style="color: #409EFF;cursor: text"
                        ></i>
                      </span>
                    </el-popover>
                  </template>
                </el-table-column>

                <el-table-column
                  label-class-name="
                        contact-type-head"
                  class-name="contact-type-body"
                  width="270"
                  align="left"
                >
                  <template
                    slot="header"
                    slot-scope="{}"
                  >
                    <el-dropdown
                      trigger="click"
                      @command="changeContactType"
                    >
                      <span class="el-dropdown-link">
                        {{ tableCurContact.text }}
                        <i class="el-icon-arrow-down"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item disabled>请选择</el-dropdown-item>
                        <el-dropdown-item
                          v-for="(typeItem,
                      typeKey) in contactTypeDict"
                          :command="typeItem"
                          :key="typeKey"
                        >
                          <i :class="'type-'+typeKey"></i>
                          {{ typeItem.text }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>

                  <template
                    slot-scope="{row}"
                    v-if="row.perMainContact"
                  >
                    <span v-if="tableCurContact.value === 'perMainContact'">
                      <!-- 不加||'0'这个会报Cannot read property 'key' of undefined" -->
                      <i
                        :class="'type-'+contactTypeDict[row['perMainContact']||'0'].key"
                        style="margin:0 25px 0 20px"
                      ></i>
                      <span>
                        {{row[contactTypeDict[row['perMainContact']].value]}}
                      </span>
                    </span>
                    <span v-else>
                      <i
                        :class="'type-'+tableCurContact.key"
                        style="margin:0 25px 0 20px"
                        v-if="row[tableCurContact.value]"
                      ></i>
                      <span>
                        {{row[tableCurContact.value]}}
                      </span>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="操作"
                  width="180"
                  class-name="operate"
                  align="center"
                >
                  <template slot-scope="{row,$index:listIndex}">
                    <el-button
                      @click="handleSee(row,listIndex)"
                      type="text"
                      size="medium"
                      class="drop-more"
                    >详情</el-button>

                    <el-dropdown
                      trigger="click"
                      @command="changeOperateMore"
                      class-name="more"
                      class="more"
                      v-if="row.moreDropdownItemListLength!==0"
                    >
                      <el-button
                        type="text"
                        size="medium"
                      >
                        更多
                        <i class="el-icon-arrow-down"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          v-for="(item, index) in getMoreDropdownItemList(row,listIndex)"
                          :key="index"
                          :command="{ row, command: item.name, listIndex}"
                        >
                          <i :class="item.iconClass"></i>
                          {{item.title}}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-pagination
              background
              :current-page="currentPage"
              :page-sizes="[10, 20, 40, 60, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </div>
      </div>
      <!-- dialog-新增人员/修改人员 -->
      <mti-dialog
        :show.sync="dialogAdd.visible"
        :width="'895px'"
        :title="`${dialogAdd.typeText}${dialogAdd.type===2?'—'+dialogAdd.data.perName:''}（${departName}）`"
        @close-dialog="dialogAdd.visible = false"
      >
        <dialog-add
          v-if="dialogAdd.visible"
          :show.sync="dialogAdd.visible"
          :data="dialogAdd.data"
          :org-list="orgList"
          :dialog-type.sync="dialogAdd.type"
          :sys-app-list="sysAppList"
          :selected-depart-id="searchConditionTable.departId"
          :contact-type-dict="contactTypeDict"
          @ensure-add-cb="initTableDataList"
        ></dialog-add>
      </mti-dialog>
      <!-- dialog-账号 -->
      <mti-dialog
        :show.sync="dialogAccount.visible"
        width="895px"
        :title="`账户授权—${dialogAccount.data.perName}（${departName}）`"
        @close-dialog="closeDialogAccount"
      >
        <dialog-account
          v-if="dialogAccount.visible"
          :show.sync="dialogAccount.visible"
          :dialog-type="dialogAccount.type"
          :sys-app-list="sysAppList"
          :row-data="dialogAccount.data"
          :selected-depart-id="searchConditionTable.departId"
          @oper-success="initTableDataList"
        ></dialog-account>
      </mti-dialog>
      <!-- dialog-数据导入 -->
      <mti-dialog
        :show.sync="dialogImport.visible"
        width="660px"
        :title="'数据导入（'+departName+'）'"
        @close-dialog="dialogImport.visible = false"
      >
        <dialog-import
          :show.sync="dialogImport.visible"
          :depart-id="searchConditionTable.departId"
          @ensure-import-cb="initTableDataList"
          v-if="dialogImport.visible"
        ></dialog-import>
      </mti-dialog>
    </div>
  </div>
</template>

<script>
// 组件-tree
import mtiTree from '@/components/tree';
// 组件-dialog
import mtiDialog from '@/components/dialog';
// 组件-dialog新增人员中的内容
import dialogAdd from './dialogAdd.vue';
// 组件-doalog导入数据
import dialogImport from './dataImport.vue';
// 组件-doalog账号
import dialogAccount from './operAccount.vue';

// 导入服务
import { $getOrgList, $getPersonList, $delPersonList, $modPersonDetail, $modPersonSorted, $exportPersonList } from '@/api/personManage';
// 导入utils
import { _deepClone, _listToTree } from '@/utils/mtiUtils';
import { releaseFileStream as _releaseFileStream } from '@/utils/';
import { getAppListData } from '@/api/app';
// 引入user-store
import { createNamespacedHelpers } from 'vuex';
const { mapState: mapStateFromUser } = createNamespacedHelpers('user');
export default {
  name: 'personnel-mangement',
  components: {
    mtiTree,
    mtiDialog,
    dialogAdd,
    dialogImport,
    dialogAccount
  },
  mixins: [],
  props: {},
  data () {
    return {
      searchConditionTable: {
        keywords: '',
        departId: null
      },
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      tableList: [],
      personLoading: true,
      departName: '',
      contactTypeDict: {},
      tableCurContact: {},
      orgList: [],
      treeList: [],
      dialogAdd: {
        title: '',
        visible: false,
        type: null, // 0-添加，1-编辑，2-详情,-1添加-同时创建账号
        data: this.initDialogAddData()
      },
      dialogAccount: {
        visible: false,
        type: 0, // 0-账户授权(只创建账号)，-1-同时创建账号
        data: {}
      },
      dialogImport: {
        visible: false
      }
    };
  },

  computed: {
    ...mapStateFromUser(['userName'])
  },
  watch: {
    'dialogAdd.type' (val) {
      let temp = '';
      switch (val) {
      case 0:
        temp = '新增人员';
        break;
      case 1:
        temp = '编辑人员';
        break;
      case 2:
        temp = '人员详情';
        break;
      case -1:
        temp = '添加人员—同时创建账号';
        break;
      default:
        temp = '';
      }

      this.dialogAdd.typeText = temp;
    }
  },
  created () {
    this.initTreeDataList();
    this.contactTypeDict = {
      0: {
        key: '0',
        text: '主要联系方式',
        value: 'perMainContact'
      },
      1: {
        key: '1',
        text: '手机',
        value: 'perTelphone'
      },
      4: {
        key: '4',
        text: '手台',
        value: 'perHandPhone'
      },
      5: {
        key: '5',
        text: '微信',
        value: 'perWechat'
      },
      2: {
        key: '2',
        text: '办公电话',
        value: 'perOfficePhone'
      },
      3: {
        key: '3',
        text: '家庭电话',
        value: 'perHomePhone'
      },
      6: {
        key: '6',
        text: 'Email',
        value: 'perEmail'
      }
    };
    this.tableCurContact = this.contactTypeDict[0];
  },
  mounted () {
    getAppListData({
      appLoginEndpoint: 'WEB'
    }).then((res) => {
      if (res && res.data) {
        this.sysAppList = res.data;
      } else {
        this.loading = false;
      }
    });
  },
  destroyed () { },
  methods: {
    // 初始化tree数据
    initTreeDataList () {
      $getOrgList().then((res) => {
        if (res.code === '000000') {
          this.orgList = res.data;
          const list = _listToTree(
            res.data,
            { rootId: -1, cname: 'children', cidname: 'departId', pidname: 'departParentId' }
          );
          this.treeList = list;
        } else {
          this.$message.error(`查询失败：${res.message}`);
        }
      });
    },
    // 初始化table数据--notSearchCondition是否有查询条件
    initTableDataList (notSearchCondition) {
      this.personLoading = true;
      let data = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        perDepartId: this.searchConditionTable.departId
      };

      if (!notSearchCondition) {
        data = Object.assign(data, {
          queryKey: this.searchConditionTable.keywords
        });
      }
      $getPersonList(data).then((res) => {
        if (res.code === '000000') {
          this.tableList = res.data.list;
          this.totalCount = res.data.totalCount;
        } else {
          this.$message.error(`查询失败：${res.message}`);
        }
        this.personLoading = false;
      });
    },
    // 初始化dialog-add数据
    initDialogAddData () {
      let temp = {
        perDepartId: '',
        perCode: '',
        perName: '',
        perSex: '1',
        perBirth: '',
        perTitle: '',
        perHasOtherTitle: 0, // 没有其他职位
        personTitle: [],
        perAddress: '',
        perMainContact: '1',
        perTelphone: '',
        perHandPhone: '',
        perWechat: '',
        perOfficePhone: '',
        perHomePhone: '',
        perEmail: '',
        sorted: -1, // 不置顶
        perIcon: ''
      };
      return temp;
    },
    // 查询数据
    handleQuery () {
      this.currentPage = 1;
      this.initTableDataList();
    },
    // 添加数据
    handleAdd () {
      if (!this.searchConditionTable.departId) {
        this.$message.error('人员数据必须挂接在组织机构下面，如果当前账号没有组织机构数据，请先导入组织机构！');
        return;
      }
      this.dialogAdd.type = 0;
      this.dialogAdd.visible = true;
      this.dialogAdd.data = this.initDialogAddData();
      this.dialogAdd.data.perDepartId = this.searchConditionTable.departId;
    },
    // 点击tree的节点
    handleNodeClick (data, node) {
      this.departName = data.departName;
      this.searchConditionTable.departId = data.departId;
      this.initTableDataList();
    },
    // 导入excel
    importExcel () {
      if (!this.searchConditionTable.departId) {
        this.$message.error('人员数据必须挂接在组织机构下面，如果当前账号没有组织机构数据，请先导入组织机构！');
        return;
      }
      this.dialogImport.visible = true;
    },
    // 导出excel*
    exportExcel () {
      $exportPersonList({ perDepartId: this.searchConditionTable.departId }).then((res) => {
        if (res) {
          this.$message.success('导出成功');
          _releaseFileStream(res, this.departName + '-人员列表.xlsx');
        } else {
          this.$message.error(`导出失败：${res.message}`);
        }
      });
    },
    // 选择联系方式
    changeContactType (command) {
      this.tableCurContact = command;
    },
    // 查看行详情
    handleSee (data) {
      this.dialogAdd.type = 2;
      this.dialogAdd.visible = true;
      this.dialogAdd.data = _deepClone(data, true);
    },
    // 获取more中的操作--项
    getMoreDropdownItemList (row, listIndex) {
      const temp = [
        { title: '账号授权', show: this.$isHasBtnId('personManage.auth') && !row.userId, name: 'Auth', iconClass: 'authorization' },
        { title: '置顶', show: this.$isHasBtnId('personManage.toTop') && row.sorted !== 0, name: 'Totop', iconClass: 'top' },
        { title: '取消置顶', show: this.$isHasBtnId('personManage.cancelToTop') && row.sorted === 0, name: 'CancelTotop', iconClass: 'top' },
        { title: '上移', show: this.$isHasBtnId('personManage.moveUp') && listIndex !== 0 && !(this.$isHasBtnId('personManage.cancelToTop') && row.sorted === 0), name: 'Up', iconClass: 'up' },
        { title: '下移', show: this.$isHasBtnId('personManage.moveDown') && listIndex !== this.tableList.length - 1 && !(this.$isHasBtnId('personManage.cancelToTop') && row.sorted === 0), name: 'Down', iconClass: 'down' },
        { title: '编辑', show: this.$isHasBtnId('personManage.edit'), name: 'Edit', iconClass: 'edit' },
        { title: '删除', show: this.$isHasBtnId('personManage.del'), name: 'Del', iconClass: 'delete' }
      ].filter((item) => {
        return item.show;
      });
      // 置顶状态不支持上移下移
      this.$set(row, 'moreDropdownItemListLength', temp.length);
      return temp;
    },
    // 选择more中的操作
    changeOperateMore ({ row, command, listIndex }) {
      this['operate' + command](row, listIndex);
    },
    // more-点击账户授权
    operateAuth (data) {
      if (data.userId && data.userId > 0) return;// 已有账户不允许授权
      this.dialogAccount.type = 0;
      this.dialogAccount.visible = true;
      this.dialogAccount.data = _deepClone(data, true);
    },
    // more-点击置顶
    operateTotop (data) {
      const params = {
        sorted: 0,
        perId: data.perId,
        perName: data.perName,
        perCode: data.perCode,
        perAddress: data.perAddress,
        perTitle: data.perTitle,
        perTelphone: data.perTelphone,
        perMainContact: data.perMainContact,
        perDepartId: data.perDepartId
      };
      $modPersonDetail(params).then((res) => {
        if (res.code === '000000') {
          this.$message.success('置顶成功');
          this.initTableDataList();
        } else {
          this.$message.error(`置顶失败：${res.message}`);
        }
      });
    },
    // more-点击取消置顶
    operateCancelTotop (data) {
      const params = {
        sorted: data.perId,
        perId: data.perId,
        perName: data.perName,
        perCode: data.perCode,
        perAddress: data.perAddress,
        perTitle: data.perTitle,
        perTelphone: data.perTelphone,
        perMainContact: data.perMainContact,
        perDepartId: data.perDepartId
      };
      $modPersonDetail(params).then((res) => {
        if (res.code === '000000') {
          this.$message.success('取消置顶成功');
          this.initTableDataList();
        } else {
          this.$message.error(`取消置顶失败：${res.message}`);
        }
      });
    },
    // 是否可上下移动
    getMoveDataList (currentIndex, targetIndex) {
      const currentItem = {
        perId: this.tableList[currentIndex].perId,
        sorted: this.tableList[targetIndex].sorted
      };
      const targetItem = {
        perId: this.tableList[targetIndex].perId,
        sorted: this.tableList[currentIndex].sorted
      };
      if ((currentItem.sorted && targetItem.sorted) || (!currentItem.sorted && !targetItem.sorted)) {
        return [currentItem, targetItem];
      } else {
        this.$message.error('移动失败：不能将 置顶人员 与 非置顶人员 调换位置');
        return false;
      }
    },
    // more-点击上移
    operateUp (data, listIndex) {
      if (listIndex === 0) return;
      const dataList = this.getMoveDataList(listIndex, listIndex - 1);
      if (!dataList) return;
      $modPersonSorted(dataList).then((res) => {
        if (res.code === '000000') {
          this.$message.success('上移成功');
          this.initTableDataList();
        } else {
          this.$message.error(`上移失败：${res.message}`);
        }
      });
    },
    // more-点击下移
    operateDown (data, listIndex) {
      if (listIndex === this.tableList.length - 1) return;
      const dataList = this.getMoveDataList(listIndex, listIndex + 1);
      if (!dataList) return;
      $modPersonSorted(dataList).then((res) => {
        if (res.code === '000000') {
          this.$message.success('下移成功');
          this.initTableDataList();
        } else {
          this.$message.error(`下移失败：${res.message}`);
        }
      });
    },
    // more-点击编辑
    operateEdit (data) {
      this.dialogAdd.type = 1;
      this.dialogAdd.visible = true;
      this.dialogAdd.data = _deepClone(data, true);
    },
    // more-点击删除
    operateDel (data) {
      if (this.userName === data.perCode) { // 不能删除自己
        this.$message.error('无法删除与当前登录账号绑定的人员！');
        return;
      }
      const msg = data.userId > 0 ? '此操作将永久删除人员数据及关联账号数据, 是否继续？' : '此操作将永久删除人员数据, 是否继续？';
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 调用接口
          $delPersonList(data.perId).then((res) => {
            if (res.code === '000000') {
              this.$message.success('删除成功');
              this.initTableDataList();
            } else {
              this.$message.error(`删除失败：${res.message}`);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '已取消删除'
          });
        });
    },
    // dialog-account关闭
    closeDialogAccount () {
      this.dialogAccount.visible = false;
    },
    // dialog-account提交
    ensureDialogAccount (formName, dialogName) {
      this.$refs[formName].validate((valid, invalidObj) => {
        if (valid) {
          $modPersonDetail().then((res) => {
            if (res.code === '000000') {
              this.$message.success('修改成功');
              this[dialogName].visible = false;
            } else {
              this.$message.error(`修改失败：${res.message}`);
            }
          });
        } else {
          return false;
        }
      });
    },
    // 改变每页数量
    handleSizeChange (val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.initTableDataList();
    },
    // 改变页码
    handleCurrentChange (val) {
      this.currentPage = val;
      this.initTableDataList();
    },
    // 更改索引
    getIndex (index) {
      return (index + 1) + (this.currentPage - 1) * this.pageSize;
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/base.scss';
.search-from {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin: 22px 0;
  width: 100%;
}

div.el-table .el-table__header {
  .cell.contact-type-head {
    .el-dropdown-link {
      cursor: pointer;
    }
  }
}

// dropdown 框+contact-type
.el-dropdown-menu,
.contact-type-body {
  i {
    width: 23px;
    height: 22px;
    display: inline-block;
    vertical-align: text-bottom;
  }
  .el-dropdown-link {
    padding-left: 35px;
    font-size: 18px;
  }
  //contact-type的dropdown
  i.type-0 {
    background: url('#{$imgUrl}/phone.png') no-repeat;
  }
  i.type-1 {
    background: url('#{$imgUrl}/phone.png') no-repeat;
  }
  i.type-4 {
    background: url('#{$imgUrl}/shoutai.png') no-repeat;
  }
  i.type-5 {
    background: url('#{$imgUrl}/weichat.png') no-repeat;
  }
  i.type-2 {
    background: url('#{$imgUrl}/workphone.png') no-repeat;
  }
  i.type-3 {
    background: url('#{$imgUrl}/homephone.png') no-repeat;
  }
  i.type-6 {
    background: url('#{$imgUrl}/email.png') no-repeat;
  }
  // more的dropdown
  i.authorization {
    background: url('#{$imgUrl}/more-authorization-black.png') no-repeat;
  }
  i.top {
    background: url('#{$imgUrl}/more-top-black.png') no-repeat;
  }
  i.up {
    background: url('#{$imgUrl}/more-up-black.png') no-repeat;
  }
  i.down {
    background: url('#{$imgUrl}/more-down-black.png') no-repeat;
  }
  i.edit {
    background: url('#{$imgUrl}/more-edit-black.png') no-repeat;
  }
  i.delete {
    background: url('#{$imgUrl}/more-delete-black.png') no-repeat;
  }
  li.el-dropdown-menu__item:hover {
    i.authorization {
      background: url('#{$imgUrl}/more-authorization.png') no-repeat;
    }
    i.top {
      background: url('#{$imgUrl}/more-top.png') no-repeat;
    }
    i.up {
      background: url('#{$imgUrl}/more-up.png') no-repeat;
    }
    i.down {
      background: url('#{$imgUrl}/more-down.png') no-repeat;
    }
    i.edit {
      background: url('#{$imgUrl}/more-edit.png') no-repeat;
    }
    i.delete {
      background: url('#{$imgUrl}/more-delete.png') no-repeat;
    }
  }
}
.content-panel {
  box-sizing: border-box;
  .bottom-tb {
    display: flex;
    flex-flow: column wrap;
    height: 100%;
  }
  .det-tb {
    flex: 1;
    overflow-y: auto;
    width: 100%;
  }
  .el-pagination {
    margin: 22px 0;
    text-align: right;
  }
}
.el-table {
  .operate {
    button + div {
      margin-left: 10px;
    }
  }
}
// 职务的hover弹窗
.popover-box {
  padding: 10px 30px;
  h4 {
    font-size: 17px;
    font-weight: 500;
    border-bottom: 1px solid #ebeef5;
    height: 30px;
    margin-bottom: 6px;
  }
  p {
    padding: 8px 0;
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
</style>
