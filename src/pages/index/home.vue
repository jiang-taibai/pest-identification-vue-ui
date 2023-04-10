<template>
  <!-- 本页为首页 -->
  <div>
    <van-nav-bar title="慧眼识虫"></van-nav-bar>

    <van-search v-model="keyword" placeholder="请输入搜索关键词" show-action @search="onSearch">
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>

    <div class="card item" @click="gotoPestDetailInfo">
      <div class="introText"
           style="position: absolute; bottom: 0; z-index: 999; color: white;
           background: rgba(0, 0, 0, 0.6); padding: 10px;">
        <div class="van-multi-ellipsis--l3 ">
          {{ randomPestInfo.intro }}
        </div>
      </div>
      <img style="border-radius: 10px; box-shadow: 0 0 10px #d7d8d9;"
           :src="randomPestInfo.imgData" class="img-item"
           height="auto" width="100%" alt="害虫图片">
    </div>
    <div style="padding: 0 20px">
      <van-button type="primary" size="small" block @click="getRandomPestBriefInfo">随机一虫</van-button>
    </div>

    <div class="BigButtonGroup">
      <div class="BigButton"
           :style="'background-image: linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)), url('+img.multiple+')'"
           style="background: no-repeat right bottom; background-size: 120%"
           @click="recognizeMultiplePest">
        <span class="BigButton_Title">识多虫</span>
        <span class="BigButton_Subhead">YoloV5专线</span>
      </div>
      <div class="BigButton"
           :style="'background-image: linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)), url('+img.single+')'"
           style="background: no-repeat right top; background-size: 90%"
           @click="recognizeSinglePest">
        <span class="BigButton_Title">识单虫</span>
        <span class="BigButton_Subhead">ResNext50专线</span>
      </div>
    </div>
    <div style="padding: 0 20px">
      <h3>小工具</h3>
      <div class="imgButtonGroup">
        <div class="imgButton" @click="gotoMixCalculator"
             :style="'background-image: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255,255,255, 1)), url('+img.beaker+')'"
             style="background: no-repeat right center; background-size: contain">
          <span class="imgButtonTitle">用药兑水</span>
          <span class="imgButtonDesc">计算用药量、兑水量</span>
        </div>
      </div>
    </div>

    <input style="display: none" type="file" accept="image/*" ref="getPicture" @change="getFile"/>

    <div style="height: 1rem"></div>

    <van-tabbar v-model="active" route placeholder fixed>
      <van-tabbar-item replace to="/classify" name="classify" icon="points">分类</van-tabbar-item>
      <van-tabbar-item replace to="/home" name="home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/profile" name="profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import global from "../../public/global";

export default {
  name: "home",
  data() {
    return {
      active: 'home',
      keyword: '',
      recognizeType: 'single',
      // uploadType: 'multiple',
      randomPestInfo: {
        name: '',
        intro: '',
        pestId: '',
        imgData: '',
        isLoading: true,
      },
      img: {
        single: require('@/assets/img/IdentifySingle.png'),
        multiple: require('@/assets/img/IdentifyMultiple.png'),
        beaker: require('@/assets/img/beaker.png')
      }
    }
  },
  methods: {
    onSearch() {
      this.$router.push({
        name: 'search',
        params: {
          keyword: this.keyword
        }
      })
    },
    // 获取选择的图片文件上传
    getFile(event) {
      let file = event.target.files[0];
      let reader = new FileReader();
      let that = this;
      reader.onload = function (event) {
        that.$store.commit('updateImgData', event.target.result)
        that.$router.push({
          name: 'pictureClip',
          params: {
            recognizeType: that.recognizeType
          },
        })
      }
      reader.readAsDataURL(file);
    },
    recognizeSinglePest() {
      this.recognizeType = 'single'
      this.$refs.getPicture.click()
    },
    recognizeMultiplePest() {
      this.recognizeType = 'multiple'
      this.$refs.getPicture.click()
    },

    // 随机一虫
    getRandomPestBriefInfo() {
      this.randomPestInfo.isLoading = true
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/pestBriefInfos/getRandomPestBriefInfo',
        params: {}
      })
        .then((response) => {
          this.randomPestInfo = {
            name: response.data.data.pestName,
            intro: response.data.data.intro,
            speciesId: response.data.data.speciesId,
            imgData: '',
            isLoading: true,
          }
          this.updateRandomPestImage()
        })
        .catch((response) => {
        })
        .then((response) => {
        });
    },
    updateRandomPestImage() {
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/resource/img/preview',
        params: {
          speciesId: this.randomPestInfo.speciesId
        }
      })
        .then((response) => {
          this.randomPestInfo.imgData = response.data.data
          this.randomPestInfo.isLoading = false
        })
        .catch((response) => {
        })
        .then((response) => {
        });
    },
    gotoPestDetailInfo() {
      this.$router.push({
        name: 'pestInfo',
        params: {
          pestId: this.randomPestInfo.speciesId // newsData是在路由表中设置的params
        }
      })
    },

    // 工具页的衔接

    gotoMixCalculator() {
      this.$router.push({
        name: 'mixCalculator',
      })
    }
  },
  mounted() {
    this.getRandomPestBriefInfo()
  },
}
</script>

<style>
.introText {
  text-indent: 2em;
}

.BigButtonGroup {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.BigButton {
  width: 8.08rem;
  height: 5rem;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 0 10px #d7d8d9;
  display: inline-block;
  cursor: pointer;
}

.BigButton_Title {
  display: block;
  font-size: x-large;
  font-weight: bold;
  margin-bottom: 5px;
}

.BigButton_Subhead {
  display: block;
  color: #0570db;
  font-weight: bold;
}

.card {
  margin: 1rem;
  border-radius: 5px;
  box-shadow: 0 0 10px #d7d8d9;
  cursor: pointer;
}

.item {
  /*!* 图片宽度 *!*/
  /*width: 30%;*/
  /*!* 图片高度 *!*/
  /*padding-bottom: 30%;*/
  /*height: 0;*/
  margin: 1rem auto;
  width: 22rem;
  height: 22rem;
  overflow: hidden;
  position: relative;
}

.img-item {
  position: absolute;
  width: 100%;
  height: 100%;
  /* 截取图片正中心 */
  object-fit: cover;
}

.imgButtonGroup {

}

.imgButton {
  width: 8rem;
  height: 5rem;
  border-radius: 5px;
  box-shadow: 0 0 10px #d7d8d9;
  cursor: pointer;
  padding: 5px 5px;
}

.imgButton .imgButtonTitle {
  font-weight: bold;
  font-size: large;
  display: block;
}

.imgButton .imgButtonDesc {
  font-size: small;
  display: block;
}
</style>
