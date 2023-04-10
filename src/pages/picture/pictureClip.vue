<template>
  <div>
    <van-nav-bar
      title="裁剪图片"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />
    <div style="width:100%;height:500px">
      <vue-cropper
        autoCrop
        :img="imgData"
        ref="cropper"
        centerBox
        :outputSize=0.5
      />
    </div>
    <van-button @click="getCropData()" block style="margin:10px 0" type="primary">
      一键识别{{ ' => 识别' + (this.recognizeType === 'single' ? '单' : '多') + '虫' }}
    </van-button>
  </div>
</template>

<script>
import global from "../../public/global";
import axios from "axios";
import {Toast} from "vant";
import qs from "qs";

export default {
  name: "pictureClip",
  data() {
    return {
      imgData: '',
      recognizeType: '',
    }
  },
  methods: {
    getCropData() {
      let that = this;
      const clipToast = Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "正在解析裁剪的图片，请稍等..."
      });
      this.$refs.cropper.getCropData((data) => {
        console.log(data)
        clipToast.clear()
        const uploadToast = Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true,
          message: "正在上传图片，请稍等..."
        });
        // 如果是单虫识别，那么就直接跳转到相应的害虫页面
        if (that.recognizeType === 'single') {
          this.axios({
            method: 'post',
            url: global.PythonApiUrl + '/analysePest/singular',
            data: qs.stringify({
              'imgDataBase64': encodeURIComponent(data)
            }),
          })
            .then((response) => {
              let speciesId = response.data.speciesId
              let prob = response.data.prob
              this.$router.push({
                name: 'pestInfoAndProb',
                params: {
                  pestId: speciesId,
                  prob: prob
                }
              })
            })
            .catch((response) => {
              console.log(response)
            })
            .then((response) => {
              uploadToast.clear()
            });
        } else {
          this.axios({
            method: 'post',
            url: global.PythonApiUrl + '/analysePest/multiple',
            data: qs.stringify({
              'imgDataBase64': encodeURIComponent(data)
            }),
          })
            .then((response) => {
              this.$store.commit('updateMultipleRecognizedData', response.data)
              this.$router.push({
                name: 'preliminaryIdentification'
              })
            })
            .catch((response) => {
              console.log(response)
            })
            .then((response) => {
              uploadToast.clear()
            });
        }
      })
    },
    goBack() {
      this.$router.go(-1);//返回上一层
    }
  },
  created() {
    // 使用Vuex存储imgData
    this.imgData = this.$store.state.imgData
    this.recognizeType = this.$route.params.recognizeType
    document.title = '识别' + (this.recognizeType === 'single' ? '单' : '多') + '虫'
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
