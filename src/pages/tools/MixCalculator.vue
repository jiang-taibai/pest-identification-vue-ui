<template>
  <div>
    <div>
      <van-nav-bar
        title="用药兑水计算器"
        left-text="返回"
        left-arrow fixed placeholder border
        @click-left="goBack"
      />
    </div>

    <div class="card">
      <van-tabs v-model="active" animated swipeable>
        <van-tab title="用药量计算" name="calcDosage">
          <div style="padding: 10px 0">
            <van-field v-model="dilutionRatio" type="number" label-width="8em"
                       label="稀释倍数（倍）" input-align="right" placeholder="请输入稀释倍数"/>
            <van-field v-model="waterConsumption" type="number" label-width="8em"
                       label="兑水量（斤）" input-align="right" placeholder="请输入兑水量"/>
            <van-field v-model="dosage" type="number" label-width="8em"
                       label="用药量（mL/g）" input-align="right" readonly/>
          </div>
        </van-tab>
        <van-tab title="兑水量计算" name="calcWaterConsumption">
          <div style="padding: 10px 0">
            <van-field v-model="dilutionRatio" type="number" label-width="8em"
                       label="稀释倍数（倍）" input-align="right" placeholder="请输入稀释倍数"/>
            <van-field v-model="dosage" type="number" label-width="8em"
                       label="用药量（mL/g）" input-align="right" placeholder="请输入用药量"/>
            <van-field v-model="waterConsumption" type="number" label-width="8em"
                       label="兑水量（斤）" input-align="right" readonly/>
          </div>
        </van-tab>
      </van-tabs>
      <div style="padding: 10px 0">
        <van-button type="primary" size="small" block @click="calculate">计算</van-button>
      </div>
      <div class="tip">
        <p>温馨提示：</p>
        <p>1.稀释倍数：可在药肥包装上查找，或咨询专业人士；</p>
        <p>2.兑水量：可根据实际用药面积来确认兑水量</p>
        <p>3.计算结果为业内经验所得，结果仅供参考。</p>
      </div>
    </div>
  </div>
</template>

<script>
import {Toast} from "vant";

export default {
  name: "MixCalculator",
  data() {
    return {
      active: "calcDosage",
      dilutionRatio: null, // 稀释倍数
      waterConsumption: null,  // 兑水量
      dosage: null,  // 用药量
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);//返回上一层
    },
    calculate() {
      if (this.dilutionRatio === '') {
        Toast.fail('请输入稀释倍数！');
        return;
      }
      if (this.dilutionRatio === '0') {
        Toast.fail('稀释倍数不得为0！');
        return;
      }
      switch (this.active) {
        case "calcDosage":
          if(this.waterConsumption === '') {
            Toast.fail('请输入兑水量！');
            return;
          }
          this.dosage = (this.waterConsumption * 500 / this.dilutionRatio).toFixed(2);
          break;
        case "calcWaterConsumption":
          if(this.dosage === '') {
            Toast.fail('请输入用药量！');
            return;
          }
          this.waterConsumption = this.dosage * this.dilutionRatio / 500;
      }
    }
  }
}
</script>

<style scoped>
.card {
  margin: 1rem;
  border-radius: 5px;
  box-shadow: 0 0 10px #d7d8d9;
  padding: 10px;
}

.tip {
  font-size: small;
  color: #646566;
}

.tip p {
  margin: 0;
}
</style>
