<template>
  <div>
    <ul class="items">
      <li
        v-for="(item, index) in dialog.showList"
        :key="index"
      >
        <output class="label">{{item.label}}</output>
        <output class="msg">{{ item.msg }}</output>
      </li>
    </ul>
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
  methods: {}
};
</script>
<style lang="scss" scoped>
/**dialog**/
.el-dialog {
  ul > li {
    width: 100%;
    height: auto;
    min-height: 40px;
    line-height: 40px;
    list-style: none;
    output {
      display: inline-block;
      &.label {
        width: 100px;
      }
      &.msg {
        width: calc(100% - 102px);
        vertical-align: top;
      }
    }
  }
}
.dialog-details {
  text-align: center;
}
</style>
