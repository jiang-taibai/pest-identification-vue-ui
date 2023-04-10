<template>
  <div style="height: 7rem" class="outer" @click="gotoCommodityPage()">
    <van-row>
      <van-col span="8">
        <div style="display: flex; justify-content: center;">
          <van-image
            width="7rem"
            height="7rem"
            fit="cover"
            :src="commodity.commodityImg"
          />
        </div>
      </van-col>
      <van-col span="16">
        <div
          style="display: flex; flex-wrap: wrap; align-content: space-between; padding: 0 1rem; position: relative; height: 7rem">
          <div>
            <span class="titleParagraph">{{ commodity.commodityTitle }}</span>
            <span class="titleLabel">{{ commodity.commodityTag }}</span>
          </div>

          <div class="priceBox">
            <span class="priceLabel">￥{{ commodity.commodityPrice }}</span>
          </div>
        </div>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import global from "../public/global";

export default {
  name: "CommodityItem",
  props: {
    commodityId: null,  // 商品ID，用该ID去索引到对应的商品
  },
  data() {
    return {
      commodity: {
        commodityId: null,
        commodityTitle: null,
        commodityTag: null,
        commodityPrice: null,
        commodityUrl: null,
        commodityImg: null
      }
    }
  },
  methods: {
    // 通过商品ID获得该商品的信息，图片以相对路径的方式返回
    getCommodityDetailById() {
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/commodity/getCommodityDetailById',
        params: {
          commodityId: this.commodityId
        },
      })
        .then((response) => {
          // console.log(response)
          if (response.data.success) {
            this.commodity = response.data.data
          }
        })
        .catch((response) => {
        })
        .then((response) => {
        });
    },
    gotoCommodityPage() {
      window.location.href = this.commodity.commodityUrl;
    }
  },
  mounted() {
    this.getCommodityDetailById()
  }

}
</script>

<style scoped>
.outer {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: #d7d8d9 solid 1px;
}

.outer:active {
  background: #d7d8d9;
}

.titleParagraph {
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.titleLabel {
  color: #646566;
  font-size: small;
}

.priceBox {
  position: absolute;
  bottom: 0;
}

.priceLabel {
  color: red;
}
</style>
