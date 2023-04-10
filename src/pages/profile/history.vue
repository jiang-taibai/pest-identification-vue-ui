<template>
  <div>
    <van-nav-bar
      title="浏览记录"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />

    <van-empty description="您当前尚未收藏任何昆虫" v-if="historyPestIdArr.length === 0" />
    <PestIntroItem :pest-id="pestId" v-for="pestId in historyPestIdArr" :key="pestId"></PestIntroItem>

  </div>
</template>

<script>
import PestIntroItem from "../../components/PestIntroItem";
import global from "../../public/global";

export default {
  name: "history",
  data() {
    return {
      historyPestIdArr: []
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);//返回上一层
    },
    // 获得所有浏览记录
    getAllHistoryPestIdList() {
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/user-history/getAllHistoryPestIdList',
        params: {
          userId: global.account.getAccount()
        }
      })
        .then((response) => {
          console.log(response.data.data)
          this.historyPestIdArr = response.data.data
        })
        .catch((response) => {})
        .then((response) => {});
    },
  },
  mounted() {
    this.getAllHistoryPestIdList()
  },
  components: {
    PestIntroItem
  }
}
</script>

<style scoped>

</style>
