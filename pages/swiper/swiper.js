import {
  API_BASE,
  API_ROUTE_POSTS
} from '../../libs/config/api'

import moment from '../../libs/moment/moment'
import '../../libs/moment/locale/zh-cn'
moment.locale('zh-cn')

const app = getApp()
const { towxml } = app

Page({
  data: {
    itemTitle: ['全部消息', '热门推荐', '招聘信息', '英语学习', '校园生活'],
    itemCurrent: 0,
    swiperItemHeight: 0,

    isLoading: true,
    dataset: [],
    currentPage: 1,
    totalPages: 0,
    winHeight: 0,

    entities_all: [],
    entities_home_hot: [],
    entities_recruitment: [],
    entities_home_carousel_map: [],
    entities_home_school_life: [],
  },

  transformDates (items) {
    return items.map((item) => {
      const _ts = this;    // 在此处保存this

      let data = towxml.toJson(item.content.rendered, 'html')
      data = towxml.initData(data, {
        app: _ts
      })

      let content = {
        ...item.content,
        // wxml: towxml.toJson(item.content.rendered, 'html')
        wxml: data
      }

      const excerpt = {
        ...item.excerpt,
        wxml: towxml.toJson(item.excerpt.rendered, 'html')
      }

      const format = moment(item.date).utc().local().fromNow()

      return {
        ...item,
        content,
        excerpt,
        format
      }
    })
  },

  onLoad: function(options) {
    wx.setBackgroundColor({
      backgroundColor: '#743481',
      backgroundColorTop: '#743481',
      backgroundColorBottom: '#FFFFFF'
    })

    this['event_bind_touchstart'] = (event)=>{
        console.log(event.target.dataset._el);     // 打印出元素信息
    };

    // 给todoList添加监听事件
    this['eventRun_todo_checkboxChange'] = (event)=>{
        console.log(event.detail);                 // todoList checkbox发生change事件
    };

    wx.request({
      url: `${ API_BASE }/${ API_ROUTE_POSTS }?_embed=${ this.data.embed }&page=1&per_page=8`,
      success: (response) => {
        const entities_all = this.transformDates(response.data)
        console.log(entities_all)
        this.setData({
          entities_all
        })

        this.createSelectorQuery()
      }
    })

    wx.request({
      url: `${ API_BASE }/${ API_ROUTE_POSTS }?_embed=${ this.data.embed }&page=1&per_page=5&filter[category_name]=home-hot`,
      success: (response) => {
        const entities_home_hot = this.transformDates(response.data)
        console.log(entities_home_hot)
        this.setData({
          entities_home_hot
        })
      }
    })

    wx.request({
      url: `${ API_BASE }/${ API_ROUTE_POSTS }?_embed=${ this.data.embed }&page=1&per_page=5&filter[category_name]=home-carousel-map`,
      success: (response) => {
        const entities_home_carousel_map = response.data
        console.log(entities_home_carousel_map)
        this.setData({
          entities_home_carousel_map
        })
      }
    })

    wx.request({
      url: `${ API_BASE }/${ API_ROUTE_POSTS }?_embed=${ this.data.embed }&page=1&per_page=5&filter[category_name]=recruitment`,
      success: (response) => {
        const entities_recruitment = this.transformDates(response.data)
        console.log(entities_recruitment)
        this.setData({
          entities_recruitment
        })
      }
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
      url: `${ API_BASE }/${ API_ROUTE_POSTS }?_embed=${ this.data.embed }&page=1&per_page=5&filter[category_name]=home-school-life`,
      success: (response) => {
        const entities_home_school_life	= this.transformDates(response.data)
        console.log(entities_home_school_life)
        this.setData({
          entities_home_school_life
        })
      }
    })
  },

  createSelectorQuery: function () {
    const query = wx.createSelectorQuery()
    query.select('.container.active').boundingClientRect()
    query.exec(response => {
      this.setData({
        swiperItemHeight: response[0]['height']
      })
    })
  },

  bindChange: function(event) {
    this.setData({
      itemCurrent: event.detail.current
    })
    this.createSelectorQuery()
  },

  bindTopSwitch: function(event) {
    this.setData({
      itemCurrent: event.currentTarget.dataset.itemcurrent
    })
    this.createSelectorQuery()
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
          this.createSelectorQuery()
        },
        error: function(res) {
          console.log(response.res)
        }
      })
    }, 1000)
  }
})
