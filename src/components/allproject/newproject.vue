<template>
  <div class="new-container">
    <div class="guide-line-box">
      <div class="guide bacic guide-active">
        <span>1</span>
        <span class="text">基本信息</span>
      </div>
      <div class="line"></div>
      <div class="guide data">
        <span>2</span>
        <span class="text">上传数据集</span>
      </div>
      <div class="line"></div>
      <div class="guide template">
        <span>3</span>
        <span class="text">选择模板</span>
      </div>
    </div>
    <div class="project-info-box">

    </div>
    <div class="btn-box">

    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.new-container{
  width: 100%;
  .guide-line-box{
    width: 1000px;
    height: 60px;
    margin-top: 20px;
    padding-left: 50px ;
    .guide{
      height: 100%;
      width: 60px;
      border-radius: 50%;
      background-color: #D4EBDB;
      float: left;
      text-align: center;
      line-height: 60px;
      span{
        color: #ffffff;
        font-size: 20px;
      }
      .text{
        color: #222222;
        font-size: 14px;
        display: block;
        height: 26px;
        width: 80px;
        text-align: left;
        line-height: 26px;
      }
    }
    .guide-active{
      background-color: #318B71;
    }
    .line{
      float: left;
      width: 300px;
      height: 2px;
      background-color: #D4EBDB;
      margin:  28px 10px;
    }
  }
  .project-info-box{
    width: 1000px;
    height: 460px;
    background-color: #D2EFFA;
    margin: 40px 20px;
    border-radius: 30px;
  }
}
</style>
