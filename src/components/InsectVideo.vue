<template>
  <div style="margin: 10px 0">
    <video-player class="video-player vjs-custom-skin"
                  ref="videoPlayer"
                  :playsinline="true"
                  :options="playerOptions">
    </video-player>
    <div class="scroll">
      <div :class="['item', videoData.activated?'item-activated':'item-unactivated']" class=" "
           v-for="videoData in videosData" @click="choosePestVideo(videoData)">
        <van-image
          width="50px"
          height="50px"
          fit="cover"
          :src="videoData.path + '?vframe/jpg/offset/1'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {videoPlayer} from 'vue-video-player'
import 'video.js/dist/video-js.css'
import global from "../public/global";

export default {
  name: "InsectVideo",
  props: {
    pestId: String,
  },
  components: {},
  data() {
    return {
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: "video/mp4", // 类型
          src: '' // url地址
        }],
        poster: '', // 封面地址
        notSupportedMessage: '暂无视频', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true // 是否显示全屏按钮
        }
      },
      videosData: []
    }
  },
  methods: {
    // 查询该害虫的视频链表
    getPestVideos() {
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/pestDetailInfo/pestVideos',
        params: {
          speciesId: this.pestId
        }
      })
        .then((response) => {
          console.log(response.data.data)
          this.videosData = []
          for (let data of response.data.data) {
            this.videosData.push({
              path: 'http://resource.taibai.cloud/' + data.videoPath,
              activated: false
            })
          }
          if (this.videosData.length > 0) {
            this.choosePestVideo(this.videosData[0])
          }
        })
        .catch((response) => {
        })
        .then((response) => {
        });
    },
    // 选择某害虫视频
    choosePestVideo(videoData) {
      let myPlayer = this.$refs.videoPlayer.player;
      myPlayer.src(videoData.path);
      for (let data of this.videosData) data.activated = false
      videoData.activated = true
    }
  },
  mounted() {
    this.getPestVideos()
  },
  beforeDestroy() {
  },
  computed: {}
}
</script>

<style scoped>
.item {
  width: 50px;
  height: 50px;
  margin-right: 5px;
  white-space: nowrap;
  display: inline-block;
}

.item-activated {
  border: 2px solid #1989fa;
}

.item-unactivated {
  border: 2px solid #A9ACB8;
}

.scroll {
  padding-left: 5px;
  margin: 10px 0;
  text-align: left;
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y: hidden;
}
</style>
