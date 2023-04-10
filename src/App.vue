<template>
  <div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="css">
.van-nav-bar {
  color: white;
  background: #00BEA9;
}
.van-nav-bar .van-icon {
  color: white;
}
.van-nav-bar__text {
  color: white;
}
.van-nav-bar__title {
  color: white;
}
.van-tabbar {
  background: #00BEA9;
}
.van-tabbar-item {
  color: white;
}
.van-tabbar-item--active {
  color: #FFFF00;
  background: #00BEA9;
}
</style>
