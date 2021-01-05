/*
* @Author: liuhuitao
* @Date: 2019-08-12 10:16:41
 * @Last Modified by: liuhuitao
 * @Last Modified time: 2019-10-25 09:28:11
* @description: 在线用户管理
*/
<template>
  <div>
    <div class="main-container">
      <!-- 左侧 -->
      <div class="left-panel">
        <div class="l-title-bar">
          <span> <i class="customize-icon org-icon"></i> 应用系统列表 </span>
        </div>
        <!-- 左侧查询树 -->
        <div class="tree-panel">
          <table
            class="system-tb"
            cellspacing="0"
            cellpadding="0"
            style="width:100%"
          >
            <thead>
              <tr>
                <th class="tt">应用系统名称</th>
              </tr>
            </thead>
            <tbody v-loading="sysLoading">
              <tr
                v-for="(item,index) in sysAppList"
                :class="selectedSysApp === item.appCode?'active-tr':''"
                :key="index"
                @click="sysAppChange(item.appCode)"
              >
                <td
                  class="hover-animate"
                  :title="item.appName"
                >
                  {{item.appName}}
                </td>
              </tr>
              <tr v-if="sysAppList.length === 0">
                <td colspan="2">应用系统为空...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="right-panel">
        <div class="r-title-bar">
          <span> <i class="customize-icon list-icon"></i> 在线账户详情 </span>
        </div>
        <!-- 右侧 -->
        <div class="content-panel">
          <!-- 下级组织内容 -->
          <div class="bottom-tb">
            <!-- 查询表单 -->
            <div class="search-from">
              <el-input
                v-model="searchForm.queryKey"
                placeholder="请输入内容"
                style="width:276px;"
              ></el-input>
              <div style="min-width:450px;display:flex;flex-flow:row nowrap; align-items:center;">
                登录时间：
                <el-date-picker
                  v-model="searchForm.date"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  style="width: 257px;"
                >
                </el-date-picker>
                <el-button
                  @click="handelBtnSearch"
                  type="primary"
                  style="width:110px; height:42px;margin-left:24px;"
                ><i
                    class="customize-icon btn-search-icon"
                    style="color:#ffffff;"
                  ></i> 查询</el-button>
              </div>
            </div>
            <!-- 表格 -->
            <div class="det-tb">
              <el-table
                :header-row-style="{ color: '#333333' }"
                :header-cell-style="{ backgroundColor: '#F8F8F8' }"
                stripe
                :data="tableData"
                border
                height="100%"
                style="font-size:16px;width:100%;"
              >
                <el-table-column
                  type="index"
                  width="80"
                  label="序号"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="userName"
                  label="用户名"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="userRealName"
                  label="姓名"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="endPoint"
                  width="100"
                  label="登录终端"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="clientKey"
                  label="客户端标识"
                  width="138"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="appName"
                  label="登录系统"
                  width="200"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="modifiedTime"
                  label="登录时间"
                  width="200"
                  align="center"
                ></el-table-column>
                <el-table-column
                  label="操作"
                  width="100"
                  align="center"
                  v-if="this.$isHasBtnId(permisBtnIdSetting.forceOutline)"
                >
                  <template slot-scope="scope">
                    <el-button
                      @click="handleLoginOut(scope.$index, scope.row)"
                      v-has="permisBtnIdSetting.forceOutline"
                      type="text"
                      size="small"
                      style="font-size: 16px;"
                    >强制下线</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 分页器 -->
            <el-pagination
              class="el-page"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 40, 60, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAppListData } from '@/api/app';
import { createNamespacedHelpers } from 'vuex';
import { getOnlineAccount, enforceOffline } from '@/api/account';
const { mapState: mapStateFromUser } = createNamespacedHelpers('user');
export default {
  name: 'onlineAccount',
  props: {},
  components: {
  },
  data () {
    return {
      permisBtnIdSetting: this.$permisBtnIdSetting['onlineAccountManage'], // 权限按钮Id
      sysAppList: [],
      sysLoading: true,
      selectedSysApp: '', // 已选择的系统应用(String)
      searchForm: {
        queryKey: '',
        date: ''
      }, // 查询表单
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: []
    };
  },
  watch: {},
  computed: {
    ...mapStateFromUser(['userName', 'userId'])
  },
  created () {
    this.initAppList();
  },
  mounted () { },
  destroyed () { },
  methods: {
    // 初始化系统应用数据
    initAppList () {
      this.sysLoading = true;
      getAppListData({
        appLoginEndpoint: 'WEB'
      }).then((res) => {
        if (res && res.data) {
          this.sysAppList = res.data;
          // 默认选择第一项
          if (this.sysAppList.length > 0) {
            this.selectedSysApp = this.sysAppList[0].appCode;
          }
          this.sysLoading = false;
          this.initAccountTb();
        } else {
          this.loading = false;
        }
      });
    },
    // 改变系统应用
    sysAppChange (appCode) {
      if (this.selectedSysApp === appCode) return;
      this.selectedSysApp = appCode;
      this.queryConditionInit();
      this.initAccountTb();
    },
    initAccountTb () {
      this.tableData = [];
      this.loading = true;
      if (this.selectedSysApp === -1) {
        this.loading = false;
        return this.$message({
          type: 'error',
          message: '请选择应用系统!'
        });
      }
      // debugger;
      let data = {
        appCode: this.selectedSysApp,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        queryKey: this.searchForm.queryKey
      };

      if (this.searchForm.date !== '' && this.searchForm.date !== null) {
        data.startTime = this.searchForm.date[0];
        data.endTime = this.searchForm.date[1];
      }
      if (this.roleName !== '') {
        data.roleName = this.roleName;
      }
      getOnlineAccount(data).then((res) => {
        if (res && res.data) {
          this.tableData = res.data.list;
          this.total = res.data.totalCount;
        }
        this.loading = false;
      });
    },
    handleLoginOut (index, row) {
      this.$confirmOperation('此操作将强制此用户退出登录, 是否继续?')
        .then(() => {
          if (this.userName === row.userName) {
            return this.$message({
              type: 'error',
              message: '无法使当前用户退出登录！'
            });
          }
          enforceOffline(row.id).then((res) => {
            if (res && res.data) {
              this.initAccountTb();
            }
          });
          this.$message({
            type: 'success',
            message: '退出成功!'
          });
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '已取消操作'
          });
        });
    },
    handleSizeChange (val) {
      this.pageSize = val;
      this.initAccountTb();
    },
    handleCurrentChange (val) {
      this.currentPage = val;
      this.initAccountTb();
    },
    handelBtnSearch () {
      this.currentPage = 1;
      this.pageSize = 10;
      this.total = 0;
      this.initAccountTb();
    },
    /***
     * @description 查询参数置为初始值
     */
    queryConditionInit () {
      this.searchForm.queryKey = '';
      this.searchForm.date = '';
      this.currentPage = 1;
      this.pageSize = 10;
      this.total = 0;
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/base.scss';
.content-panel {
  .bottom-tb {
    display: flex;
    flex-flow: column wrap;
    height: 100%;
  }
  .search-from {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    margin: 22px 0;
    width: 100%;
  }
  .det-tb {
    flex: 1;
    overflow-y: auto;
    width: 100%;
  }
  .el-page {
    margin: 22px 0;
    text-align: right;
  }
}
// 系统列表表格
.system-tb {
  border-collapse: collapse;
  border: none;
  border-spacing: 0;
  display: block;
  height: 100%;
  .tt {
    font-weight: bold;
  }
  td,
  th {
    border: 1px solid#DDDDDD;
    @include sc(16px, #333333);
    text-align: center;
    height: 44px;
    line-height: 44px;
  }
  thead {
    display: block;
  }
  tbody {
    overflow-y: auto;
    overflow-x: hidden;
    display: block;
    height: calc(100% - 44px);
    tr {
      cursor: pointer;
      margin-top: -1px;
    }
  }
  tr {
    width: 100%;
    display: block;
    transition: 0.3s background-color linear;
    td {
      display: block;
      padding: 0 5px;
      transition: 0.3s color, font-size linear;
    }
    .hover-animate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    th {
      display: block;
    }
  }
  tr:nth-child(odd) {
    background: #f8f8f8;
  }
  .active-tr {
    background-color: #bee4fe !important;
    td {
      font-size: 16px;
      color: rgb(102, 177, 255) !important;
    }
  }
}
</style>
