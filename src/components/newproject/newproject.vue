<template>
  <div class="new-container">
    <div class="guide-line-box">
      <div :class="['guide', 'bacic', step===1 ? 'guide-active' : '']">
        <span>1</span>
        <span class="text">基本信息</span>
      </div>
      <div class="line"></div>
      <div :class="['guide', 'data', step===2 ? 'guide-active' : '']">
        <span>2</span>
        <span class="text">上传数据集</span>
      </div>
      <div class="line"></div>
      <div :class="['guide', 'template', step===3 ? 'guide-active' : '']">
        <span>3</span>
        <span class="text">选择模板</span>
      </div>
    </div>
    <div class="project-info-box">
      <basicinfo v-if="step === 1"></basicinfo>
      <uploaddata v-if="step === 2"></uploaddata>
      <module v-if="step === 3"></module>
    </div>
    <div class="btn-box">
      <div
        class="btn back"
        v-if="step === 2 || step === 3"
        @click="back()"
      >
        <span>上一步</span>
      </div>
      <div
        class="btn next"
        v-if="step === 1 || step === 2"
        @click="nextStep()"
      >
        <span>下一步</span>
      </div>
      <div
        class="btn submit"
        v-if="step === 3"
        @click="submit()"
      >
        <span>{{ text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import basicinfo from '@/components/newproject/basicinfo.vue'
import uploaddata from '@/components/newproject/uploaddata.vue'
import module from '@/components/newproject/module.vue'
export default {
  components :{
    basicinfo,
    uploaddata,
    module
  },
  data(){
    return{
      step: 1,
      text: '创建新项目'
    }
  },
  methods: {
    back(){
      if(this.step > 1){
        this.step --
      }
    },
    nextStep(){
      if(this.step < 3){
        this.step ++
      }
    },
    submit(){
      console.log('submit!');
    }
  }
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
    width: 900px;
    height: 460px;
    background-color: #D2EFFA;
    margin: 40px 20px 0 20px;
    border-radius: 30px;
  }
  .btn-box{
    position: relative;
    width: 900px;
    height: 50px;
    margin: 20px;
    .btn{
      height: 100%;
      background-color: #7EC492;
      position: absolute;
      border-radius: 8px;
      text-align: center;
      line-height: 50px;
      color: #ffffff;
      font-size: 18px;
    }
    .back{
      width: 120px;
      left: 0;
    }
    .next{
      width: 120px;
      left: 130px;
    }
    .submit{
      width: 150px;
      right: 0;
    }
  }
}
</style>
