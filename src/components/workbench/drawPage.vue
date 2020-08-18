<template>
  <div class="main-box">
    <div class="sidebar" >
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
    <div class="object-bar" ref="objBar">
      <div class="drawer" ref="drawer" @click="showBar()">
        <i :class="[{'el-icon-right':flag2},{'el-icon-back':!flag2}]"></i>
      </div>
      <div class="label-obj">
        <div class="label-info">
          <span>index</span>
          <div class="change-label"></div>
        </div>
        <div class="label-func">
          <div class="lock"></div>
          <div class="visible"></div>
          <div class="delete"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      //哪一个工具
      flag: 'mouse',
      //项目栏是否展开
      flag2: true
    }
  },
  methods: {
    changeTools(attr){
      this.flag = attr
    },
    showBar(){
      console.log(1);
      if(this.flag2){
        this.$refs.objBar.style.right = '-300px'
        this.$refs.drawer.style.left = '-35px'
        this.flag2 = false
      } else {
        this.$refs.objBar.style.right = '0px'
        this.$refs.drawer.style.left = '0px'
        this.flag2 = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.main-box{
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  overflow: hidden;
}
.sidebar{
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 46px;
  padding-top: 65px;
  box-sizing: border-box;
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
.object-bar{
  position: absolute;
  top: 0;
  right: 0px;
  width: 300px;
  height: 100%;
  padding-top: 65px;
  box-sizing: border-box;
  background-color: #e4f5ef;
  box-shadow: -1px 0 6px 2px #c1d4cd;
  transition: all 0.4s ease;
  .drawer{
    position: absolute;
    top: 35px;
    left: 0px;
    width: 30px;
    height: 30px;
    background-color: rgba(0,0,0,0);
    transition: background-color 0.3s, left 0.4s ease;
    i{
      font-size: 30px;
      line-height: 30px;
      text-align: center;
    }
  }
  .drawer:hover{
    background-color: rgba(0,0,0,0.1);
  }
}
</style>
