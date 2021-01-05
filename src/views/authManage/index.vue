<template>
  <div>
    <div class="main-content-panel">
      <div class="top-title-bar">
        <span>
          <i class="customize-icon icon-auth"></i> 权限管理
        </span>
      </div>
      <!-- 下级组织内容 -->
      <div class="content-wrap">
        <div
          v-for="(item, index) in dataList"
          :key="index"
          class="box"
        >
          <div class="top">
            <el-tooltip
              effect="light"
              class="item"
              content="点击查看详情"
              placement="top"
            >
              <i
                class="icon"
                @click.stop="handleSee(item)"
              >
                <img
                  :src="sourcePath+'/'+item.appLogo"
                  v-if="item.appLogo"
                >
                <img
                  src="~@/assets/images/common/system_01.png"
                  v-else
                >
              </i>
            </el-tooltip>
            <span>{{ item.appShortName }}</span>
          </div>
          <div class="bot">
            {{ item.appName }}
            <el-tooltip
              effect="light"
              class="item"
              content="点击编辑"
              placement="top"
            >
              <i
                class="el-icon-edit"
                @click="handleEdit(item)"
                v-if="$isHasBtnId('anthManage.editApp')"
              ></i>
            </el-tooltip>
          </div>
        </div>
        <div
          class="box box-add"
          v-if="$isHasBtnId('anthManage.addApp')&&userId===1"
        >
          <el-tooltip
            effect="light"
            class="item"
            content="点击新增"
            placement="top"
          >
            <i
              class="el-icon-plus"
              @click="handleAdd"
            ></i>
          </el-tooltip>
        </div>
      </div>
      <!-- dialog-新增模块 -->
      <mti-dialog
        :show.sync="dialogAdd.visible"
        width="694px"
        :title="dialogAdd.type?`编辑应用：${dialogAdd.data.appName}`:'新增应用'"
        @close-dialog="closeOperAppDialog"
      >
        <dialog-app
          v-if="dialogAdd.visible"
          :show.sync="dialogAdd.visible"
          :dialog="dialogAdd"
          @enter-cb="initDataList"
        ></dialog-app>
      </mti-dialog>
    </div>
  </div>
</template>

<script>
// 组件-dialog
import mtiDialog from '@/components/dialog';
import dialogApp from './dialogApp';
// 导入服务
import { $getSystemList } from '@/api/authManage';
import { $source } from '@/config';

// 导入mtiUtils
import { _deepClone } from '@/utils/mtiUtils';
// 引入user-store
import { createNamespacedHelpers } from 'vuex';
const { mapState: mapStateFromUser } = createNamespacedHelpers('user');
export default {
  name: 'personnelMangement',
  components: {
    mtiDialog,
    dialogApp
  },
  mixins: [],
  props: {},
  data () {
    return {
      sourcePath: $source,
      dataList: [],
      dialogAdd: {
        visible: false,
        data: this.initDialogData(),
        rules: {
          appName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { pattern: /^[0-9a-zA-Z\u4e00-\u9fa5]{1,30}$/, message: '1~30个字符', trigger: 'change' }
          ],
          appCode: [
            { required: true, message: '请输入编号', trigger: 'blur' },
            { pattern: /^[0-9a-zA-Z]{1,30}$/, message: '1~40个字符', trigger: 'change' }
          ],
          appShortName: [
            { required: true, message: '请输入简称', trigger: 'blur' },
            { min: 1, max: 20, message: '1~20个字符', trigger: 'change' }
          ],
          appUrl: [{ min: 1, max: 50, message: '1~50字符', trigger: 'blur' }],
          appDesc: [{ min: 1, max: 100, message: '1~100字符', trigger: 'change' }]
        },
        type: null// 0-新增，1-编辑
      }
    };
  },
  computed: {
    ...mapStateFromUser(['userId'])
  },
  watch: {},
  created () {
    this.initDataList();
  },
  mounted () { },
  destroyed () { },
  methods: {
    // 初始化data数据
    initDataList () {
      $getSystemList().then((res) => {
        if (res.code === '000000') {
          this.dataList = res.data;
        } else {
          this.$message.error(`查询失败：${res.message}`);
        }
      });
    },
    // 初始化dialog数据
    initDialogData () {
      return {
        appName: '',
        appCode: '',
        appShortName: '',
        appUrl: '',
        appDesc: '',
        appLoginEndpointArr: ['WEB'],
        appSessionTimeout: '-1',
        appLoginTwice: 0,
        enabled: 1,
        sorted: 1,
        appLogo: ''
      };
    },
    // 添加
    handleAdd () {
      if (this.userId !== 1) return;// 只有admin可以添加应用
      this.dialogAdd.type = 0;
      this.dialogAdd.visible = true;
    },
    // 编辑
    handleEdit (system) {
      this.dialogAdd.type = 1;
      this.dialogAdd.visible = true;
      this.dialogAdd.data = _deepClone(system, true);
      this.$set(this.dialogAdd.data, 'appLoginEndpointArr', this.dialogAdd.data.appLoginEndpoint.split(','));
    },
    // 进入系统
    handleSee (system) {
      this.$router.push({
        path: '/authManage/authDetail',
        query: { id: system.appId, name: system.appName }
      });
    },
    closeOperAppDialog () {
      this.dialogAdd.data = this.initDialogData();
      this.dialogAdd.visible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/base.scss';
.icon-auth {
  background: url('#{$imgUrl}/auth.png') no-repeat;
}
.content-wrap {
  $margin: 40px;
  $box_w: 340px;
  $box_h: 200px;
  $box_add_w: 200px;
  .box {
    box-sizing: border-box;
    display: inline-block;
    width: $box_w;
    height: $box_h;
    padding: 27px 32px;
    margin-top: $margin;
    margin-right: $margin;
    background: url('#{$imgUrl}/system-bg.png') no-repeat;
    color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    vertical-align: bottom;
    &:nth-child(4n + 1) {
      margin-left: 24px;
    }
    &:nth-child(4n) {
      margin-right: 0;
    }
    i {
      width: auto;
      height: auto;
      cursor: pointer;
    }
    .top {
      height: 94px;

      i {
        display: inline-block;
        width: 103px;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
        }
      }
      span {
        display: inline-block;
        width: 96px;
        padding: 27px 0 0 40px;
        font-size: 13px;
        vertical-align: top;
      }
    }
    .bot {
      box-sizing: border-box;
      height: 55px;
      padding-top: 30px;
      font-size: 20px;
      font-weight: 600;
      i {
        padding-left: 5px;
        font-size: 22px;
      }
    }
  }

  .box-add {
    width: $box_add_w;
    font-size: 90px;
    line-height: $box_h;
    padding: 0;
    text-align: center;
    cursor: pointer;
  }
}
</style>
