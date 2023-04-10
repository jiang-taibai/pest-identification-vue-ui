// 开发环境
// const ApiUrl = 'http://127.0.0.1:8088/'
// const PythonApiUrl = 'http://127.0.0.1:9961'

// 生产环境
const ApiUrl = 'http://taibai.cloud:8002/'
const PythonApiUrl = 'http://taibai.cloud:8003'

const base64Prefix = 'data:image/jpeg;base64,'

function toSrcFormat(base64Code) {
  return base64Prefix + JSON.parse(base64Code);
}

function getUUID(length) {
  return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
}

function copy(obj) {
  return JSON.parse(JSON.stringify(obj))
}

let account = {
  isLogin() {
    let loginState = window.localStorage.getItem('loginState')
    return loginState !== null && loginState === 'ok';
  },
  getAccount() {
    if (!this.isLogin()) {
      console.error('当前尚未登录，无法获取用户ID')
      return null;
    }
    return window.localStorage.getItem('account')
  }
}

export default {
  ApiUrl,
  PythonApiUrl,
  toSrcFormat,
  getUUID,
  copy,
  account,
  constant: {
    base64Prefix,
  }
}

// localStorage设置
// window.localStorage.setItem('account', response.data.data.id)
// window.localStorage.setItem('authority', response.data.data.authority)
// window.localStorage.setItem('loginState', 'ok')
// loginState
//  -> ok: 已登录
//  -> off-line: 离线

