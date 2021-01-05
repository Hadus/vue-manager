<template>
  <div class="dialog-details">
    <label>
      日志保留时间：
      <el-select v-model.trim="dialog.data">
        <el-option
          label="保留最近一个月"
          :value="-1"
        ></el-option>
        <el-option
          label="保留最近三个月"
          :value="-3"
        ></el-option>
        <el-option
          label="保留最近半年"
          :value="-6"
        ></el-option>
      </el-select>
    </label>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="$emit('update:show',false)">取 消</el-button>
      <el-button
        @click="ensureDelDialog"
        type="primary"
      >确 定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  mixins: [],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    dialog: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {};
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  destroyed () { },
  methods: {
    // 删除日志-确定
    ensureDelDialog () {
      this.$emit('enter-cb');
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog-details {
  text-align: center;
}
/**dialog**/
.el-dialog {
  .dialog-footer {
    margin-top: 50px;
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
