<template>
  <div class="log">
    <div class="main-content-panel">
      <div class="top-title-bar">
        <span>
          <i class="customize-icon list-icon"></i> 安全日志详情
        </span>
        <span>
          <i
            class="customize-icon delete-icon"
            @click="handleDel"
            style="cursor:pointer"
            v-if="$isHasBtnId('logManage.safetyDel')"
          ></i>
        </span>
      </div>
      <!-- 下级组织内容 -->
      <div class="content-wrap">
        <div class="bottom-tb">
          <div class="search-from">
            <el-input
              v-model.trim="searchCondition.keywords"
              @enter="handleQueryList()"
              size="medium"
              suffix-icon="el-icon-search"
              placeholder="请输入内容"
              style="width:276px;"
            ></el-input>
            <div>
              <label>
                登录系统：
                <el-select
                  v-model="searchCondition.system"
                  placeholder="请选择"
                  size="small"
                >
                  <el-option
                    label="所有系统"
                    :value="null"
                  ></el-option>
                  <el-option
                    v-for="(item, index) in systemList"
                    :key="index"
                    :label="item.appName"
                    :value="item.appCode"
                  ></el-option>
                </el-select>
              </label>
              <label style="margin: 0 20px">
                查询时间：
                <el-date-picker
                  v-model.trim="searchCondition.time"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  size="small"
                  clearable
                  prefix-icon="el-icon-date"
                ></el-date-picker>
              </label>
              <el-button
                type="primary"
                size="medium"
                @click="handleQueryList()"
                icon="el-icon-search"
              >查询</el-button>
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
            >
              <el-table-column
                label="序号"
                width="80"
                type="index"
                :index="getIndex"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="userName"
                label="用户名"
                width="120"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="appName"
                label="登录系统"
                width="270"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="endpoint"
                label="登录终端"
                width="180"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="clientKey"
                label="客户端标识"
                width="270"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="loginStatusValue"
                label="操作信息"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="loginTime"
                label="操作时间"
                width="270"
                align="center"
              ></el-table-column>
              <el-table-column
                label="操作"
                width="120"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    @click="handleSee(scope)"
                    type="text"
                    size="medium"
                  >详情</el-button>
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
      <!-- dialog-查看日志 -->
      <mti-dialog
        :show.sync="dialogDetails.visible"
        width="660px"
        title="日志详情"
        @close-dialog="dialogDetails.visible = false"
      >
        <log-detail
          v-if="dialogDetails.visible"
          :dialog="dialogDetails"
          :show.sync="dialogDetails.visible"
        ></log-detail>
      </mti-dialog>
      <!-- dialog-清空日志 -->
      <mti-dialog
        :show.sync="dialogDelLog.visible"
        width="660px"
        title="清除日志"
        @close-dialog="dialogDelLog.visible = false"
      >
        <del-log
          v-if="dialogDelLog.visible"
          :dialog="dialogDelLog"
          :show.sync="dialogDelLog.visible"
          @enter-cb="ensureDelDialog"
        ></del-log>
      </mti-dialog>
    </div>
  </div>
</template>

<script>
// 组件-dialog
import mtiDialog from '@/components/dialog';
import delLog from '../operateLog/delLog';
import logDetail from '../operateLog/logDetail';
import { $getLoginlogList, $getLoginlogDetail, $delLoginlogList } from '@/api/logManage';
import { getAppListData as $getSystemList } from '@/api/app';
export default {
  name: 'safety-log',
  components: {
    mtiDialog,
    delLog,
    logDetail
  },
  mixins: [],
  props: {},
  data () {
    return {
      searchCondition: {
        keywords: '',
        system: null,
        time: []
      },
      systemList: [],
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      tableList: [],
      dialogDetails: {
        visible: false,
        data: {},
        showList: []
      },
      dialogDelLog: {
        visible: false,
        data: -6
      },
      formLabelWidth: '90px'
    };
  },
  computed: {},
  watch: {},
  created () {
    // 请求数据
    this.initTableDataList(1);
    $getSystemList({}).then((res) => {
      if (res.code === '000000') {
        this.systemList = res.data;
      } else {
        this.$message.error(`查询失败：${res.message}`);
      }
    });
  },
  mounted () { },
  destroyed () { },
  methods: {
    // 初始化table数据--notSearchCondition是否有查询条件
    initTableDataList (notSearchCondition) {
      let data = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      };

      if (!notSearchCondition) {
        data = Object.assign(data, {
          queryKey: this.searchCondition.keywords,
          appCode: this.searchCondition.system,
          startTime: this.searchCondition.time && this.searchCondition.time.length ? this.searchCondition.time[0] : null,
          endTime: this.searchCondition.time && this.searchCondition.time.length ? this.searchCondition.time[1] : null
        });
      }
      $getLoginlogList(data).then((res) => {
        if (res.code === '000000') {
          this.tableList = res.data.list;
          this.totalCount = res.data.totalCount;
        } else {
          this.$message.error(`查询失败：${res.message}`);
        }
      });
    },
    // 查询日志
    handleQueryList () {
      this.currentPage = 1;
      this.initTableDataList();
    },
    // 删除日志
    handleDel () {
      this.dialogDelLog = {
        data: -6,
        visible: true
      };
    },
    // 删除日志-确定
    ensureDelDialog () {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 调用接口
          $delLoginlogList({ offMonth: this.dialogDelLog.data }).then((res) => {
            if (res.code === '000000') {
              this.$message.success('删除成功');
              this.dialogDelLog.visible = false;
              // 清空查询选项-并查询数据
              this.currentPage = 1;
              this.searchCondition.time = [];
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
    // 查看详情
    handleSee (scope) {
      this.dialogDetails.visible = true;

      $getLoginlogDetail(scope.row.id).then((res) => {
        if (res.code === '000000') {
          this.dialogDetails.data = res.data;
          this.dialogDetails.showList = [
            { label: '用  户  名：', msg: res.data.userName },
            { label: '人员名称：', msg: res.data.userRealName },
            { label: '所属组织：', msg: res.data.departName },
            { label: '登录终端：', msg: res.data.endpoint },
            { label: '客户端标识：', msg: res.data.clientKey },
            { label: '操作信息：', msg: res.data.loginStatusValue },
            { label: '操作时间：', msg: res.data.loginTime }
          ];
        } else {
          this.$message.error(`查询失败：${res.message}`);
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
.el-icon-circle-plus-outline {
  cursor: pointer;
}
.search-from {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin: 22px 0;
  width: 100%;
}
.content-wrap {
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
</style>
