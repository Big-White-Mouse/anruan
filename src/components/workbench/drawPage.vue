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
        <div v-for="item in shapes.rectangles" :key="item.index" class="label-obj">
          <div class="label-info">
            <span>{{ item.index }}</span>
            <div class="change-label">
              <el-select
                v-model="shapes.rectangles[item.index-1].label_id"
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
          <div class="main-btn save" @click="saveTagsToStore">
            <i class="el-icon-document-checked"></i>
            <span>保存</span>
          </div>
          <div class="main-btn commit" @click="submitTags">
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
      <div class="rec-box" ref="recBox"></div>
    </div>
  </div>
</template>

<script>
import JSZip from '@/assets/js/jszip'
export default {
  data(){
    return{
      //哪一个工具
      flag: 'cursor',
      //项目栏是否展开
      flag2: true,
      //
      lock: false,

      options: [

      ],
      value: '',

      //画布对象
      myCanvas: {},
      //画笔对象
      ctx: {},
      isDrawing: false,

      //图片相关
      isGotImg: false,
      imagesData: [],
      imagesSize: 0,
      imageIndex: 0,
      imageInfo: {},

      //矩形对象
      shapes: {
        rectangles: [],
      },
      rectangleIndex: 1,
      recTop: 0,
      recLeft: 0,

      //job信息
      jobId: 0,
    }
  },
  created() {
    //获取图片信息
    this.getImagesInfo()
    //获取job信息
    this.getJobInfo()
  },
  mounted() {
    this.getImages()
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
      console.log("0.开始请求数据");
      this.$http.get('v1/tasks/'+ this.$route.params.index +'/data', {
        params: {
          type: 'chunk',
          number: 0,
          quality: 'compressed'
        },
        //请求数据的格式
        responseType:'arraybuffer',
      }).then(e=>{
        console.log("1.图片获取完成")
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
            console.log("2.图片解压完成")
            this.isGotImg = true
          })
        }
      }).then(() => {
          this.initCanvas()
        }
      ).catch(err=>{
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

      console.log("3.画布初始化完成")
      //绘制图片
      this.drawImages()
      //设置鼠标样式
      document.getElementById('myCanvas').style.cursor = 'default'
    },
    //绘制图片
    drawImages(){
      //将解压出的文件以base64格式放到图片对象中
      let img = new Image()

      console.log("4.图片对象初始化完成");
      //清除画布
      this.ctx.clearRect(0,0, this.myCanvas.width, this.myCanvas.height)
      setTimeout(()=>{
        img.src = "data:image/png;base64," + this.imagesData[this.imageIndex]
        console.log("5.base64数据嵌入完成");
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
        console.log("6.图片尺寸数据处理完成");
        //将图片绘制到canvas上
        this.ctx.drawImage(img, this.imageInfo.left, this.imageInfo.top, this.imageInfo.width, this.imageInfo.height)
        console.log("7.图片绘制完成");
      }, 200)
    },
    //切换图片
    changeImg(mod){
      if(mod === 'start'){
        if(this.imageIndex !== 0){
          this.imageIndex = 0
          this.drawImages()
          this.removeRec('all')
          this.reDrawTags(this.imageIndex)
        }
      } else if(mod === 'back'){
        if(this.imageIndex !== 0){
          this.imageIndex -= 1
          this.drawImages()
          this.removeRec('all')
          this.reDrawTags(this.imageIndex)
        }
      } else if(mod === 'next'){
        if(this.imageIndex !== (this.imagesSize-1)){
          this.imageIndex += 1
          this.drawImages()
          this.removeRec('all')
          this.reDrawTags(this.imageIndex)
        }
      } else if(mod === 'end'){
        if(this.imageIndex !== (this.imagesSize-1)){
          this.imageIndex = this.imagesSize - 1
          this.drawImages()
          this.removeRec('all')
          this.reDrawTags(this.imageIndex)
        }
      }

    },
    //切换工具
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
      document.getElementsByClassName('rec-obj').forEach((item)=>{
        item.style.cursor = 'default'
      })
      //移除跟随鼠标
      document.body.removeEventListener('mousemove', this.followMouse, false)
      //如果没有完成矩形的绘制
      if(this.isDrawing){
        document.body.removeEventListener('mousemove', this.resizeRec, false)
        this.isDrawing = !this.isDrawing
      }
      //移除click创建元素
      document.body.removeEventListener( 'mousedown', this.createRec, true)
    },
    //切换成矩形标记的样式
    setToLine(){
      //隐藏鼠标
      this.$refs.myCanvas.style.cursor = 'none'
      document.getElementsByClassName('rec-obj').forEach((item)=>{
        item.style.cursor = 'none'
      })
      //跟随鼠标
      document.body.addEventListener('mousemove', this.followMouse, false)
      //创建矩形框
      document.body.addEventListener('mousedown', this.createRec, true)
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
        //获取点击的坐标
        let mPos = this.getMousePos(e)
        //获取图片相对页面的位置
        let leftBorder = parseInt(this.imageInfo.left) + 46
        let topBorder = parseInt(this.imageInfo.top) + 35
        let rightBorder = leftBorder + parseInt(this.imageInfo.width)
        let bottomBorder = topBorder + parseInt(this.imageInfo.height)
        //如果在图片上点击
        if(mPos.top >= topBorder && mPos.top <= bottomBorder && mPos.left >= leftBorder && mPos.left <= rightBorder){
          if(!this.isDrawing){
            //转换绘制状态
            this.isDrawing = !this.isDrawing
            //创建元素并设置元素的左上角位置
            let rec = document.createElement('div')
            rec.className += 'rec-obj'
            rec.style.top = mPos.top + 'px'
            rec.style.left = mPos.left + 'px'
            this.recTop = mPos.top
            this.recLeft = mPos.left
            //向矩形框数组添加对象
            let r = {
              //矩形框的序号
              type: "rectangle",
              occluded:false,
              z_order:0,
              index: this.rectangleIndex,
              el: rec,
              // id:5,
              frame: this.imageIndex + 1,
              label_id: '请选择',
              group:0,
              attributes:[
              ],
              points:[
              ],
            }
            this.rectangleIndex ++
            this.shapes.rectangles.push(r)
            //渲染到页面上
            this.$refs.recBox.appendChild(rec)
            //根据鼠标位置调整矩形框的大小
            document.body.addEventListener('mousemove', this.resizeRec, false)
          } else {
            this.isDrawing = !this.isDrawing
            document.body.removeEventListener('mousemove', this.resizeRec, false)
            this.shapes.rectangles[this.shapes.rectangles.length - 1].points = [
              parseInt(this.shapes.rectangles[this.shapes.rectangles.length - 1].el.style.left.replace('px','')) - (parseInt(this.imageInfo.left) + 46),
              parseInt(this.shapes.rectangles[this.shapes.rectangles.length - 1].el.style.top.replace('px','')) - (parseInt(this.imageInfo.top) + 35),
              parseInt(this.shapes.rectangles[this.shapes.rectangles.length - 1].el.style.width.replace('px',''))+(parseInt(this.shapes.rectangles[this.shapes.rectangles.length - 1].el.style.left.replace('px','')) - (parseInt(this.imageInfo.left) + 46)),
              parseInt(this.shapes.rectangles[this.shapes.rectangles.length - 1].el.style.height.replace('px',''))+(parseInt(this.shapes.rectangles[this.shapes.rectangles.length - 1].el.style.top.replace('px','')) - (parseInt(this.imageInfo.top) + 35)),
            ]
            this.initDrawTools('cursor')
          }
        }
      }
    },
    //鼠标移动控制矩形框大小
    resizeRec(e){
      let mPos = this.getMousePos(e)
      if(mPos.left >= this.recLeft && mPos.top >= this.recTop){
        //鼠标在右下
        this.drawRec( this.recTop, mPos.left+1, mPos.top+1, this.recLeft)
      } else if (mPos.left >= this.recLeft && mPos.top <= this.recTop){
        //右上
        this.drawRec(mPos.top, mPos.left+1, this.recTop, this.recLeft)
      } else if (mPos.left <= this.recLeft && mPos.top <= this.recTop){
        //左上
        this.drawRec(mPos.top, this.recLeft, this.recTop, mPos.left)
      } else if (mPos.left <= this.recLeft && mPos.top >= this.recTop){
        //左下
        this.drawRec(this.recTop, this.recLeft, mPos.top+1, mPos.left)
      }
    },
    //绘制矩形框
    drawRec(top, right, bottom, left){
      this.shapes.rectangles[this.shapes.rectangles.length - 1].el.style.left = left + 'px'
      this.shapes.rectangles[this.shapes.rectangles.length - 1].el.style.top = top + 'px'
      this.shapes.rectangles[this.shapes.rectangles.length - 1].el.style.width = right - left + 'px'
      this.shapes.rectangles[this.shapes.rectangles.length - 1].el.style.height = bottom - top + 'px'
    },
    //删除元素
    removeRec(node){
      if(node === 'all'){
        this.$refs.recBox.innerHTML = ''
        this.shapes.rectangles = []
        this.rectangleIndex = 1
      }
    },
    //获取job信息
    getJobInfo(){
      this.$http.get('v1/tasks?',{
        params: {
          id: this.$route.params.index,
          page: 1,
          page_size: 10
        }
      }).then((e)=>{
        this.jobId = e.data.results[0].segments[0].jobs[0].id
        console.log(e)
        for(let item in e.data.results[0].labels){
          let label = {
            value: e.data.results[0].labels[item].id,
            label: e.data.results[0].labels[item].name
          }
          this.options.push(label)
        }
        console.log(this.options);
      })
    },
    //将标注信息存储到store中
    /** 多次保存会保存重复信息 */
    saveTagsToStore(){
      this.$store.commit('saveTagsInfo', this.shapes)
    },
    //提交标注信息
    submitTags(){
      let TagsInfo = this.$store.state.imageTags
      console.log(TagsInfo)
      // this.$http.patch('v1/tasks?page_size=10&id=3&page=1', TagsInfo).then((e)=>{
      //   console.log(e);
      // })
      this.$http.patch('v1/jobs/'+this.jobId+'/annotations?action=create', TagsInfo).then((e)=>{
        console.log(e)
      }).catch((err)=>{
        console.log(err);
      })
    },
    //切换图片接收信息重新绘制Tag
    /** 每个矩形框的标签没有绑定*/
    reDrawTags(index){
      //切换到了第几张图片
      let imgIndex = index + 1
      //从store获取所有的标注信息
      let TagsInfo = this.$store.state.imageTags.shapes
      //清洗出这张图片的标注信息
      console.log(TagsInfo);
      for(let item in TagsInfo){
        if(TagsInfo[item].frame === imgIndex){

          //创建矩形框
          let rec = document.createElement('div')
          rec.className += 'rec-obj'
          rec.style.left = parseInt(TagsInfo[item].points[0]) + parseInt(this.imageInfo.left) + 'px'
          rec.style.top = parseInt(TagsInfo[item].points[1]) + parseInt(this.imageInfo.top) + 'px'
          rec.style.width = parseInt(TagsInfo[item].points[2]) - parseInt(TagsInfo[item].points[0]) + 'px'
          rec.style.height = parseInt(TagsInfo[item].points[3]) - parseInt(TagsInfo[item].points[1]) + 'px'
          this.$refs.recBox.appendChild(rec)

          console.log(TagsInfo[item])
          //添加数据
          this.shapes.rectangles.push({
            type: TagsInfo[item].type,
            occluded: TagsInfo[item].occluded,
            z_order: TagsInfo[item].z_order,
            index: this.rectangleIndex,
            el: rec,
            // id:5,
            frame: TagsInfo[item].frame,
            label_id: TagsInfo[item].label_id,
            group: TagsInfo[item].group,
            attributes: TagsInfo[item].attributes,
            points: TagsInfo[item].points,
          })
          this.rectangleIndex ++
        }
      }
      //恢复鼠标样式
      document.getElementsByClassName('rec-obj').forEach((item)=>{
        item.style.cursor = 'default'
      })
    },

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
          padding-left: 20px;
          box-sizing: border-box;
          font-size: 14px;
          line-height: 30px;
          width: 30%;
          overflow: hidden;
        }
        .change-label{
          float: right;
          height: 100%;
          width: 60%;
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
          margin: 10px 20px ;
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
    position: absolute;
    bottom: 0;
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
    background-color: rgba(255,0,0,0.4);
  }
  .level-line{
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    height: 1px;
    width: 100%;
    background-color: rgba(255,0,0,0.4);
  }
}
/deep/ .rec-obj{
  position: absolute;
  width: 0;
  height: 0;
  background-color: transparent;
  cursor: none;
  box-sizing: border-box;
  border: 1px solid #333333;
}
///deep/ .rec-obj:hover{
//  border: 2px solid #555555;
//  background-color: rgba(228,254,239,0.3);
//}
</style>
