<template>
  <div>

    <div>
      <van-nav-bar
        title="害虫百科"
        left-text="返回"
        left-arrow fixed placeholder border
        @click-left="goBack"
      />
    </div>

    <div id="main">
      <div class="titleBox">
        视频讲解
      </div>
      <insect-video :pest-id="this.pestId"/>
      <van-skeleton title avatar :row="3" :loading="loading">
        <div class="itemBox">
          <div class="titleBox">
            {{ insectName }} [{{ pestId }}]
            <br v-if="prob">
            {{ prob ? '[识别概率为:' + (prob * 100).toFixed(2) + '%]' : '' }}
            <van-icon style="margin-left: 10px" :name="isFavorite?'star':'star-o'" @click="switchFavoriteState"/>
          </div>
          <div class="content">
            {{ intro }}
          </div>
          <div class="pictureBox">
            <van-image
              v-for="(imgData, index) in imgDatas"
              :key="index"
              width="6rem"
              height="6rem"
              fit="cover"
              :src="imgData"
              class="pictureItem"
              @click="displayPicture(imgData)"
            >
              <template v-slot:loading>
                <van-loading type="spinner" size="20"/>
              </template>
            </van-image>
          </div>
          <div style="text-align: right; color: red; margin-right: 1rem" @click="gotoPestPictureAlbum">查看更多图片>></div>
        </div>
      </van-skeleton>
      <van-skeleton title avatar :row="3" :loading="loading">
        <div class="itemBox" v-for="(info,index) in additionalInfos" :key="index">
          <div class="titleBox">
            {{ info.title }}
          </div>
          <div v-for="(paragraph,index) in info.desc" :key="index" class="content">
            {{ paragraph }}
          </div>
        </div>
      </van-skeleton>
      <div v-if="commodityList.length !== 0">
        <div class="titleBox">
          推荐商品
        </div>
        <CommodityItem v-for="commodityId in commodityList"
                       :key="commodityId" :commodity-id="commodityId">
        </CommodityItem>
      </div>
    </div>

    <van-image-preview v-model="showPicture.active" :images="showPicture.pictures"
                       :showIndex="false" :closeable="true">
      <!--<template v-slot:index>第{{ index }}页</template>-->
    </van-image-preview>

  </div>
</template>

<script>
import global from "../../public/global";
import CommodityItem from "../../components/CommodityItem";
import {Notify, Toast} from "vant";

import InsectVideo from "../../components/InsectVideo";

export default {
  name: "pestInfo",
  data() {
    return {
      pestId: null,
      prob: null, // 如果有概率的话
      isFavorite: false,
      insectName: null,
      intro: null,
      additionalInfos: [],
      loading: true,
      imgDatas: [],
      // 商品ID列表
      commodityList: [],
      // 展示图片
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
    gotoPestPictureAlbum() {
      this.$router.push({
        name: 'pestPictureAlbum',
        params: {
          pestId: this.pestId.toString()
        }
      })
    },
    getPestsDetailInfoBySpeciesId() {
      this.loading = true
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/pestDetailInfo/searchBySpeciesId',
        params: {
          speciesId: this.pestId
        }
      })
        .then((response) => {
          this.loading = false
          this.insectName = response.data.data.insectName
          this.intro = response.data.data.intro
          this.pestId = response.data.data.speciesId
          if (response.data.data.distribution !== null && response.data.data.distribution !== "") {
            this.additionalInfos.push({title: '分布区域', desc: response.data.data.distribution.split(/\n/)})
          }
          if (response.data.data.victims !== null && response.data.data.victims !== "") {
            this.additionalInfos.push({title: '寄生植物', desc: response.data.data.victims.split(/\n/)})
          }
          if (response.data.data.countermeasure !== null && response.data.data.countermeasure !== "") {
            this.additionalInfos.push({title: '防治策略', desc: response.data.data.countermeasure.split(/\n/)})
          }
          this.getPestIntroImagesBySpeciesId()
          this.getCommodityListBySpeciesId()
        })
        .catch((response) => {
        })
        .then((response) => {
        });
    },
    getPestIntroImagesBySpeciesId() {
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/resource/img/album-preview',
        params: {
          speciesId: this.pestId
        }
      })
        .then((response) => {
          this.imgDatas = []
          for (const imgData of response.data.data) {
            this.imgDatas.push(imgData)
          }
        })
        .catch((response) => {
        })
        .then((response) => {
        });
    },
    // 获得商品列表
    getCommodityListBySpeciesId() {
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/commodity/getCommodityListBySpeciesId',
        params: {
          speciesId: this.pestId
        },
      })
        .then((response) => {
          this.commodityList = response.data.data
          // console.log(response.data.data)
        })
        .catch((response) => {
        })
        .then((response) => {
        });
    },
    getIsFavorite() {
      if (!global.account.isLogin()) {
        this.isFavorite = false
        return;
      }
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/user-favorite/isFavorite',
        params: {
          userId: global.account.getAccount(),
          pestId: this.pestId
        }
      })
        .then((response) => {
          this.isFavorite = response.data.data
        })
        .catch((response) => {
        })
        .then((response) => {
        });
    },
    switchFavoriteState() {
      if (!global.account.isLogin()) {
        Toast.fail('登录后才可收藏哦');
        // Notify({type: 'warning', message: '登录后才可收藏哦'})
        return;
      }
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/user-favorite/switchFavoriteState',
        params: {
          userId: global.account.getAccount(),
          pestId: this.pestId
        }
      })
        .then((response) => {
          if (response.data.success) {
            Toast(response.data.data);
            this.isFavorite = !this.isFavorite
          }
        })
        .catch((response) => {
        })
        .then((response) => {
        });
    },
    // 标记浏览记录
    markVisited() {
      if (global.account.isLogin()) {
        this.axios({
          method: 'get',
          url: global.ApiUrl + '/user-history/markVisited',
          params: {
            userId: global.account.getAccount(),
            pestId: this.pestId
          }
        })
          .then((response) => {
          })
          .catch((response) => {
          })
          .then((response) => {
          });
      }
    },
    // 展示图片
    displayPicture(img) {
      this.showPicture.active = true
      this.showPicture.pictures = [img]
    },

  },
  mounted() {
    this.getPestsDetailInfoBySpeciesId()
    this.getIsFavorite()
    this.markVisited()
  },
  created() {
    this.pestId = this.$route.params.pestId
    this.prob = this.$route.params.prob

  },
  components: {
    InsectVideo,
    CommodityItem,
  }
}
</script>

<style scoped>
#main {
  padding: 20px;
}

.itemBox {
  margin-bottom: 10px;
}

.titleBox {
  font-weight: bold;
  font-size: larger;
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.pictureBox {
  display: flex;
  align-items: center;
  justify-items: center;
  justify-content: space-around;
  flex-flow: wrap;
}

.pictureItem {
  margin-top: 10px;
}

.content {
  text-indent: 2em;
}
</style>
