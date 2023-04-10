<template>
  <div>
    <van-nav-bar
      title="查找结果"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />
    <van-search v-model="keyword" placeholder="请输入搜索关键词" show-action @search="onSearch">
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>

    <div>
      <PestIntroItem v-for="info in pestBriefInfos" :key="info.speciesId"
                     :pest-id="info.speciesId"/>
    </div>

    <van-empty image="search" v-if="pestBriefInfos.length === 0" description="无匹配条目" />


  </div>
</template>

<script>
import PestIntroItem from "../../components/PestIntroItem";
import global from "../../public/global";

export default {
  name: "searchResult",
  data() {
    return {
      active: 'home',
      keyword: '',
      pestBriefInfos: []
    }
  },
  methods: {
    onSearch(dontReplace) {
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/pestBriefInfos/searchByKeyword',
        params: {
          keyword: this.keyword
        }
      })
        .then((response) => {
          this.pestBriefInfos = response.data.data;
        })
        .catch((response) => {
        })
        .then((response) => {
        });
      if(dontReplace) {
        this.$router.replace({
          name: 'search',
          params: {
            keyword: this.keyword
          }
        })
      }
    },
    goBack() {
      this.$router.go(-1);//返回上一层
    }
  },
  components: {
    PestIntroItem
  },
  mounted() {
    this.onSearch(true)
  },
  created() {
    this.keyword = this.$route.params.keyword
  }
}
</script>

<style scoped>

</style>
