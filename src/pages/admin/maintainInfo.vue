<template>
  <div>
    <van-nav-bar
      title="昆虫信息维护"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />
    <van-search v-model="pestId" placeholder="请输入害虫ID(可在害虫详情页查看)" show-action @input="getPestInfoBySpeciesId" @search="getPestInfoBySpeciesId">
      <div slot="action" @click="getPestInfoBySpeciesId">搜索</div>
    </van-search>

    <div>
      <van-empty image="search" description="尚未搜索或害虫ID有误" v-if="!haveResult"/>
      <div v-else>
        <van-form @submit="onSubmit">
          <van-field
            v-model="pestInfo.insectName"
            name="昆虫名称"
            label="昆虫名称"
            placeholder="请输入昆虫名称"
            :rules="[{ required: true, message: '请填写昆虫名称' }]"
          />
          <van-field
            v-model="pestInfo.intro"
            name="昆虫简介"
            label="昆虫简介"
            placeholder="请输入昆虫简介"
            :rules="[{ required: true, message: '请填写昆虫简介' }]"
          />
          <van-field
            v-model="pestInfo.speciesId"
            name="昆虫ID"
            label="昆虫ID"
            placeholder="请输入昆虫ID"
            :rules="[{ required: true, message: '请填写昆虫ID' }]"
          />
          <van-field
            v-model="pestInfo.distribution"
            name="昆虫分布"
            label="昆虫分布"
            placeholder="请输入昆虫分布"
            :rules="[{ required: true, message: '请填写昆虫分布' }]"
          />
          <van-field
            v-model="pestInfo.victims"
            name="寄生植物"
            label="寄生植物"
            placeholder="请输入寄生植物"
            :rules="[{ required: true, message: '请填写寄生植物' }]"
          />
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit" size="small" @click="changePestInfoBySpeciesId">
              更新资料
            </van-button>
            <van-button round block type="primary" size="small" style="margin-top: 16px" @click="gotoMaintainAlbum">
              维护图册
            </van-button>
          </div>
        </van-form>

      </div>
    </div>

  </div>
</template>

<script>
import global from "../../public/global";
import {Toast} from "vant";

export default {
  name: "maintainInfo",
  data() {
    return {
      pestId: '',
      haveResult: false,
      pestInfo: {
        insectName: '',
        intro: '',
        speciesId: '',
        distribution: '',
        victims: '',
      }
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);//返回上一层
    },
    onSubmit() {

    },
    gotoMaintainAlbum() {
      this.$router.push({
        name: 'maintainAlbum',
        params: {
          pestId: this.pestInfo.speciesId
        }
      })
    },

    // 更新害虫信息，但是这里还需要添加科目属的信息
    changePestInfoBySpeciesId() {
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/admin-pestInfo/changePestInfoBySpeciesId',
        params: {
          oldSpeciesId: this.pestId,
          speciesId: this.pestInfo.speciesId,
          insectName: this.pestInfo.insectName,
          intro: this.pestInfo.intro,
          victims: this.pestInfo.victims,
          distribution: this.pestInfo.distribution,
        }
      })
        .then((response) => {
          if(response.data.success) {
            Toast.success(response.data.data)
            this.pestId = this.pestInfo.speciesId
          } else {
            Toast.fail(response.data.data)
          }
        })
        .catch((response) => {
        })
        .then((response) => {
        });
    },
    // 获得害虫信息，通过种ID
    getPestInfoBySpeciesId() {
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/admin-pestInfo/getPestInfoBySpeciesId',
        params: {
          speciesId: this.pestId
        }
      })
        .then((response) => {
          this.haveResult = response.data.success
          if (response.data.success) {
            this.pestInfo = response.data.data
          } else {
            Toast(response.data.data)
          }
        })
        .catch((response) => {
        })
        .then((response) => {
        });
    },
  },
}
</script>

<style scoped>

</style>
