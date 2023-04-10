<template>
  <div>
    <van-nav-bar
      title="识别清单"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />
    <div class="imgBox van-hairline--bottom">
      <van-image
        width="24rem"
        height="24rem"
        fit="contain"
        :src="imgData"
      />
    </div>
    <div>
      <PestIntroItem v-for="pest in pestList" :key="pest.pestId"
        :pest-id="pest.pestId" :extras="'[数量:'  + pest.quantity + ']'"></PestIntroItem>
    </div>

  </div>
</template>

<script>
import PestIntroItem from "../../components/PestIntroItem";

export default {
  name: "preliminaryIdentification",
  data() {
    return {
      pestList: [],
      imgData: ''
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);//返回上一层
    }
  },
  mounted() {
    //
  },
  created() {
    //:recognizeType/:imgData
    this.pestList = this.$store.state.multipleRecognizedData.results
    this.imgData = "data:image/jpg;base64," + this.$store.state.multipleRecognizedData.imgBase64Data
  },
  components: {
    PestIntroItem
  }
}
</script>

<style scoped>
  .imgBox {
    display: flex;
    justify-items: center;
    align-items: center;
    justify-content: center;
    padding: 5px;
    background: #d7d8d9;
  }
</style>
