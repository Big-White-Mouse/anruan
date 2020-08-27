<template>
  <div class="main-box">
    <div class="sidebar" >
      <el-tooltip
        :class="['item','tools',{'tool-active':flag === 'cursor'}]"
        effect="dark"
        content="鼠标"
        placement="right"
      >
        <el-button @click="initDrawTools('cursor')">
          <span class="iconfont">&#xe6c7;</span>
        </el-button>
      </el-tooltip>
      <span class="line"></span>
      <el-tooltip
        :class="['item','tools',{'tool-active':flag === 'rectangle'}]"
        effect="dark"
        content="矩形标记"
        placement="right"
      >
        <el-button @click="initDrawTools('rectangle')">
          <span class="iconfont">&#xe88e;</span>
        </el-button>
      </el-tooltip>
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
      <div class="main-btn-box">
        <div class="images">
          <div class="img-btn to-start" @click="changeImg('start')">
            <i class="el-icon-d-arrow-left"></i>
          </div>
          <div class="img-btn back" @click="changeImg('back')">
            <i class="el-icon-arrow-left"></i>
          </div>
          <div class="img-btn this">
            <span>{{ imageIndex + 1 }}</span>
          </div>
          <div class="img-btn next" @click="changeImg('next')">
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="img-btn to-end" @click="changeImg('end')">
            <i class="el-icon-d-arrow-right"></i>
          </div>
        </div>
        <div class="main-func">
          <div class="main-btn save">
            <i class="el-icon-document-checked"></i>
            <span>保存</span>
          </div>
          <div class="main-btn commit">
            <i class="el-icon-upload"></i>
            <span>提交所有</span>
          </div>
          <div class="main-btn abandon">
            <span>废弃</span>
          </div>
        </div>
      </div>
    </div>
    <div class="paint-box" ref="paintBox">
      <canvas width="500px" height="400px" id="myCanvas" ref="myCanvas"></canvas>
      <div
        v-if="flag==='rectangle'"
        ref="vl"
        class="vertical-line"
      ></div>
      <div
        v-if="flag==='rectangle'"
        ref="ll"
        class="level-line"
      ></div>
    </div>
  </div>
</template>

<script>
import JSZip from '@/assets/js/jszip'
export default {
  created() {
    this.getImagesInfo()
    this.getImages()
  },
  mounted() {
    this.initCanvas()
  },
  data(){
    return{
      //哪一个工具
      flag: 'cursor',
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

      //画布对象
      myCanvas: {},
      //画笔对象
      ctx: {},
      isDrawing: false,

      //图片相关
      imagesData: [],
      imagesSize: 0,
      imageIndex: 0,
      imageInfo: {},

    }
  },
  methods: {
    //右侧信息栏
    showBar(){
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
    //获取images信息列表
    getImagesInfo(){
      this.$http.get('v1/tasks/' + this.$route.params.index + '/data/meta').then( e =>{
        this.imagesSize = e.data.size
      })
    },
    //获取图片压缩包并解压，讲base64代码保存到imagesData里
    getImages(){
      //请求图片数据
      this.$http.get('v1/tasks/'+ this.$route.params.index +'/data', {
        params: {
          type: 'chunk',
          number: 0,
          quality: 'compressed'
        },
        //请求数据的格式
        responseType:'arraybuffer',
      }).then(e=>{
        //使用JSZip解压数据
        const zip = new JSZip()
        if(e.data){
          zip.loadAsync(e.data).then((imgData)=>{
            //获取图片base64格式信息
            for(let key in imgData.files){
              let base = imgData.file(zip.files[key].name).async('base64')
              base.then(res=>{
                this.imagesData.push(res)
              })
            }
          })
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    //初始化画布
    initCanvas(){
      //获取元素
      this.myCanvas = this.$refs.myCanvas
      //加载画笔工具
      this.ctx = this.myCanvas.getContext('2d')
      //根据屏幕设置canvas大小
      this.myCanvas.width = document.body.clientWidth - 46
      this.myCanvas.height = document.body.clientHeight - 35
      //绘制图片
      this.drawImages()
      //设置鼠标样式
      document.getElementById('myCanvas').style.cursor = 'default'
    },
    //绘制图片
    drawImages(){
      //将解压出的文件以base64格式放到图片对象中
      let img = new Image()
      //清除画布
      this.ctx.clearRect(0,0, this.myCanvas.width, this.myCanvas.height)
      setTimeout(()=>{
        img.src = "data:image/png;base64," + this.imagesData[this.imageIndex]
      },100)
      setTimeout(()=>{
        if(img.width/img.height < (this.myCanvas.width-300)/this.myCanvas.height){
          this.imageInfo = {
            left: (this.myCanvas.width-300-this.myCanvas.height*img.width/img.height)/2 + 5,
            top: 5,
            width: this.myCanvas.height*img.width/img.height - 10,
            height: this.myCanvas.height - 10
          }
        } else {
          this.imageInfo = {
            left: 5,
            top: (this.myCanvas.height - (this.myCanvas.width-300)*img.height/img.width)/2 + 5,
            width: this.myCanvas.width - 310,
            height: (this.myCanvas.width - 300)*img.height/img.width - 10
          }
        }
        //将图片绘制到canvas上
        this.ctx.drawImage(img, this.imageInfo.left, this.imageInfo.top, this.imageInfo.width, this.imageInfo.height)
      }, 200)
    },
    //切换图片
    changeImg(mod){
      if(mod === 'start'){
        if(this.imageIndex !== 0){
          this.imageIndex = 0
          this.drawImages()
        }
      } else if(mod === 'back'){
        if(this.imageIndex !== 0){
          this.imageIndex -= 1
          this.drawImages()
        }
      } else if(mod === 'next'){
        if(this.imageIndex !== (this.imagesSize-1)){
          this.imageIndex += 1
          this.drawImages()
        }
      } else if(mod === 'end'){
        if(this.imageIndex !== (this.imagesSize-1)){
          this.imageIndex = this.imagesSize - 1
          this.drawImages()
        }
      }

    },
    //开始绘制
    initDrawTools(attr){
      //处于相应的工具状态
      this.flag = attr
      //跟手基准线
      //选择画笔
      if(attr === 'rectangle'){
        this.setToLine()
        this.createRec()
      } else if (attr === 'cursor'){
        this.setToCursor()
      }
    },
    //切换成鼠标的样式
    setToCursor(){
      //恢复鼠标样式
      this.$refs.myCanvas.style.cursor = 'default'
      //移除跟随鼠标
      document.body.removeEventListener('mousemove', this.followMouse, false)
      //移除click创建元素
      document.body.removeEventListener( 'click', this.createRec, true)
    },
    //切换成矩形标记的样式
    setToLine(){
      //隐藏鼠标
      this.$refs.myCanvas.style.cursor = 'none'
      //跟随鼠标
      document.body.addEventListener('mousemove', this.followMouse, false)
      //创建矩形框
      document.body.addEventListener('click', this.createRec, true)
    },
    //跟随鼠标的基准线
    followMouse(e){
      let mPos = this.getMousePos(e)
      this.$refs.vl.style.left = mPos.left + 'px'
      this.$refs.ll.style.top = mPos.top + 'px'
    },
    //获取鼠标位置
    getMousePos(event){
      return {
        top: event.clientY,
        left: event.clientX
      }
    },
    //画矩形
    createRec(e){
      if(e){
        let mPos = this.getMousePos(e)
        console.log(mPos);
      }
      // if(!this.isDrawing){
      //   let rec = document.createElement('div')
      //   rec.className += 'rec-obj'
      //   this.$refs.paintBox.appendChild(rec)
      // }
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
  z-index: 3;
  left: 0;
  top: 0;
  height: 100%;
  width: 46px;
  padding-top: 65px;
  box-sizing: border-box;
  background-color: #bbe6d6;
  .tools{
    height: 36px !important;
    width: 36px !important;
    padding: 0 !important;
    border: 0 !important;
    background-color: #bbe6d6;
    margin: 5px;
    line-height: 36px;
    border-radius: 5px;
    transition: background-color 0.2s;
    text-align: center;
    span{
      font-size: 24px;
      color: #222222 !important;
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
  z-index: 3;
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
    background-color: #fafbfc;
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
  .images{
    width: 290px;
    height: 40px;
    margin: 5px;
    .img-btn{
      height: 30px;
      width: 36px;
      background-color: #def1ea;
      margin: 5px 11px;
      float: left;
      border-radius: 5px;
      text-align: center;
      line-height: 30px;
      transition: all 0.2s;
      font-size: 18px;
    }
    .img-btn:hover{
      background-color: #bbe6d6;
    }
    .this{
      font-size: 14px;
    }
    .this:hover{
      background-color: #def1ea;
    }
  }
  .main-func{
    width: 290px;
    height: 80px;
    margin: 5px;
    padding: 0 15px;
    box-sizing: border-box;
    .main-btn{
      width: 90px;
      height: 36px;
      float: left;
      margin: 10px 2px;
      border-radius: 5px;
      background-color: #bbe6d6;
      line-height: 36px;
      text-align: center;
      letter-spacing: 4px;
      font-size: 14px;
      transition: all 0.2s;
      i{
        font-size: 18px;
      }
    }
    .abandon{
      width: 40px;
      height: 20px;
      font-size: 8px;
      line-height: 20px;
      letter-spacing: 1px;
      margin-top: 26px;
      border-radius: 2px;
    }
    .commit{
      width: 100px;
      letter-spacing: 2px;
    }
    .main-btn:hover{
      background-color: #b1eed8;
    }
  }
}
.paint-box{
  margin: 35px 0 0 46px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-color: #eeeeee;
  cursor: none;
  .vertical-line{
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    height: 100%;
    width: 1px;
    background-color: rgba(0,0,0,0.4);
  }
  .level-line{
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    height: 1px;
    width: 100%;
    background-color: rgba(0,0,0,0.4);
  }
  .rec-obj{
    position: absolute;
    top: 100px;
    left: 100px;
    width: 100px;
    height: 100px;
    background-color: transparent;
    cursor: default;
    border: 1px solid #333333;
  }
}
</style>
