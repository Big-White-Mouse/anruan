<template>
  <div class="item-box">
    <projectitem></projectitem>
    <projectitem></projectitem>
    <projectitem></projectitem>
    <projectitem></projectitem>
  </div>
</template>

<script>
import projectitem from "@/components/allproject/projectitem";
export default {
  components: {
    projectitem
  },
  data() {
    return{

    }
  },
}
</script>

<style lang="less" scoped>
  .item-box {
    margin: 10px 60px 0 60px;
  }
</style>
