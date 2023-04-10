<template>
  <!-- 本页为分类 -->
  <div>
    <van-nav-bar title="慧眼识虫"></van-nav-bar>

    <van-dropdown-menu active-color="#1989fa">
      <van-dropdown-item v-model="order" :options="orders" @change="changeTheOrder"/>
      <van-dropdown-item v-model="family" :options="families" @change="changeTheFamily"/>
      <van-dropdown-item v-model="genus" :options="genuses" @change="getPestIdListByGenusId"/>
    </van-dropdown-menu>

    <van-empty description="一大波昆虫正在飞来...正在加载中..." image="network" v-if="speciesIdArr.length === 0" />
    <PestIntroItem v-for="speciesId in speciesIdArr" :key="speciesId" :pest-id="speciesId"></PestIntroItem>

    <van-tabbar v-model="active" route placeholder fixed>
      <van-tabbar-item replace to="/classify" name="classify" icon="points">分类</van-tabbar-item>
      <van-tabbar-item replace to="/home" name="home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/profile" name="profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import PestIntroItem from "../../components/PestIntroItem";
import global from "../../public/global";

export default {
  name: "classify",
  data() {
    return {
      active: 'classify',
      orders: [
        {text: '半翅目', value: 'C15000000000'},
        {text: '鳞翅目', value: 'C22000000000'},
        {text: '鞘翅目', value: 'C21000000000'}
      ],
      families: [],
      genuses: [],
      order: 'C15000000000',
      family: 'C15408000000',
      genus: 'C15408105000',
      // 昆虫ID列表
      speciesIdArr: [],

      OrderToFamily: {
        'C15000000000': [
          'C15408000000', 'C15331000000',
        ],
        'C22000000000': [
          'C22301000000', 'C22345000000', 'C22359000000', 'C22341000000', 'C22342000000'
        ],
        'C21000000000': [
          'C21301000000', 'C21701000000', 'C21703000000'
        ]
      },
      FamilyToGenus: {
        'C15408000000': [
          'C15408105000',
        ],
        'C15331000000': [
          'C15331005000',
        ],
        'C22301000000': [
          'C22301090000', 'C22301070000',
        ],
        'C22345000000': [
          'C22345105000', 'C22345170000',
        ],
        'C22359000000': [
          'C22359050000',
        ],
        'C22341000000': [
          'C22341165000'
        ],
        'C22342000000': [
          'C22342015000', 'C22342135000'
        ],
        'C21301000000': [
          'C21301095000'
        ],
        'C21701000000': [
          'C21701080000', 'C21701445000', 'C21701065000'
        ],
        'C21703000000': [
          'C21703280000'
        ],
      },
      codeToText: {
        'C15000000000': '半翅目',
        'C22000000000': '鳞翅目',
        'C21000000000': '鞘翅目',

        'C15408000000': '蝽科',
        'C15331000000': '珠蚧科',
        'C22301000000': '刺蛾科',
        'C22345000000': '灯蛾科',
        'C22359000000': '凤蝶科',
        'C22341000000': '天蛾科',
        'C22342000000': '舟蛾科',
        'C21301000000': '吉丁甲科',
        'C21701000000': '天牛科',
        'C21703000000': '叶甲科',

        'C15408105000': '麻皮蝽属',
        'C15331005000': '履绵蚧属',
        'C22301090000': '绿刺蛾属',
        'C22301070000': '黄刺蛾属',
        'C22345105000': '白蛾属',
        'C22345170000': '污灯蛾属',
        'C22359050000': '丝带凤蝶属',
        'C22341165000': '霜天蛾属',
        'C22342015000': '扇舟蛾属',
        'C22342135000': '拟皮舟蛾属',
        'C21301095000': '脊吉丁属',
        'C21701080000': '粒肩天牛属',
        'C21701445000': '墨天牛属',
        'C21701065000': '星天牛属',
        'C21703280000': '圆叶甲属',
      }
    }
  },
  methods: {
    getFamiliesByOrder(order) {
      let familiesCode = this.OrderToFamily[order]
      let orders = []
      for (let index in familiesCode) {
        let code = familiesCode[index]
        orders.push({text: this.codeToText[code], value: code})
      }
      return orders;
    },

    getGenusesByFamily(family) {
      let genusesCode = this.FamilyToGenus[family]
      let orders = []
      for (let index in genusesCode) {
        let code = genusesCode[index]
        orders.push({text: this.codeToText[code], value: code})
      }
      return orders;
    },

    changeTheOrder(event) {
      const order = event;
      let families = this.getFamiliesByOrder(order)
      let family = families[0].value
      let genuses = this.getGenusesByFamily(family)
      let genus = genuses[0].value
      this.order = order
      this.family = family
      this.families = families
      this.genuses = genuses
      this.genus = genus
      this.getPestIdListByGenusId()
    },

    changeTheFamily(event) {
      const family = event;
      let genuses = this.getGenusesByFamily(family)
      let genus = genuses[0].value
      this.family = family
      this.genuses = genuses
      this.genus = genus
      this.getPestIdListByGenusId()
    },

    // 访问后端API，通过属ID获得昆虫ID列表
    getPestIdListByGenusId() {
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/classify-search/getPestIdListByGenusId',
        params: {
          genusId: this.genus
        }
      })
        .then((response) => {
          this.speciesIdArr = response.data.data
        })
        .catch((response) => {})
        .then((response) => {});
    }
  },
  mounted() {
    this.families = this.getFamiliesByOrder(this.order)
    this.genuses = this.getGenusesByFamily(this.family)
    this.getPestIdListByGenusId()
  },
  components: {
    PestIntroItem,
  }
}
</script>

<style scoped>

</style>
