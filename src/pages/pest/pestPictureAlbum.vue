<template>
  <div>
    <van-nav-bar title="害虫图册" left-text="返回" left-arrow @click-left="goBack"/>

    <van-empty description="一大波昆虫正在飞来...正在加载中..." image="network" v-if="classifiedImageData.length === 0"/>

    <van-collapse v-model="activeNames" v-if="classifiedImageData.length !== 0">
      <van-collapse-item :title="perClassify.name" :name="perClassify.name"
                         v-for="perClassify in classifiedImageData" :key="perClassify.name">
        <div class="album">
          <van-image width="6rem" height="6rem" fit="cover"
                     :src="imgData" class="pictureItem"
                     v-for="(imgData,index) in perClassify.imgDatas" :key="index"
                     @click="displayPicture(imgData)">
            <template v-slot:loading>
              <van-loading type="spinner" size="20"/>
            </template>
          </van-image>
        </div>
      </van-collapse-item>
    </van-collapse>

    <van-image-preview v-model="showPicture.active" :images="showPicture.pictures"
                       :showIndex="false" :closeable="true">
      <!--<template v-slot:index>第{{ index }}页</template>-->
    </van-image-preview>
  </div>
</template>

<script>
import global from "../../public/global";

export default {
  name: "pestPictureAlbum",
  data() {
    return {
      activeNames: [],
      pestId: '',
      classifiedImageData: [],
      showPicture: {
        active: false,
        pictures: [],
      },
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);//返回上一层
    },
    getPestClassifiedImageAbsolutePathBySpeciesId() {
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/resource/img/classified',
        params: {
          speciesId: this.pestId
        }
      })
        .then((response) => {
          this.classifiedImageData = []
          for (const albumName in response.data.data) {
            if (this.activeNames.length === 0) {
              this.activeNames.push(albumName)
            }
            let imgDatas = []
            for (const imgData of response.data.data[albumName]) {
              imgDatas.push(imgData)
            }
            this.classifiedImageData.push({
              name: albumName,
              imgDatas: imgDatas
            })
          }
        })
        .catch((response) => {
        })
        .then((response) => {
        });
    },
    // 展示图片
    displayPicture(img) {
      this.showPicture.active = true
      this.showPicture.pictures = [img]
    },
  },
  mounted() {
    this.getPestClassifiedImageAbsolutePathBySpeciesId()
  },
  created() {
    this.pestId = this.$route.params.pestId
  }
}
</script>

<style scoped>
.album {
  display: flex;
  align-items: center;
  justify-items: center;
  justify-content: space-around;
  flex-flow: wrap;
}

.pictureItem {
  margin-top: 10px;
}
</style>
