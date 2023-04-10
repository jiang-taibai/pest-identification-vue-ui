<template>
  <div>
    <van-nav-bar
      title="昆虫图册维护"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />
    <van-empty image="https://img.yzcdn.cn/vant/custom-empty-image.png" description="后端工程师正在加班中..." v-if="developing"/>
    <div v-if="!developing">
      <!-- 文字较短时，通过设置 scrollable 属性开启滚动播放 -->
      <van-notice-bar left-icon="volume-o" :scrollable="false">
        <van-swipe
          vertical
          class="notice-swipe"
          :autoplay="3000"
          :show-indicators="false"
        >
          <van-swipe-item>1. 对相册做出的修改不会自动同步，需要点击【保存修改】</van-swipe-item>
          <van-swipe-item>2. 上传图片会自动同步，无需再点击【保存修改】</van-swipe-item>
          <van-swipe-item>3. 未分类相册不会公开给用户查看，仅管理员可查看</van-swipe-item>
        </van-swipe>
      </van-notice-bar>

      <div class="buttonGroup">
        <van-button type="primary" size="small" @click="groupAdmin=!groupAdmin">分组管理</van-button>
        <van-button type="primary" size="small" @click="openPhotoAdmin">图片管理</van-button>
        <van-uploader :after-read="uploadImage">
          <van-button type="primary" size="small">上传图片</van-button>
        </van-uploader>
        <van-button type="info" size="small" @click="saveChange">保存修改</van-button>
      </div>

      <van-empty description="一大波昆虫正在飞来...正在加载中..." image="network" v-if="classifyAlbum.length === 0"/>

      <van-collapse v-model="activeNames">
        <van-collapse-item :title="album.category" :name="album.category" v-for="album in classifyAlbum"
                           :key="album.category">
          <!-- 图片组-->
          <div class="checkGroup">
            <!-- 每个图片 -->
            <div style="width: 5rem" v-for="(img,index) in album.images" :key="index"
                 :class="`${img.checked?'checked':'unchecked'} checkItem`">
              <div style="height: 5rem" @click="displayPicture(img)">
                <van-image width="5rem" height="5rem" fit="cover" :src="img.imgData">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20"/>
                  </template>
                </van-image>
              </div>
              <div style="text-align: center; font-size: x-small" @click="choose(img)"
                   :class="`${img.checked?'checked':'unchecked'}`">
                选择
              </div>
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>

      <!--==========分组管理弹窗==========-->
      <!-- 分组管理的主页 -->
      <van-dialog v-model="groupAdmin" title="分组管理" cancelButtonText="关闭" show-cancel-button
                  :show-confirm-button="false">
        <div style="margin: 5px">
          <van-button icon="plus" type="info" size="small" @click="addAlbum()" block>添加分组</van-button>
        </div>
        <van-cell v-for="(album,index) in classifyAlbum" :key="index">
          <template #title>
            {{ album.category }}
          </template>
          <template #default>
            <van-button icon="edit" type="primary" size="small" @click="editAlbum(album)"
                        :disabled="album.category === '未分类'"></van-button>
            <van-button icon="delete-o" type="primary" size="small" @click="deleteAlbum(album)"
                        :disabled="album.category === '未分类'"></van-button>
          </template>
        </van-cell>
      </van-dialog>
      <!--修改分组名称弹窗-->
      <van-dialog v-model="albumEditState.albumEditing" title="修改分组名称" show-cancel-button :show-confirm-button="false">
        <van-field v-model="albumEditState.albumName" label="" placeholder="请输入分组名称"
                   :error="!albumEditState.isValid"
                   @input="checkAlbumCategoryName_WhileEditing">
          <template #button>
            <van-button size="small" type="primary" @click="changeAlbumCategoryName(albumEditState.albumName)">确认修改
            </van-button>
          </template>
        </van-field>
      </van-dialog>
      <!--添加分组-->
      <van-dialog v-model="albumAddState.albumAdding" title="添加分组" show-cancel-button :show-confirm-button="false">
        <van-field v-model="albumAddState.albumName" label="" placeholder="请输入分组名称"
                   :error="!albumAddState.isValid"
                   @input="checkAlbumCategoryName_WhileAdding">
          <template #button>
            <van-button size="small" type="primary" @click="addAlbumCategoryName(albumAddState.albumName)">确认添加
            </van-button>
          </template>
        </van-field>
      </van-dialog>
      <!--==========分组管理弹窗==========-->

      <!--==========图片管理弹窗==========-->
      <!--图片管理的主页-->
      <van-dialog v-model="photoAdmin" title="图片管理" cancelButtonText="关闭" show-cancel-button
                  :show-confirm-button="false">
        <van-field
          readonly
          clickable
          name="picker"
          :value="photoEditState.targetAlbum"
          label="选择分组"
          placeholder="点击选择分组"
          @click="photoEditState.showCategoryNamePicker = true"
        />
        <div style="padding: 0 10px">
          <van-button type="info" size="small" style="margin-bottom: 5px" block
                      @click="movePicture(photoEditState.targetAlbum)">
            将选择的图片移动至 =》 {{ photoEditState.targetAlbum }}
          </van-button>
          <van-button type="danger" size="small" block
                      @click="deletePicture">将选择的图片删除
          </van-button>
        </div>
      </van-dialog>
      <!--选择分组弹窗-->
      <van-popup v-model="photoEditState.showCategoryNamePicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="photoEditState.albumCategoryNames"
          @confirm="chooseAlbum"
          @cancel="photoEditState.showCategoryNamePicker = false"
        />
      </van-popup>
      <!--==========图片管理弹窗==========-->

      <!--==========图片预览==========-->
      <van-image-preview v-model="showPicture" :images="showPictures"
                         :showIndex="false" :closeable="true">
        <!--<template v-slot:index>第{{ index }}页</template>-->
      </van-image-preview>
      <!--==========图片预览==========-->
    </div>

  </div>
</template>

<script>
import global from "../../public/global";
import {Dialog, Notify, Toast} from 'vant';
import axios from "axios";
import Qs from 'qs'

export default {
  name: "maintainAlbum",
  data() {
    return {
      pestId: '',
      checked: [],
      activeNames: [],
      classifyAlbum: [],

      groupAdmin: false,
      albumEditState: {
        albumEditing: false,
        albumName: '',
        targetAlbum: null,
        isValid: true,
      },
      albumAddState: {
        albumAdding: false,
        albumName: '',
        isValid: true,
      },

      photoAdmin: false,
      photoEditState: {
        showCategoryNamePicker: false,
        targetAlbum: '未分类',
        albumCategoryNames: []
      },

      showPicture: false,
      showPictures: [],

      hasBeenModified: false,  // 是否已被修改，每次进行修改操作时，更改为true，保存后为false（其实不用，因为会刷新）

      developing: false,

    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);//返回上一层
    },
    choose(img) {
      img.checked = !img.checked
    },
    // 标记为已修改
    markModified() {
      this.hasBeenModified = true;
    },

    // 以下是分组管理函数
    deleteAlbum(targetAlbum) {
      // 如果删除的相册还有图片，则提醒用户如果删除将将该相册下的所有图片移动到“未分类”
      if (targetAlbum.images.length !== 0) {
        Dialog.confirm({
          title: '确认删除',
          message: '该分组下存在图片，若删除该分组，该分组下的所有图片将移动至“未分类”（未分类不将展示给用户）',
        })
          .then(() => {
            this.markModified()
            // on confirm
            let images = global.copy(targetAlbum.images)
            targetAlbum.images = []
            for (let album of this.classifyAlbum) {
              if (album.category === "未分类") {
                for (let image of images) {
                  album.images.push(image)
                }
                break;
              }
            }
            for (const index in this.classifyAlbum) {
              if (this.classifyAlbum[index].category === targetAlbum.category) {
                this.classifyAlbum.splice(index, 1)
                break;
              }
            }
          })
          .catch(() => {
            // on cancel
            // 啥也不做
          });
      } else {
        this.markModified()
        // 否则就是没有内容啦，那就删除
        for (const index in this.classifyAlbum) {
          if (this.classifyAlbum[index].category === targetAlbum.category) {
            this.classifyAlbum.splice(index, 1)
            break;
          }
        }
      }
    },
    editAlbum(targetAlbum) {
      this.albumEditState = {
        albumEditing: true,
        albumName: targetAlbum.category,
        targetAlbum: targetAlbum,
        isValid: true,
      }
    },
    addAlbum() {
      this.albumAddState = {
        albumAdding: true,
        albumName: '新建分组',
        isValid: true,
      }
    },
    // 仅在此处检测是否已存在此名称
    changeAlbumCategoryName(categoryName) {
      if (this.checkCategoryName(categoryName)) {
        // 如果改了名称，那就看看是否已存在
        if (categoryName !== this.albumEditState.targetAlbum.category) {
          for (const album of this.classifyAlbum) {
            if (album.category === categoryName) {
              Notify({type: 'danger', message: '分租名称已存在！'});
              return;
            }
          }
        }
        // 如果验证成功，就同步
        this.markModified()
        this.albumEditState.targetAlbum.category = categoryName
        this.albumEditState.albumEditing = false
      } else {
        // 验证不成功，就改变状态
        this.albumEditState.isValid = false
        Notify({type: 'danger', message: '分组名称应为不包含^?v\\*|"<>:/，且长度不大于256的非空字符串'});
      }
    },
    // 仅在此处检测是否已存在此名称
    addAlbumCategoryName(categoryName) {
      if (this.checkCategoryName(categoryName)) {
        for (const album of this.classifyAlbum) {
          if (album.category === categoryName) {
            Notify({type: 'danger', message: '分租名称已存在！'});
            return;
          }
        }
        this.albumAddState.albumAdding = false
        // 如果验证成功，就添加分组
        this.markModified()
        this.classifyAlbum.push({
          category: categoryName,
          images: []
        })
      } else {
        // 验证不成功，就改变状态
        this.albumAddState.isValid = false
        Notify({type: 'danger', message: '分组名称应为不包含^?v\\*|"<>:/，且长度不大于256的非空字符串'});
      }
    },
    checkAlbumCategoryName_WhileEditing(categoryName) {
      this.albumEditState.isValid = this.checkCategoryName(categoryName)
    },
    checkAlbumCategoryName_WhileAdding(categoryName) {
      this.albumAddState.isValid = this.checkCategoryName(categoryName)
    },
    checkCategoryName(categoryName) {
      return /^[^?v\*|"<>:/]{1,256}$/.test(categoryName);
    },

    // 以下是图片管理函数
    movePicture(targetAlbumName) {
      let targetAlbum = null
      let targetImagesObj = []
      for (let album of this.classifyAlbum) {
        // 只有与目标相册不同才需要加入到targetImagesObj
        if (album.category === targetAlbumName) {
          targetAlbum = album
        }
        // 选剩下的图册
        let restImages = []
        for (let image of album.images) {
          // 如果图片被选中，则加入到targetImagesObj
          if (image.checked) {
            // 取消选中
            image.checked = false
            targetImagesObj.push(image)
          } else {
            restImages.push(image)
          }
        }
        album.images = restImages
      }
      // 如果没有选中图片还要移动，则提示用户
      if (targetImagesObj.length === 0) {
        Toast.fail("您当前尚未选中图片！")
        return;
      }
      this.markModified()
      for (let image of targetImagesObj) {
        targetAlbum.images.push(image)
      }
      this.photoAdmin = false
    },
    chooseAlbum(categoryName) {
      this.photoEditState.targetAlbum = categoryName
      this.photoEditState.showCategoryNamePicker = false
    },
    openPhotoAdmin() {
      this.photoAdmin = true
      let categoryNames = []
      for (const album of this.classifyAlbum) {
        categoryNames.push(album.category)
      }
      this.photoEditState = {
        showCategoryNamePicker: false,
        targetAlbum: '未分类',
        albumCategoryNames: categoryNames
      }
    },
    deletePicture() {
      let count = 0
      for (let album of this.classifyAlbum) {
        // 选剩下的图册
        let restImages = []
        for (let image of album.images) {
          if (!image.checked) {
            restImages.push(image)
          } else {
            // 如果有选中的，那么就删除，这里标记一下以友好地提示用户
            count += 1
          }
        }
        album.images = restImages
      }
      if (count === 0) {
        Toast.fail("您当前尚未选择任何图片！")
        return;
      } else {
        this.markModified()
        Toast.success("已成功删除 " + count + " 张图片~")
      }
      this.photoAdmin = false
    },

    // 设置封面（已废弃）
    setPictureToCover() {
      let target = null
      for (let album of this.classifyAlbum) {
        for (let image of album.images) {
          if (image.checked) {
            if (target != null) {
              Notify({type: 'danger', message: '只能选择一张图片为封面！'});
              return
            }
            target = image
          }
        }
      }
      this.coverImage = target.imgUrl
      Notify({type: 'success', message: '已更改封面'});
    },

    // 展示图片
    displayPicture(img) {
      this.showPicture = true
      this.showPictures = [img.imgData]
    },

    // 获取相册列表信息
    getAlbumImagesRelativePath() {
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/admin-pestAlbum/getAlbumImagesRelativePath',
        params: {
          speciesId: this.pestId
        }
      })
        .then((response) => {
          // Map<String, List<String>>
          if (response.data.success) {
            this.classifyAlbum = []
            for (const key in response.data.data) {
              if (this.activeNames.length === 0) {
                this.activeNames.push(key)
              }
              let obj = {
                category: key,
                images: [],
              }
              for (const img of response.data.data[key]) {
                let image = {
                  imgUrl: img.imgId,
                  checked: false,
                  imgData: img.ossUrl,
                  loading: true
                }
                obj.images.push(image)
              }
              this.classifyAlbum.push(obj)
            }
          }
        })
        .catch((response) => {
        })
        .then((response) => {
        });
    },
    // 获取相册列表信息OSS版
    getAlbumImagesOSSPath() {
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/admin-pestAlbum/getAlbumImagesRelativePath',
        params: {
          speciesId: this.pestId
        }
      })
        .then((response) => {
          // Map<String, List<String>>
          if (response.data.success) {
            this.classifyAlbum = []
            let hasDefaultAlbum = false
            for (const key in response.data.data) {
              if (this.activeNames.length === 0) {
                this.activeNames.push(key)
              }
              if (key === "未分类") hasDefaultAlbum = true
              let obj = {
                category: key,
                images: [],
              }
              for (const img of response.data.data[key]) {
                let image = {
                  imgUrl: img.imgId,
                  checked: false,
                  imgData: img.ossUrl,
                  loading: true
                }
                obj.images.push(image)
              }
              this.classifyAlbum.push(obj)
            }
            if (!hasDefaultAlbum) {
              this.classifyAlbum.push({
                category: "未分类",
                images: [],
              })
            }
          }
        })
        .catch((response) => {
        })
        .then((response) => {
        });
    },
    // 异步方法，通过相对路径访问图片，获得base64码
    async getFileBase64ByRelativePath(obj) {
      this.axios({
        method: 'get',
        url: global.ApiUrl + '/resource/img/getFileBase64ByRelativePath',
        params: {
          imgRelativePath: obj.imgUrl,
        }
      })
        .then((response) => {
          obj.imgData = global.constant.base64Prefix + response.data.data
          obj.loading = false
        })
        .catch((response) => {
        })
        .then((response) => {
        });
    },
    // 保存修改
    saveChange() {
      let stateMap = {}
      for (const album of this.classifyAlbum) {
        stateMap[album.category] = []
        for (const image of album.images) {
          stateMap[album.category].push(image.imgUrl)
        }
      }
      // console.log(JSON.stringify(stateMap))
      // console.log(encodeURI(JSON.stringify(stateMap)))
      this.axios({
        method: 'post',
        url: global.ApiUrl + '/admin-pestAlbum/updateFolderByStateMap',
        params: {
          stateMap: encodeURI(JSON.stringify(stateMap)),
          speciesId: this.pestId
        }
      })
        .then((response) => {
          if (response.data.success) {
            this.hasBeenModified = false
            Toast.success("保存成功")
            location.reload()
          }
        })
        .catch((response) => {
        })
        .then((response) => {
        });
    },

    // 上传图片
    uploadImage(file) {
      const uploadToast = Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "正在上传图片，请稍等..."
      });
      // 实实在在地上传
      let imgBase64Data = file.content
      // console.log(imgBase64Data)
      this.axios({
        method: 'post',
        url: global.ApiUrl + '/admin-pestAlbum/uploadImage',
        data: {
          speciesId: this.pestId,
          imgBase64Data: imgBase64Data
        },
        timeout: 900000, //这个就是重点
      })
        .then((response) => {
          if (response.data.success) {
            let image = {
              imgUrl: response.data.data,
              checked: false,
              imgData: file.content,
              loading: false
            }
            for (const album of this.classifyAlbum) {
              if (album.category === "未分类") {
                album.images.push(image)
                break;
              }
            }
            uploadToast.clear()
            Toast.success('上传成功，请在【未分类】下查看该图片')
          }
        })
        .catch((response) => {
          console.log(response)
          uploadToast.clear()
          Toast.fail("上传失败！");
        })
        .then((response) => {
        });
    },
  },
  computed: {},
  mounted() {
    this.getAlbumImagesOSSPath()
  },
  created() {
    this.pestId = this.$route.params.pestId
  },
  beforeRouteLeave(to, from, next) {
    if (this.hasBeenModified) {
      const answer = window.confirm('您已修改了相册信息且尚未保存，是否放弃当前修改？')
      if (answer) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  }
}
</script>

<style scoped>
.buttonGroup {
  display: flex;
  align-items: center;
  justify-items: center;
  justify-content: space-around;
  margin: 10px 0;
}

.checked {
  background: deepskyblue;
  border: 1px solid deepskyblue;
  color: white;
}

.unchecked {
  border: 1px solid #d7d8d9;
}

.checkItem {
  margin: 5px;
}

.checkGroup {
  display: flex;
  justify-items: center;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-around;
}

.notice-swipe {
  height: 40px;
  line-height: 40px;
}

#topfix {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #acffcb;
  z-index: 999;
}
</style>
