<template>
  <div>
    <van-nav-bar
      title="我的信息"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />
    <van-cell is-link>
      <template #title>
        <div style="height: 5rem; line-height: 5rem">头像</div>
      </template>
      <template #default>
        <van-image
          width="5rem"
          height="5rem"
          fit="cover"
          src="/static/profile-photo/罗小黑01.jpg"
        />
      </template>
    </van-cell>
    <van-cell title="昵称" is-link value="江太白"/>
    <van-cell title="简介" is-link value="xxxxxxxxxxx"/>
  </div>
</template>

<script>
export default {
  name: "profileInfo",
  methods: {
    goBack() {
      this.$router.go(-1);//返回上一层
    }
  }
}
</script>

<style scoped>

</style>
