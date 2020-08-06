<template>
  <div class="upload-box">
    <input type="file" ref="getfile" class="choose" @change="getFile($event)" multiple="multiple">
    <div class="to-choose" @click="toGetFile">
      <span>拖拽或点击上传</span>
      <div class="choose-progress"></div>
    </div>
    <div class="chosen-files">
      <div class="header">
        <div class="name"></div>
        <div class="type"></div>
        <div class="size"></div>
      </div>

    </div>
  </div>
</template>
<script>
export default {
  data () {
    return{
      fileList: [
      ]
    }
  },
  methods: {
    toGetFile(){
      this.$refs.getfile.dispatchEvent(new MouseEvent('click'))
    },
    getFile(event){
      console.log(event.target.files);
      this.fileList = event.target.files
      console.log(this.fileList);
    }
  }
}
</script>
<style lang="less" scoped>
.upload-box{
  width: 100%;
  height: 100%;
  position: relative;
  .choose{
    display: none;
  }
  .to-choose{
    position: absolute;
    left: 0;
    width: 400px;
    height: 100%;
    border: 2px dashed #aceedb;
    box-sizing: border-box;
    border-radius: 30px;
    background-color: #ecf5f3;
    text-align: center;
    line-height: 440px;
    font-size: 28px;
    color: #7c8786;
    .choose-progress{
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 100%;
      border-radius: 30px;
      background-color: rgba(172,238,219,0.5);
    }
  }
  .to-choose:hover{
    border: 2px dashed #6fcdb2;
  }
  .chosen-files{
    position: absolute;
    border: 2px solid #aceedb;
    background-color: #ecf5f3;
    border-radius: 30px;
    height: 100%;
    width: 480px;
    right: 0;

  }

}
</style>
