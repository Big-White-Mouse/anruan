import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    projectInfo: {
      name: '',
      info: '',
      labels: [

      ]
    }

  },
  mutations: {
    addToStore(labData){
      this.state.projectInfo.labels = labData
    }
  },
  actions: {
  },
  modules: {
  }
})
