<template>
  <div class="van-hairline--surround itemBox" @click="gotoPestInfo">
    <div>
      <van-image
        width="5rem"
        height="5rem"
        fit="cover"
        :src="picture"
      >
        <template v-slot:loading>
          <van-loading type="spinner" size="20"/>
        </template>
      </van-image>
    </div>
    <div class="textBox">
      <div style="display: flex; justify-items: center; align-items: center">
        <div class="pestName">{{ name }}</div>
        <div slot="extras" class="extras">{{ extras }}</div>
      </div>
      <div class="van-multi-ellipsis--l3 introText">{{ intro }}</div>
    </div>
  </div>
</template>

<script>
import pestInfo from "../pages/pest/pestInfo";
import global from "../public/global";

export default {
  name: "PestIntroItem",
  data() {
    return {
      picture: null, // https://img.yzcdn.cn/vant/cat.jpeg
      name: null,
      intro: null,
    }
  },
  props: {
    pestId: null, // 害虫ID
    extras: null
  },
  methods: {
    gotoPestInfo() {
      this.$router.push({
        name: 'pestInfo',
        params: {
          pestId: this.pestId // newsData是在路由表中设置的params
        }
      })
    },
    loadPicture() {
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/resource/img/preview',
        params: {
          speciesId: this.pestId
        }
      })
        .then((response) => {
          this.picture = response.data.data
        })
        .catch((response) => {})
        .then((response) => {});
    },
    loadPestBriefInfo() {
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/pestBriefInfos/getBriefInfoByPestId',
        params: {
          pestId: this.pestId
        }
      })
        .then((response) => {
          this.name = response.data.data.pestName
          this.intro = response.data.data.intro
        })
        .catch((response) => {})
        .then((response) => {});
    },
  },
  mounted() {
    this.loadPicture()
    this.loadPestBriefInfo()
  }
}
</script>

<style scoped>
.introText {
  text-indent: 2em;
}

.itemBox {
  padding: 10px 15px;
  display: flex;
  align-items: start;
}

.textBox {
  padding-left: 10px;
}

.pestName {
  font-weight: bold;
}

.extras {
  color: #646566;
  font-size: small;
  margin-left: 10px;
}
</style>
