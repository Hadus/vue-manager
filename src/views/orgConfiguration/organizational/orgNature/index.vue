/*
* @Author: liuhuitao
* @Date: 2019-08-08 16:52:44
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-10-25 09:30:29
*/
<template>
  <div>
    <div class="main-content-panel">
      <div class="top-title-bar">
        <span> <i class="customize-icon list-icon"></i> 组织性质管理 </span>
        <span v-has="permisBtnIdSetting.add">
          <i
            class="customize-icon add-icon"
            @click="handeleAdd"
          ></i>
        </span>
      </div>
      <div class="content-wrap">
        <div
          class="search-from"
          style="width: 257px; position:relative;"
        >
          <el-input
            v-model="queryKey"
            placeholder="请输入内容"
            @keyup.enter.native="initTable"
          ></el-input>
          <i
            class="search-icon"
            @click="initTable"
            style="position:absolute;right:10px;top:10px;z-index:10"
          ></i>
        </div>
        <div class="det-tb">
          <el-table
            :header-row-style="{ color: '#333333' }"
            :header-cell-style="{ backgroundColor: '#F8F8F8' }"
            stripe
            :data="tableData"
            border
            style="width: 100%;"
            height="calc(100% - 16px)"
            v-loading="loading"
          >
            <el-table-column
              type="index"
              width="80"
              label="序号"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="dictName"
              label="名称"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="dictCode"
              label="编码"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="dictSorted"
              label="排序"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="dictDesc"
              label="描述"
            ></el-table-column>
            <el-table-column
              label="操作"
              width="200"
              align="center"
              v-if="this.$isHasBtnId(permisBtnIdSetting.edit) || this.$isHasBtnId(permisBtnIdSetting.del)"
            >
              <template slot-scope="scope">
                <div
                  class="operation-setting-panel"
                  style="line-height:28px; display:flex;flex-flow:row nowrap; justify-content: space-around;"
                >
                  <el-tooltip
                    class="item"
                    effect="light"
                    content="编辑"
                    placement="top"
                  >
                    <i
                      class="customize-icon data-edit-icon"
                      v-has="permisBtnIdSetting.edit"
                      @click="handleEdit(scope.$index, scope.row)"
                    ></i>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="light"
                    content="删除"
                    placement="top"
                  >
                    <i
                      class="customize-icon data-delete-icon"
                      v-has="permisBtnIdSetting.del"
                      @click="handleDelete(scope.$index, scope.row)"
                    ></i>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- <el-pagination
          class="el-page"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 40, 60, 100]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination> -->
      </div>
    </div>
    <!-- 新增，编辑组织性质弹框 -->
    <mti-dialog
      :show.sync="operOrgNatureVisible"
      :width="'660px'"
      :title="dialogTitle + '组织性质'"
      @close-dialog="operOrgNatureVisible = false"
    >
      <oper-orgNature-form
        v-if="operOrgNatureVisible"
        :row-data="rowData"
        @oper-success="operSuccess"
        @close-dialog="operOrgNatureVisible = false"
      ></oper-orgNature-form>
    </mti-dialog>
  </div>
</template>

<script>
// import mtiTree from "@/components/mti-tree";
import mtiDialog from '@/components/dialog';
import { getOrgNatureList, deleteOrgNature } from '@/api/orgConfiguration';
import operOrgNatureForm from '@/views/orgConfiguration/organizational/orgNature/operOrgNatureForm.vue';

export default {
  name: 'orgManage',
  props: {},
  components: {
    // mtiTree,
    mtiDialog,
    operOrgNatureForm
  },
  data () {
    return {
      permisBtnIdSetting: this.$permisBtnIdSetting['orgNature'], // 权限按钮Id
      queryKey: '', // 查询参数

      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      loading: false,
      // 弹框
      operOrgNatureVisible: false,
      dialogTitle: '',
      rowData: {}
    };
  },
  watch: {},
  computed: {},
  created () {
    this.initTable();
  },
  mounted () { },
  destroyed () { },
  methods: {
    // 新增或编辑成功后
    operSuccess () {
      this.operOrgNatureVisible = false;
      this.initTable();
    },
    initTable () {
      this.loading = true;
      this.tableData = [];
      getOrgNatureList({
        dictTypes: 'DEPART_NATURE',
        queryKey: this.queryKey
      }).then((res) => {
        if (res && res.data) {
          this.tableData = res.data;
          this.loading = false;
        } else {
          this.$message({
            type: 'error',
            message: res.message
          });
        }
      });
    },
    handeleAdd () {
      this.dialogTitle = '新增';
      this.rowData = {};
      this.operOrgNatureVisible = true;
    },
    handleEdit (index, row) {
      this.dialogTitle = '编辑';
      this.rowData = row;
      this.operOrgNatureVisible = true;
    },
    handleDelete (index, row) {
      this.$confirmOperation('此操作将永久删除此组织性质信息, 是否继续?', '删除提示')
        .then(() => {
          deleteOrgNature(row.dictId).then((res) => {
            if (res && res.data) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.initTable();
            } else {
              if (res.code === '601015') {
                return this.$message.error('当前组织性质已经在使用，无法删除');
              }
              this.$message({
                type: 'error',
                message: res.message
              });
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
    handleSizeChange (val) {
      this.pageSize = val;
      this.initTable();
    },
    handleCurrentChange (val) {
      this.currentPage = val;
      this.initTable();
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/base.scss';
.content-wrap {
  display: flex;
  flex-flow: column wrap;
  .search-from {
    margin: 22px 0;
    width: 100%;
  }
  .det-tb {
    flex: 1;
    overflow-y: auto;
    width: 100%;
  }
  // .el-page {
  //   margin: 22px 0;
  //   text-align: right;
  // }
}
</style>
