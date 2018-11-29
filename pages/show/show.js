const API_BASE = 'https://blog.ferer.net/wp-json'
const API_ROUTE_POSTS = 'wp/v2/posts'
const API_ROUTE_MEDIA = 'wp/v2/media'
const API_ROUTE_JWT_TOKEN = 'jwt-auth/v1/token'
const API_ROUTE_USER_REGISTER = 'users/v1/register'
const API_ROUTE_WEIXIN_BIND = 'weixin/v1/bind'
const API_ROUTE_JWT_VALIDATE = 'jwt-auth/v1/token/validate'
const API_ROUTE_WEIXIN_LOGIN = 'weixin/v1/login'

const app = getApp()
const { towxml } = app

Page({
  data: {
    title: '',
    content: {},
    featured_media: '',
    author: {},
    isLoading: true
  },
  onLoad (options) {
    const id = options.id

    wx.request({
      url: `${ API_BASE }/${ API_ROUTE_POSTS }/${ id }?_embed=true`,
      success: (response) => {
        const entity = response.data
        const title = entity.title.rendered
        // const content = entity.content.rendered
        const content = towxml.toJson(entity.content.rendered, 'html')
        const featuredMedia = entity.featured_media ? entity._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url : ''
        const author = entity._embedded.author[0]

        this.setData({
          ...entity,
          title,
          content,
          featuredMedia,
          author,
          isLoading: false
        })

        wx.setNavigationBarTitle({
          title
        })
      }
    })
  }
})
