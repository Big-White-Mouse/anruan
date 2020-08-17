import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    projectInfo: {
      "name": "",
      "describe": '',
      "image_quality": 70,
      "labels": [

      ],
      "z_order": false,
    },
    allFileList: []
  },
  mutations: {
    addToStore(state, labData){
      state.projectInfo.labels = labData
    },
    addImageQuality(state, image_quality){
      state.projectInfo.image_quality = image_quality
    },
    cleanStore(){
      this.state.projectInfo = {
        "name": "",
        "describe": '',
        "image_quality": '',
        "labels": [

        ],
        "z_order": false,
      }
    },
    cleanFileList(){
      this.state.allFileList = []
    },
    saveFileList(state, listData){
      state.allFileList = listData
    }
  },
  actions: {
  },
  modules: {
  }
})
