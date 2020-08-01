<template>
  <div class="home-box">
    <el-container>
      <el-aside width="160px">
        <div class="title">
          安软标记平台
        </div>
      </el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

export default {
  components: {

  },
  data(){
    return {
      value1: true,
      value2: true
    }
  },
}
</script>

<style lang="less" scoped>
  .home-box{
    height: 100%;
  }
  .el-container{
    height: 100%;
  }
  .el-aside{
    background-color: #134263;
  }
</style>
