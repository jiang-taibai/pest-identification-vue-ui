<template>
  <div>
    <van-nav-bar
      title="反馈信息"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />



  </div>
</template>

<script>
export default {
  name: "feedback",
  methods: {
    goBack() {
      this.$router.go(-1);//返回上一层
    }
  }
}
</script>

<style scoped>

</style>
