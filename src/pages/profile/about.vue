<template>
  <div>
    <van-nav-bar
      title="关于我们"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />
    <div style="padding: 20px">
      <h2>关于项目</h2>
      <p>
        林业有害生物一直是我国国土和森林资源的重要危害之一，其灾害程度不亚于森林火灾和乱砍乱伐。据统计，我国林业有害生物发生面积每年超过1.78亿，
        约占乔木林灾害面积的50%，年均造成死树4000多万株，年均经济损失和生态服务价值损失超过1100亿元。</p>
      <p>我们希望设计一个既能够对林保人员科普林业害虫相关知识,又能够在识别林业害虫速度较快的情况下保持较高准确度的H5小程序。</p>
      <p>慧眼识虫项目着力于林业有害生物防治，提供了关键词搜索、分类查询等功能，选择了基于迁移学习功效强大的深度网络框架Yolo v5x和ResNext-50实现的一键多害虫识别、一键单害虫识别功能。</p>
      <h2>关于我们</h2>
      <p>开发团队：椰浆要加冰</p>
      <p>联系邮箱：2201904161@stu.jxufe.edu.cn</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "about",
  methods: {
    goBack() {
      this.$router.go(-1);//返回上一层
    }
  }
}
</script>

<style scoped>
p {
  text-indent: 2em;
}
</style>
