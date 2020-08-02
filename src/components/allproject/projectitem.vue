<template>
  <router-link
    :to="'workbench/' + projectId"
    tag="div"
    class="item"
  >
  </router-link>
</template>

<script>
export default {
  data() {
    return{
      projectId: '1'
    }
  }
}
</script>

<style lang="less" scoped>
  .item{
    width: 300px;
    height: 200px;
    background-color: pink;
    border-radius: 20px;
    float: left;
    margin: 10px;
  }
</style>
