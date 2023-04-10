<template>
  <div>
    <van-nav-bar
        title="安全中心"
        left-text="返回"
        left-arrow
        @click-left="goBack"
    />
    <van-form validate-first @failed="onFailed" @submit="modifyPassword">
      <van-field
          v-model="password"
          name="password"
          label="原密码"
          type="password"
          placeholder="请输入原密码"
          :rules="[{ validator: notNull, message: '不能为空！' }]"
      />
      <van-field
          v-model="newPassword"
          name="newPassword"
          label="新密码"
          type="password"
          placeholder="请输入新密码"
          :rules="[{ validator: validPassword, message: '密码包含 数字,英文,字符中的两种以上，长度6-20' }]"
      />
      <van-field
          v-model="checkPassword"
          name="checkPassword"
          label="确认密码"
          type="password"
          placeholder="请再次输入新密码"
          :rules="[{ validator: isSame, message: '两次输入密码不相同！' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>

import global from "../../public/global";
import {Notify} from "vant";

export default {
  name: "security",
  data() {
    return {
      password: '',
      newPassword: '',
      checkPassword: '',
      passwordPattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,20}$/,
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);//返回上一层
    },
    notNull(val) {
      return val !== '';
    },
    validPassword(val) {
      return this.passwordPattern.test(val)
    },
    isSame(val) {
      return val === this.newPassword
    },
    onFailed(errorInfo) {
      console.log('failed', errorInfo);
    },
    modifyPassword() {
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/account/modifyPassword',
        params: {
          id: window.localStorage.getItem('account'),
          originalPassword: this.password,
          newPassword: this.newPassword
        }
      })
          .then((response) => {
            console.log(response.data);
            if (response.data.success) {
              this.password = ''
              this.newPassword = ''
              this.checkPassword = ''
              Notify({type: 'success', message: response.data.data})
            } else {
              Notify({type: 'warning', message: response.data.data})
            }
          })
          .catch((response) => {
          })
          .then((response) => {
          });
    },
  }
}
</script>

<style scoped>

</style>
