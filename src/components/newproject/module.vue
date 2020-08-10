<template>
  <div class="module-box">
    <span class="title-box">选择标签</span>
    <div class="main-box">
      <div class="tab-box">
        <el-tag
          v-for="tag in dynamicTags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
          class="tag"
        >
          {{tag}}
        </el-tag>
        <el-input
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          class="input-new-tag"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
      </div>
      <div class="attribute-box">

      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      dynamicTags: ['标签一', '标签二', '标签三'],
      inputVisible: false,
      inputValue: ''
    }
  },
  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    }
  }
}
</script>
<style lang="less" scoped>
.module-box{
  width: 100%;
  .title-box{
    display: block;
    height: 40px;
    width: 120px;
    border-radius: 10px 10px 0 0;
    background-color: #e5f8f4;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
  }
  .main-box{
    min-height: 200px;
    background-color: #e5f8f4;
    border-radius: 0 12px 12px 12px;
    .tab-box{
      width: 200px;

      //高度要改回非固定
      //height: 200px;

      .tag{
        display: block !important;
        border-radius: 0;
        border: 0;
        border-right: 1px solid #d9ecff;
        border-bottom: 1px solid #d9ecff;
        background-color: transparent;
      }
      .button-new-tag{
        background-color: transparent;
        display: block;
        width: 100%;
        border: 0;
        border-right: 1px solid #d9ecff;
        border-bottom: 1px solid #d9ecff;
      }
      .input-new-tag{
        background-color: transparent;
        display: block;
      }
    }
    .attribute-box{
      width: 100%;
      height: 100%;
      background-color: green;
    }
  }
}
</style>
