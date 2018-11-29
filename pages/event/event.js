const API_BASE = 'https://blog.ferer.net/wp-json'
const API_ROUTE_POSTS = 'wp/v2/posts'
const API_ROUTE_MEDIA = 'wp/v2/media'
const API_ROUTE_JWT_TOKEN = 'jwt-auth/v1/token'
const API_ROUTE_USER_REGISTER = 'users/v1/register'
const API_ROUTE_WEIXIN_BIND = 'weixin/v1/bind'
const API_ROUTE_JWT_VALIDATE = 'jwt-auth/v1/token/validate'
const API_ROUTE_WEIXIN_LOGIN = 'weixin/v1/login'

Page({

  data: {
    path: false,
    result: {},
    face_shape_type: '',
    isLoadingImage: false,
    progress: [],

    entities: [],
    embed: true,
    total: 0,
    totalPages: 0,
    currentPage: 1,
    isLoading: true,
    isEarth: false,

    isLoading: true,
    dataset: [],
    currentPage: 1,
    totalPages: 0,
    active: ''
  },

  onLoad: function() {
    wx.setNavigationBarTitle({
      title: '行在校园'
    })

    wx.setBackgroundColor({
      backgroundColor: '#743481',
      backgroundColorTop: '#743481',
      backgroundColorBottom: '#743481'
    })

    wx.request({
      url: 'https://lite.ferer.net/api/english/diglossia',
      success: response => {
        this.setData({
          isLoading: false,
          dataset: response.data.dataset,
          currentPage: response.data.page,
          totalPages: response.data.totalPages
        })
      },
      error: function(res) {
        console.log(response.res)
      }
    })

    wx.request({
      url: `${ API_BASE }/${ API_ROUTE_POSTS }?_embed=${ this.data.embed }`,
      success: (response) => {
        console.log(response)
        const entities = response.data
        this.setData({
          entities,
          isLoading: false,
          total: response.header['X-WP-Total'],
          totalPages: response.header['X-WP-TotalPages'],
          currentPage: 1,
          isEarth: false
        })
      }
    })
  },

  onChooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: (response) => {
        this.setData({
          isLoadingImage: true
        })

        response.tempFiles.map((file, index) => {
          console.log(file);
          const uploadTask = wx.uploadFile({
            url: 'https://tute.ferer.net/wxapp-tute-face',
            filePath: file.path,
            name: 'wxapp-tute-face-image',
            success: (response) => {
              var result = JSON.parse(response.data)
              if (result['face_result']['error_code'] == 0) {
                var face_shape_type = result['face_result']['result']['face_list'][0]['face_shape']['type']
                // square: 正方形 triangle: 三角形 oval: 椭圆 heart: 心形 round: 圆形
                switch (face_shape_type) {
                  case 'square':
                    face_shape_type = '检测出此脸型为正方形脸'
                    break;
                  case 'triangle':
                    face_shape_type = '检测出此脸型为三角形脸'
                    break;
                  case 'oval':
                    face_shape_type = '检测出此脸型为椭圆形脸'
                    break;
                  case 'heart':
                    face_shape_type = '检测出此脸型为心形脸'
                    break;
                  case 'round':
                    face_shape_type = '检测出此脸型为圆形脸'
                    break;
                  default:
                    face_shape_type = ''
                }

                this.setData({
                  path: file.path,
                  result,
                  face_shape_type,
                  isLoadingImage: false
                })
              } else if (result['face_result']['error_code'] == 222202) {
                this.setData({
                  path: file.path,
                  result,
                  isLoadingImage: false
                })
              }
            },
            error: (error) => {
              console.log(error);
            }
          })

          uploadTask.onProgressUpdate((response) => {
            const progress = [...this.data.progress]
            progress[index] = response.progress

            this.setData({
              progress
            })
          })
        })
      }
    })
  },

  onLongpressImage(event) {
    wx.showActionSheet({
      itemList: ['重新上传', '查看图片', '删除图片'],
      success: (response) => {
        switch (response.tapIndex) {
          case 0:
            this.destroyImage(event.currentTarget.dataset.id)
            this.onChooseImage()
            break
          case 1:
            wx.previewImage({
              current: event.currentTarget.dataset.src,
              urls: ['https://tute.ferer.net/wxapp-tute-face/' + event.currentTarget.dataset.id]
            })
            break
          case 2:
            this.destroyImage(event.currentTarget.dataset.id)
            break
          default:
            console.log(response)
        }
      }
    })
  },

  share: function() {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  onReachBottom: function() {
    if (this.data.currentPage >= this.data.totalPages || this.data.isLoading) {
      return
    }

    this.setData({
      isLoading: true
    })

    setTimeout(() => {
      wx.request({
        url: `https://lite.ferer.net/api/english/diglossia?page=${ this.data.currentPage + 1 }`,
        success: response => {
          this.setData({
            isLoading: false,
            dataset: [...this.data.dataset, ...response.data.dataset],
            currentPage: response.data.page,
            totalPages: response.data.totalPages
          })
        },
        error: function(res) {
          console.log(response.res)
        }
      })
    }, 1000)
  },

  destroyImage(id) {
    this.setData({
      path: false,
      result: {}
    })
  },

  onPreviewImage(event) {
    wx.previewImage({
      current: event.currentTarget.dataset.src,
      urls: ['https://tute.ferer.net/wxapp-tute-face/' + event.currentTarget.dataset.id]
    })
  },

  onShareAppMessage(response) {
    return {
      title: '行在图特',
      path: '/pages/event/event',
      success: function() {},
      fail: function() {}
    }
  },

  onAlert() {
    wx.showModal({
      title: '敬请期待',
      content: '功能尚未完成',
      showCancel: false,
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },

  onSwitchItem(event) {
    console.log(event.currentTarget.dataset.word);
    this.setData({
      active: !this.data.active ? event.currentTarget.dataset.word : ''
    })
  }
})
