<template>
  <div class="home-box">
    <el-container>
      <el-aside width="160px">
        <div class="title">
          安软标记平台
        </div>
        <div class="tab-box">
          <el-row class="tac">
            <el-menu
              default-active="1"
              class="el-menu-vertical-demo"
              background-color="transparent"
              text-color="#fff"
              active-text-color="#ffd04b">
              <el-menu-item index="1">
                <i class="el-icon-menu"></i>
                <span slot="title">全部项目</span>
              </el-menu-item>
              <el-menu-item index="2">
                <i class="el-icon-user-solid"></i>
                <span slot="title">个人中心</span>
              </el-menu-item>
              <el-menu-item index="3">
                <i class="el-icon-s-tools"></i>
                <span slot="title">管理中心</span>
              </el-menu-item>
            </el-menu>
          </el-row>
        </div>
      </el-aside>
      <el-container>
        <el-header height="40px">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
          </el-breadcrumb>
        </el-header>
        <el-main>

        </el-main>
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
    .el-container{
      height: 100%;
    }
    .el-aside{
      background-color: #3c4147;
      .title{
        width: 100%;
        height: 80px;
        background-color: #272b34;
        text-align: center;
        line-height: 80px;
        color: #eeeeee;
        font-size: 22px;
      }
      .tab-box{
        width: 100%;
        padding-top: 20px;
        .el-menu-vertical-demo{
          width: 100%;
          .el-menu-item{
            margin-bottom: 6px;
          }
          .el-menu-item:hover{
            background-color: #0E2F46 !important;
          }
        }
      }
    }
    .el-header{
      background-color: #51b5ff+;
      .el-breadcrumb{
        line-height: 40px;
        font-size: 16px;
      }
    }
    .el-main{
      background-color: #eeeeee;
    }
  }
</style>
