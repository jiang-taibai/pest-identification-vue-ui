import Vue from 'vue'
import App from './App'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store/index'

import Vant from 'vant';
import 'vant/lib/index.css';
import VueCropper from 'vue-cropper'

Vue.use(VueCropper)
Vue.use(Vant)
Vue.use(VueAxios, axios);

axios.defaults.timeout = 30000;

import VideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'

Vue.use(VideoPlayer)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
