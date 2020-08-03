<template>
  <div class="item-box">
    <projectitem></projectitem>
    <projectitem></projectitem>
    <projectitem></projectitem>
    <projectitem></projectitem>
    <newprojectitem></newprojectitem>
  </div>
</template>

<script>
import projectitem from "@/components/allproject/projectitem";
import newprojectitem from "@/components/allproject/newprojectitem";
export default {
  components: {
    projectitem,
    newprojectitem
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
