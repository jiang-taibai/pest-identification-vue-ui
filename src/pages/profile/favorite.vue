<template>
  <div>
    <van-nav-bar
      title="我的收藏"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />

    <van-empty description="您当前尚未收藏任何昆虫" v-if="favoritePestIdArr.length === 0" />
    <PestIntroItem :pest-id="pestId" v-for="pestId in favoritePestIdArr" :key="pestId"></PestIntroItem>

  </div>
</template>

<script>
import PestIntroItem from "../../components/PestIntroItem";
import global from "../../public/global";

export default {
  name: "favorite",
  data() {
    return {
      favoritePestIdArr: []
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);//返回上一层
    },
    getFavoriteList() {
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/user-favorite/getFavoriteList',
        params: {
          userId: global.account.getAccount(),
        }
      })
        .then((response) => {
          this.favoritePestIdArr = response.data.data
        })
        .catch((response) => {})
        .then((response) => {});
    }
  },
  mounted() {
    this.getFavoriteList()
  },
  components: {
    PestIntroItem
  }
}
</script>

<style scoped>

</style>
