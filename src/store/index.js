import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    projectInfo: {
      "name": "",
      "describe": '',
      "labels": [

      ],
      "z_order": false,
    },
    allFileList: [],
    image_quality: 70,
    imageTags: {
      "shapes":[
      ],
      "tracks":[
      ],
      "tags":[
      ],
      "version":26
    }
  },
  mutations: {
    addToStore(state, labData){
      state.projectInfo.labels = labData
    },
    addImageQuality(state, image_quality){
      state.image_quality = image_quality
    },
    cleanStore(){
      this.state.projectInfo = {
        "name": "",
        "describe": '',
        "labels": [

        ],
        "z_order": false,
      }
      this.state.image_quality = 70
    },
    cleanFileList(){
      this.state.allFileList = []
    },
    saveFileList(state, listData){
      state.allFileList = listData
    },
    /** spec_id需要动态绑定*/
    saveTagsInfo(state, shapes) {
      let item = {}
      for(item in shapes.rectangles){
        state.imageTags.shapes.push({
          "type":"rectangle",
          "occluded":false,
          "z_order":0,
          "points":shapes.rectangles[item].points,
          "attributes":[
            {
              "spec_id":"17",
              "value":""
            }
          ],
          "frame":shapes.rectangles[item].frame,
          "label_id":shapes.rectangles[item].label_id,
          "group":0
        })
      }
      console.log(state.imageTags.shapes);
    }
  },
  actions: {
  },
  modules: {
  }
})
