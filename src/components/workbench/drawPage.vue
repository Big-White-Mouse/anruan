<template>
  <div>
    <div class="sidebar" ref="bar">
      <div
        :class="['tools',{'tool-active':flag === 'mouse'}]"
        @click="changeTools('mouse')"
      >
        <span class="iconfont">&#xe6c7</span>
      </div>
      <span class="line"></span>
      <div
        :class="['tools',{'tool-active':flag === 'rectangle'}]"
        @click="changeTools('rectangle')"
      >
        <span class="iconfont">&#xe88e</span>
      </div>
    </div>
    .
  </div>
</template>

<script>
export default {
  data(){
    return{
      flag: 'mouse'
    }
  },
  methods: {
    changeTools(attr){
      this.flag = attr
    }
  }
}
</script>

<style lang="less" scoped>
.sidebar{
  position: absolute;
  left: 0;
  height: 100%;
  width: 46px;
  padding-top: 30px;
  background-color: #bbe6d6;
  .tools{
    height: 36px;
    width: 36px;
    margin: 5px;
    line-height: 36px;
    border-radius: 5px;
    transition: background-color 0.2s;
    text-align: center;
    span{
      font-size: 24px;
    }
  }
  .tools:hover{
    background-color: #99baae;
  }
  .tool-active{
    background-color: #a6c7bb;
  }
  .line{
    display: block;
    width: 100%;
    height: 1px;
    background-color: #b3d9cb;
  }
}
</style>
