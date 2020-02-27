import {
  API_BASE,
  API_ROUTE_WEIXIN_LOGIN,
  API_ROUTE_WEIXIN_BIND
} from './config/api'

const weixinLogin = (callback) => {
  wx.login({
    success: (login) => {
      wx.request({
        url: `${ API_BASE }/${ API_ROUTE_WEIXIN_LOGIN }`,
        method: 'POST',
        data: {
          code: login.code
        },
        success: (response) => {
          callback(response)
        }
      })
    }
  })
}

const weixinBind = ({ userInfo, userId, token } = obj) => {
  wx.login({
    success: (login) => {
      // console.log(`https://api.weixin.qq.com/sns/jscode2session?appid=wx2b30c02059e20c8c&secret=0cc42eec201871ea5c6ec5335c04b075&js_code=${ login.code }&grant_type=authorization_code`);
      wx.request({
        url: `${ API_BASE }/${ API_ROUTE_WEIXIN_BIND }`,
        method: 'POST',
        header: {
          'Authorization': `Bearer ${ token }`
        },
        data: {
          code: login.code,
          userInfo,
          userId
        },
        success: (response) => {
          console.log(response)
        }
      })
    }
  })
}

export {
  weixinLogin,
  weixinBind
}
