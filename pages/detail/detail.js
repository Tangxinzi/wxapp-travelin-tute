const app = getApp()

Page({
  data: {
    isLoading: true,
    lite: null,
    options: '',
    description: null,
    diglossia: null,
    summary: '',
    currentVideo: null,
    currentVid: null,
    currentVideoContent: {},
    currentVideoRecommend: {}
  },

  videoPlay: function (event) {
    if (this.data.currentVid !== null) {
      this.data.currentVideo.pause()
    }

    const currentVideo = wx.createVideoContext(`${ event.target.dataset.vid }`)
    currentVideo.play()

    this.setData({
      currentVideo,
      currentVid: event.target.dataset.vid
    })
  },

  audioPlay: function () {
    this.currentAudio = wx.createAudioContext('audio')
    this.currentAudio.play()
  },

  onReachBottom: function () {
    if (this.data.options == 'diglossia') {

    }
  },

  onLoad: function (options) {
    if (options.active == 'diglossia') {
      wx.request({
        url: `https://lite.ferer.net/api/english/diglossia/${ options.id }`,
        success: response => {
          this.setData({
            options: 'diglossia',
            isLoading: false,
            summary: options.text,
            diglossia: response.data
          })

          wx.setNavigationBarTitle({
            title: response.data.title
          })
        },
        error: function(res) {
          console.log(response.res)
        }
      })
    } else if (options.active == 'video') {
      wx.request({
        url: `https://lite.ferer.net/api/lite/video/${ options.id }?type=${ options.type }`,
        success: response => {
          this.setData({
            options: 'video',
            currentVideoContent: response.data.play,
            currentVideoRecommend: response.data.recommend
          })
        },
        error: function(res) {
          console.log(response.res)
        }
      })

      if (options.type == 'recommend') {
        wx.setNavigationBarTitle({
          title: '编辑推荐'
        })
      } else if (options.type == 'introduction_to_japanese') {
        wx.setNavigationBarTitle({
          title: '走进日语'
        })
      }


    } else {
      this.setData({
        options: 'detail',
        lite: app.globalData.resources.sentences[options.id]
      })

      let lite = this.data.lite
      let description = lite.description.split(/\n/).map(p => {
        return (p)
      })

      this.setData({
        description: description
      })
    }
  },

  onShareAppMessage: function (response) {
    return {
      title: '日语学习最佳工具',
      path: '/pages/event/event',
      success: function () { },
      fail: function () { }
    }
  }
})
