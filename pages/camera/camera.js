Page({
  onLoad() {
    this.ctx = wx.createCameraContext()

    setTimeout(() => {
      this.takePhoto()
    }, 3000);
  },

  takePhoto() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  },

  error(e) {
    console.log(e.detail)
  }
})
