<template>
  <!-- 本页为我的 -->
  <div>
    <van-nav-bar title="慧眼识虫"></van-nav-bar>
    <div v-if="logged">
      <van-cell title="安全中心" is-link to="profile/security"/>
      <!--    <van-cell title="我的信息" is-link to="profile/profileInfo" />-->
      <van-cell title="我的收藏" is-link to="profile/favorite"/>
      <van-cell title="浏览记录" is-link to="profile/history"/>
      <van-cell title="基础库维护" is-link to="maintainInfo" v-if="authority === 'admin'"/>
<!--      <van-cell title="反馈信息" is-link to="profile/feedback"/>-->
      <van-cell title="关于我们" is-link to="profile/about"/>

      <div style="padding: 0 20px; margin-top: 20px">
        <van-button round type="danger" size="small" block @click="logoutAccount">退出登录</van-button>

      </div>
    </div>
    <div v-else>
      <!--如果正在注册,则显示下面这个-->
      <h3 style="text-align: center">{{ registering ? '欢迎注册' : '欢迎登录' }} 慧眼识虫</h3>
      <div v-if="registering">
        <van-form @submit="registerAccount">
          <van-field v-model="formData.phoneNumber" name="手机号" label="手机号" placeholder="请输入手机号"
                     :rules="[{ validator: checkPhoneNumber, message: '请输入正确的手机号' }]"/>
          <van-field v-model="formData.password" type="password" name="密码" label="密码" placeholder="请输入密码"
                     :rules="[{ validator: checkPassword, message: '密码应包含 数字,英文,字符中的两种以上，长度6-20' }]"/>
          <van-field v-model="formData.checkPassword" type="password" name="再次输入密码" label="再次输入密码" placeholder="请再次输入密码"
                     :rules="[{ validator: checkCheckPassword, message: '两次输入密码不相同！' }]"/>
          <!--暂时不实现手机验证码-->
          <!--<van-field v-model="formData.verifyCode" center clearable label="短信验证码" placeholder="请输入短信验证码">-->
          <!--  <template #button>-->
          <!--    <van-button size="small" type="primary" @click="sendTextMessageVerifyCode">{{ formData.buttonText }}-->
          <!--    </van-button>-->
          <!--  </template>-->
          <!--</van-field>-->
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit" size="small">注册账户</van-button>
          </div>
        </van-form>
        <div style="margin: 16px;">
          <van-button round block type="primary" @click="changeToRegisterOrLogin" size="small">已有账号？立即登录</van-button>
        </div>

      </div>
      <!--否则显示登录界面-->
      <div v-else>
        <van-form @submit="loginAccount">
          <van-field v-model="formData.phoneNumber" name="手机号" label="手机号" placeholder="请输入手机号"
                     :rules="[{ validator: checkPhoneNumber, message: '请输入正确的手机号' }]"/>
          <van-field v-model="formData.password" type="password" name="密码" label="密码" placeholder="请输入密码"
                     :rules="[{ validator: checkPassword, message: '密码应包含 数字,英文,字符中的两种以上，长度6-20' }]"/>
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit" size="small">立即登录</van-button>
          </div>
        </van-form>
        <div style="margin: 16px;">
          <van-button round block type="primary" @click="changeToRegisterOrLogin" size="small">还没用账号？立即注册</van-button>
        </div>
      </div>
    </div>
    <van-tabbar v-model="active" route placeholder fixed>
      <van-tabbar-item replace to="/classify" name="classify" icon="points">分类</van-tabbar-item>
      <van-tabbar-item replace to="/home" name="home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/profile" name="profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import ProfileItem from "../../components/ProfileItem";
import {Notify} from "vant";
import global from "../../public/global";

export default {
  name: "profile",
  data() {
    return {
      active: 'profile',
      logged: window.localStorage.getItem('loginState') === 'ok',
      registering: false,
      formData: {
        phoneNumber: '18866668888',
        password: '8888admin',
        checkPassword: '',
        verifyCode: '',
        buttonText: '发送验证码',
        totalTime: 60,
        sent: false,
      },

      // 权限，如果是管理员则开启基础库维护
      authority: window.localStorage.getItem('authority'),
    }
  },
  methods: {
    checkPhoneNumber() {
      return /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(this.formData.phoneNumber)
    },
    checkPassword() {
      return /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,20}$/.test(this.formData.password)
    },
    checkCheckPassword() {
      return this.formData.password === this.formData.checkPassword
    },
    checkVerifyCode() {
      return /^\d{4}$/.test(this.formData.verifyCode)
    },
    sendTextMessageVerifyCode() {
      //
      this.formData.sent = true
      // 这里执行验证码发送业务，并且异步执行将buttonText从 60秒 -> 0秒
      this.formData.buttonText = this.formData.totalTime + 's后重新发送' //这里解决60秒不见了的问题
      let clock = window.setInterval(() => {
        this.formData.totalTime--
        this.formData.buttonText = this.formData.totalTime + 's后重新发送'
        if (this.formData.totalTime < 0) {     //当倒计时小于0时清除定时器
          window.clearInterval(clock)
          this.formData.buttonText = '重新发送验证码'
          this.formData.totalTime = 60
        }
      }, 1000)
    },
    registerAccount() {
      if (!this.checkPhoneNumber() || !this.checkPassword() || !this.checkCheckPassword()) {
        Notify({type: 'warning', message: '输入内容有误！'});
        return;
      }
//      if (!this.checkVerifyCode()) {
//        Notify({type: 'warning', message: '验证码应为4位数字！'});
//        return;
//      }
//      if (this.formData.sent === false) {
//        Notify({type: 'warning', message: '您尚未发送验证码！'});
//        return;
//      }
      // 这里可以进行注册了
      // 最后注册成功应该转到登录页
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/account/registerAnyway',
        params: {
          phone: this.formData.phoneNumber,
          password: this.formData.password
        }
      })
        .then((response) => {
          if (response.data.success) {
            Notify({type: 'success', message: response.data.data})
            this.registering = false
            this.formData = {
              phoneNumber: '',
              password: '',
              checkPassword: '',
              verifyCode: '',
              buttonText: '发送验证码',
              totalTime: 60,
              sent: false,
            }
          } else {
            Notify({type: 'warning', message: response.data.data})
          }
        })
        .catch((response) => {
        })
        .then((response) => {
        });
    },
    loginAccount() {
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/account/login',
        params: {
          phone: this.formData.phoneNumber,
          password: this.formData.password
        }
      })
        .then((response) => {
          if (response.data.success) {
            // 登录成功转到我的页面
            // 登录成功应该清除信息
            this.formData = {
              phoneNumber: '',
              password: '',
              checkPassword: '',
              verifyCode: '',
              buttonText: '发送验证码',
              totalTime: 60,
              sent: false,
            }
            this.logged = true
            this.authority = response.data.data.authority
            window.localStorage.setItem('account', response.data.data.id)
            window.localStorage.setItem('authority', response.data.data.authority)
            window.localStorage.setItem('loginState', 'ok')
          } else {
            Notify({type: 'danger', message: '账号或密码错误！'});
          }
        })
        .catch((response) => {
        })
        .then((response) => {
        });

    },
    logoutAccount() {
      // 退出登录
      this.logged = false
      // 进行设置用户信息
      this.authority = 'off-line'
      window.localStorage.removeItem('account')
      window.localStorage.removeItem('authority')
      window.localStorage.setItem('loginState', 'off-line')
    },

    changeToRegisterOrLogin() {
      this.registering = !this.registering;
      this.formData = {
        phoneNumber: '',
        password: '',
        checkPassword: '',
        verifyCode: '',
        buttonText: '发送验证码',
        totalTime: 60,
        sent: false,
      }
    }
  },
  components: {
    ProfileItem
  }
}
</script>

<style scoped>

</style>
