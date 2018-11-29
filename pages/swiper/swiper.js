Page({
  data: {
    itemTitle: ['全部消息', '失物招领', '招聘信息', '校园动态', '英语学习'],
    itemCurrent: 0
  },

  onLoad: function (options) {
    wx.setBackgroundColor({
      backgroundColor: '#743481',
      backgroundColorTop: '#743481',
      backgroundColorBottom: '#FFFFFF'
    })
  },

  bindChange: function (event) {
    this.setData({
      itemCurrent: event.detail.current
    })
  },

  bindTopSwitch: function (event) {
    this.setData({
      itemCurrent: event.currentTarget.dataset.itemcurrent
    })
  }
})
