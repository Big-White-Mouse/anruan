<template>
  <div class="main-box">
    <div class="sidebar" >
      <div
        :class="['tools',{'tool-active':flag === 'mouse'}]"
        @click="changeTools('mouse')"
      >
        <span class="iconfont">&#xe6c7;</span>
      </div>
      <span class="line"></span>
      <div
        :class="['tools',{'tool-active':flag === 'rectangle'}]"
        @click="changeTools('rectangle')"
      >
        <span class="iconfont">&#xe88e;</span>
      </div>
    </div>
    <div class="object-bar" ref="objBar">
      <div class="drawer" ref="drawer" @click="showBar()">
        <i :class="[{'el-icon-right':flag2},{'el-icon-back':!flag2}]"></i>
      </div>
      <div class="label-obj-box">
        <div class="label-obj">
          <div class="label-info">
            <span>info</span>
            <div class="change-label">
              <el-select
                v-model="value"
                placeholder="请选择"
                size="mini"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="label-func">
            <div class="func lock">
              <i :class="[{'el-icon-lock':lock},{'el-icon-unlock':!lock}]"></i>
            </div>
            <div class="func visible">
              <span class="iconfont">&#xe9c1;</span>
            </div>
            <div class="func delete">
              <i class="el-icon-delete"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="paint-box">
      <canvas width="500px" height="400px" id="myCanvas"></canvas>
    </div>
  </div>
</template>

<script>
import { DrawTools } from '@/assets/js/DrawTools'
export default {
  created() {
    this.initDrawTools()
  },
  data(){
    return{
      //哪一个工具
      flag: 'mouse',
      //项目栏是否展开
      flag2: true,
      //要改到每一个元素的身上
      lock: false,

      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '',

      //画笔相关
      tempStrokeStyle: 'blue',
      tempLineWidth: 1,
      imgPath: "@/assets/image/1.png",

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
    },
    initDrawTools(){
      //加载画笔工具
      let drawUtil = new DrawTools()
      //初始化
      drawUtil.init({
        'canvasId': 'myCanvas',
        "bgPic": this.imgPath,
      })
      // //赋值给全局对象？？？
      // window.drawUtil = drawUtil
      // //设置样式
      // drawUtil.setStyle({
      //   lineWidth: this.tempLineWidth,//线条宽度
      //   strokeStyle: this.tempStrokeStyle,//画笔颜色
      //   fillStyle: 'red',//填充色
      //   lineJoin: 'round',//线条交脚样式
      //   lineCap: 'round'//线条结束样式
      // })
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
  .label-obj-box{
    width: 280px;
    height: 550px;
    margin: 20px auto;
    border: 2px solid #b3d9cb;
    border-radius: 12px;
    overflow: auto;
    background-color: #eeeeee;
    .label-obj{
      height: 80px;
      width: 100%;
      border-bottom: 1px solid #cae7dc;
      .label-info{
        width: 100%;
        height: 30px;
        span{
          display: block;
          float: left;
          margin-left: 20px;
          font-size: 14px;
          line-height: 30px;
          width: 100px;
          overflow: hidden;
        }
        .change-label{
          float: right;
          height: 100%;
          width: 140px;
          box-sizing: border-box;
          margin-right: 20px;
          padding: 2px;
        }
      }
      .label-func{
        width: 100%;
        height: 50px;
        .func{
          width: 30px;
          height: 30px;
          margin: 10px 30px;
          float: left;
          border-radius: 6px;
          transition: background-color 0.2s;
          text-align: center;
          line-height: 30px;
        }
        .func:hover{
          background-color: #b9d4ca;
        }
      }
    }
  }
}
.paint-box{
  margin: 35px 0 0 46px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-color: #eeeeee;

}
</style>
