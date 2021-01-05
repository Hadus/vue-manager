<template>
  <div>
    <div
      class="main-content-panel"
      style="height:100%"
    >
      <div class="top-title-bar">
        <span>
          <i class="customize-icon icon-auth"></i> {{appName}}
        </span>
      </div>
      <!-- 下级组织内容 -->
      <div class="content-wrap">
        <div class="search-from">
          <el-input
            v-model.trim="searchCondition.keywords"
            @keyup.enter.native="handleQuery"
            size="medium"
            placeholder="请输入内容"
            maxlength="32"
            style="width:276px;"
          >
            <i
              class="search-icon"
              @click="handleQuery"
              slot="suffix"
              style="position:absolute;right:10px;top:10px;z-index:10"
            ></i>
          </el-input>
          <div
            v-show="flagShowDragOperate"
            class="operate-drag btn-box"
          >
            <el-button
              size="medium"
              @click="handleReset"
              icon="el-icon-refresh-left"
            >
              重置数据
            </el-button>
            <el-button
              size="medium"
              @click="handleSave"
              type="primary"
            >
              <i class="icon icon-save"></i>
              保存拖拽
            </el-button>
          </div>
        </div>
        <drag-tree-table
          ref="treeTable"
          :data="dragTreeTableData"
          :onDrag="onTreeDataChange"
          parent-id="parentItemId"
          id="itemId"
          order="sorted"
          :default-icon="defaultIcon"
          :root-icon="rootIcon"
          :search="true"
          @filter-node-method="filterWithVal"
        ></drag-tree-table>
      </div>
      <!-- dialog -->
      <mti-dialog
        :show.sync="dialog.visible"
        width="694px"
        :title="dialog.type?`编辑：${dialog.data.itemName}（${dialog.data.itemType === 1 ? '菜单' : '按钮'}）`:`新增（父节点：${dialog.data.parentName}）`"
        @close-dialog="closeDialog"
      >
        <dialog-detail
          v-if="dialog.visible"
          :dialog="dialog"
          :show.sync="dialog.visible"
          @enter-cb="initDataList"
        ></dialog-detail>
      </mti-dialog>
    </div>
  </div>
</template>

<script>
// 组件-dragTreeTable
import dragTreeTable from '@/components/dragTreeTable';
// 组件-dialog
import mtiDialog from '@/components/dialog';
import dialogDetail from './dialogDetail';
// 导入服务
import { $getSystemDetail, $modSystemDetail, $modSystemItem, $delSystemItem } from '@/api/authManage';
import { $source } from '@/config';
// 导入mtiUtils
import { _deepClone, _listToTree, _treeToList } from '@/utils/mtiUtils';
// 导入默认图片
import defaultIcon from '@/assets/images/logo-menu.png';
import rootIcon from '@/assets/images/common/share.png';

export default {
  name: 'personnelMangement',
  components: {
    dragTreeTable,
    mtiDialog,
    dialogDetail
  },
  mixins: [],
  props: {},
  data () {
    return {
      sourcePath: $source,
      searchCondition: {
        keywords: ''
      },
      appId: Number(this.$route.query.id || 0),
      appName: this.$route.query.name,
      flagShowDragOperate: false,
      dragTreeTableData_init: { // 初始化数据，保存一份
        columns: [],
        lists: []
      },
      dragTreeTableData: {// 操作数据
        columns: [],
        lists: []
      },
      dragTreeTableConfig: {
        search: true,
        check: false,
        drag: true,
        operate: false
      },
      dialog: {
        visible: false,
        type: null, // 0-添加，1-编辑
        flagItemType: 0, // 0-显示菜单和按钮，1-显示菜单，2-显示按钮
        data: this.initDialogData(),
        rules: {
          itemName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { pattern: /^[0-9a-zA-Z\u4e00-\u9fa5]{1,30}$/, message: '1~30个字符', trigger: 'change' }
          ],
          itemRoute: [{ min: 1, max: 50, message: '1~50字符', trigger: 'change' }],
          itemDesc: [{ min: 1, max: 100, message: '1~50字符', trigger: 'change' }]
        }
      },
      defaultIcon,
      rootIcon
    };
  },
  computed: {},
  watch: {
    'searchCondition.keywords' (val) {
      this.$refs['treeTable'].filter(val);
    },
    // 当类型为按钮时，状态不可用
    'dialog.data.itemType' (newValue) {
      this.dialog.data.enabled =
        newValue === 2 ? 0 : this.dialog.data.enabled;
    }
  },
  created () {
    this.initDataList(1);
    const columns = [
      {
        type: 'selection',
        title: '名称',
        field: 'itemName',
        width: 270,
        align: 'left'
      },
      {
        title: '类型',
        field: 'itemType',
        width: 180,
        align: 'center',
        formatter: (item) => {
          return `<span>${item.itemType === 1 ? '菜单' : '按钮'}</span>`;
        }
      },
      {
        title: '请求地址',
        field: 'itemRoute',
        align: 'center',
        flex: 1
      },
      {
        type: 'switch',
        title: '状态',
        field: 'enabled',
        width: 180,
        align: 'center',
        activeValue: 1,
        inactiveValue: 0,
        onswitch: this.handleSwitchItem
      },
      {
        type: 'action',
        title: '操作',
        width: 180,
        align: 'center',
        actions: [
          {
            onclick: this.handleAddItem,
            icon: 'el-icon-plus',
            tipsContent: '添加',
            abled: this.$isHasBtnId('anthManage.addItem'),
            style: {
              fontSize: '16px'
            },
            formatter: (item) => {
              return '<i></i>';
            }
          },
          {
            onclick: this.handleEditorItem,
            icon: 'el-icon-edit',
            tipsContent: '编辑',
            abled: this.$isHasBtnId('anthManage.editItem'),
            style: {
              fontSize: '16px',
              margin: '0 20px'
            },
            formatter: (item) => {
              return '<i></i>';
            }
          },
          {
            onclick: this.handleDelItem,
            icon: 'el-icon-delete',
            tipsContent: '删除',
            abled: this.$isHasBtnId('anthManage.delItem'),
            style: {
              fontSize: '16px',
              color: '#F56C6C'
            },
            formatter: (item) => {
              return '<i></i>';
            }
          }
        ]
      }
    ];
    this.dragTreeTableData_init.columns = this.dragTreeTableData.columns = columns;
  },
  mounted () { },
  destroyed () { },
  methods: {
    // 初始化dialog数据
    initDialogData () {
      return {
        enabled: 1,
        itemName: '',
        appId: Number(this.$route.query.id || 0),
        itemType: 1, // 1-菜单，2-按钮
        parentItemId: null,
        sorted: 1,
        itemDesc: '',
        itemRoute: '',
        itemIcon: ''
      };
    },
    // 初始化table数据--notSearchCondition是否有查询条件
    initDataList (notSearchCondition) {
      let data = {
        appId: this.appId
      };
      if (!notSearchCondition) {
        data = Object.assign(data, {
          queryKey: this.searchCondition.keywords
        });
      }
      $getSystemDetail(data).then((res) => {
        if (res.code === '000000') {
          res.data.forEach((item) => {
            item.itemIcon && (item.itemIcon = this.sourcePath + '/' + item.itemIcon);
          });
          const lists = _listToTree(res.data, {
            rootId: -1,
            cname: 'lists',
            pidname: 'parentItemId',
            cidname: 'itemId'
          }, { open: false });
          this.dragTreeTableData_init.lists = lists;
          const dealLists = _deepClone(lists);
          this.dragTreeTableData.lists = this.addRoot(dealLists);
        } else {
          this.$message.error(`查询失败：${res.message}`);
        }
      });
    },
    // 添加root节点
    addRoot (lists) {
      return [{
        itemName: this.appName,
        itemId: -1,
        appId: this.appId,
        open: true,
        lists
      }];
    },
    // 查询数据
    handleQuery () {
      // this.initDataList();
    },
    // 匹配数据
    filterWithVal (val, item) {
      if (item.itemId === -1) { // 根节点
        item._visible = true;
        return;
      };
      const lable = 'itemName';
      item._visible = item[lable].includes(val);
    },
    // 重置拖拽数据
    handleReset () {
      this.dragTreeTableData.lists[0].lists = _deepClone(
        this.dragTreeTableData_init.lists,
        true
      );
      this.flagShowDragOperate = false;
      this.$message({
        type: 'success',
        message: '重置成功!'
      });
    },
    // 保存拖拽数据
    handleSave () {
      this.$confirmOperation('此操作将提交拖拽的结果, 是否继续?')
        .then(() => {
          const data = _treeToList(this.dragTreeTableData.lists[0].lists,
            { rootId: -1, cname: 'lists', cidname: 'itemId', pidname: 'parentItemId' },
            ['appId', 'itemId', 'parentItemId', 'sorted', 'itemName']
          );
          $modSystemDetail(data).then((res) => {
            if (res.code === '000000') {
              this.$message.success('修改保存成功');
              this.initDataList();
              this.flagShowDragOperate = false;
            } else {
              this.$message.error(`修改保存失败：${res.message}`);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '已取消修改'
          });
        });
    },
    onTreeDataChange (list) {
      this.flagShowDragOperate = true;
      this.dragTreeTableData.lists = list;
    },
    // switch 行
    handleSwitchItem (item, activeValue, inactiveValue) {
      if ((item.itemId === -1 && item.appId < 1000) || (item.itemId !== -1 && item.itemId < 1000)) return;// 初始数据不允许操作
      const reqData = {
        enabled: item.enabled,
        itemName: item.itemName,
        appId: item.appId,
        itemType: item.itemType,
        itemId: item.itemId,
        parentItemId: item.parentItemId
      };
      $modSystemItem(reqData).then((res) => {
        if (res.code === '000000') {
          this.$message.success('状态切换成功');
        } else {
          this.$message.error(`状态切换失败：${res.message}`);
          this.initDataList();
        }
      });
    },
    // 新增行
    handleAddItem (item) {
      if ((item.itemId === -1 && item.appId < 1000) || (item.itemId !== -1 && item.itemId < 1000)) return;// 初始数据不允许操作
      this.dialog.type = 0;
      // 判断dialog显示类型
      this.dialog.flagItemType = (item.lists && item.lists.length) ? item.lists[0].itemType : 0;
      // 根据dialog显示类型初始化itemType--默认显示菜单
      this.dialog.data.itemType = this.dialog.flagItemType ? this.dialog.flagItemType : 1;
      this.dialog.data.parentItemId = item.itemId;
      this.dialog.visible = true;
      // 菜单默认状态开启
      this.dialog.data.enabled = 1;
      this.dialog.data.parentName = item.itemName;
    },
    // 编辑行
    handleEditorItem (item) {
      if ((item.itemId === -1 && item.appId < 1000) || (item.itemId !== -1 && item.itemId < 1000)) return;// 初始数据不允许操作
      this.dialog.type = 1;
      // 判断dialog显示类型
      this.dialog.flagItemType = item.itemType;
      this.dialog.data = _deepClone(item, true);
      // 去掉source
      this.dialog.data.itemIcon = this.dialog.data.itemIcon.split(this.sourcePath)[1];
      this.dialog.visible = true;
    },
    // 删除行
    handleDelItem (item, $index) {
      if ((item.appId && item.appId < 1000) || (!item.appId && item.itemId < 1000)) return;// 初始数据不允许操作
      this.$confirmOperation('此操作将永久删除数据, 是否继续?')
        .then(() => {
          // 调用接口
          $delSystemItem(item.itemId).then((res) => {
            if (res.code === '000000') {
              this.$message.success('删除成功');
              this.initDataList();
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
    // dialog关闭
    closeDialog () {
      this.dialog.visible = false;
      this.dialog.data = this.initDialogData();
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/base.scss';
.icon-auth {
  background: url('#{$imgUrl}/auth.png') no-repeat;
}
.search-from {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin: 22px 0;
  width: 100%;
}
.operate-drag {
  .icon {
    width: 16px;
    height: 12px;
    background-repeat: no-repeat;
    background-size: contain;
    vertical-align: super;
  }
  .icon-save {
    background-image: url('#{$imgUrl}/save.png');
  }
}

.main div.main-content-panel {
  height: auto;
}
.content-wrap {
  position: relative;
  box-sizing: border-box;
  .det-tb {
    margin-top: 20px;
  }
  .el-pagination {
    position: absolute;
    right: 20px;
    bottom: 34px;
  }
}
</style>
