import Vue from 'vue'
import Router from 'vue-router'
import home from "../pages/index/home";
import profile from "../pages/index/profile";
import classify from '../pages/index/classify'
import favorite from "../pages/profile/favorite";
import history from "../pages/profile/history";
import feedback from "../pages/profile/feedback";
import about from "../pages/profile/about";
import searchResult from "../pages/search/searchResult";
import pestInfo from "../pages/pest/pestInfo";
import pestPictureAlbum from "../pages/pest/pestPictureAlbum";
import pictureClip from "../pages/picture/pictureClip";
import preliminaryIdentification from "../pages/recognition/preliminaryIdentification";
import security from "../pages/profile/security";
import maintainInfo from "../pages/admin/maintainInfo";
import maintainAlbum from "../pages/admin/maintainAlbum";
import mixCalculator from '../pages/tools/MixCalculator'

Vue.use(Router)

// const originalReplace = Router.prototype.replace
//
// Router.prototype.replace = function replace(location) {
//   return originalReplace.call(this, location).catch(err => err)
// }

export default new Router({
  routes: [
    {path: '/', redirect: '/home'},

    {path: '/home', component: home},
    {path: '/profile', component: profile},
    {path: '/classify', component: classify},
    // {path: '/profile/profileInfo', component: profileInfo},
    {path: '/profile/security', component: security},
    {path: '/profile/favorite', component: favorite},
    {path: '/profile/history', component: history},
    {path: '/profile/feedback', component: feedback},
    {path: '/profile/about', component: about},

    {path: '/search/:keyword', component: searchResult, name: 'search'},

    {path: '/pestInfo/:pestId', component: pestInfo, name: 'pestInfo'},
    {path: '/pestInfo/:pestId/:prob', component: pestInfo, name: 'pestInfoAndProb'},
    {path: '/pestInfo/pestPictureAlbum/:pestId', component: pestPictureAlbum, name: 'pestPictureAlbum'},

    {
      path: '/recognize/pretreatment/clip/:recognizeType',
      component: pictureClip,
      name: 'pictureClip',
    },  // 图片预处理
    {
      path: '/recognize/pretreatment/recognizeResult',
      component: preliminaryIdentification,
      name: 'preliminaryIdentification'
    },  // 图片预识别

    {path: '/maintainInfo', component: maintainInfo, name: 'maintainInfo'}, // 数据库维护
    {path: '/maintainAlbum/:pestId', component: maintainAlbum, name: 'maintainAlbum'}, // 数据库维护

    // 工具页面
    {path: '/tools/mixCalculator', component: mixCalculator, name: 'mixCalculator'}

  ]
})
