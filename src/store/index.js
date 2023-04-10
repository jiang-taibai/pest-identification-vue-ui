import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    imgData: '',  // 用户上传待识别的图片
    multipleRecognizedData: {
      imgBase64Data: '',  // 多虫识别后的识别结果图
      results: []
    },

  },
  mutations: {
    updateImgData(state, imgData) {
      state.imgData = imgData;
    },
    updateMultipleRecognizedData(state, data) {
      state.multipleRecognizedData = data
    }
  }
})
