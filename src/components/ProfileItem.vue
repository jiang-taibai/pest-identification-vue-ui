<template>
  <div class="profileBox">
    <div>
      <van-image
        width="7rem"
        height="7rem"
        fit="cover"
        :src="profilePhoto"
      />
    </div>
    <div class="profileTextInfoBox">
      <div style="font-weight: bold; font-size: x-large; margin-bottom: 10px">
        {{nickName}}
      </div>
      <div class="van-multi-ellipsis--l2"
           style="color: #646566;">
        {{intro}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileItem",
  props: {
    profilePhoto: String,
    nickName: String,
    intro: String
  }
}
</script>

<style scoped>
.profileBox {
  display: flex;
  align-items: start;
  padding: 10px 10px;
}

.profileTextInfoBox {
  padding-left: 10px;
}
</style>
