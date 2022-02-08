const app = getApp();
Page({
  // 页面的初始数据
  data: {
    userInfo: null,
  },
  // 授权登录
  login() {
    wx.getUserProfile({
      desc: '必须授权才可以继续使用',
      success: res => {
        let user = res.userInfo
        this.setData({
          userInfo: user,
        })
        user.openid = app.globalData.openid;
        app._saveUserInfo(user);
      },
      fail: res => {
        console.log('授权失败', res)
      }
    })
  },

  // 退出登录
  loginOut() {
    this.setData({
      userInfo: ''
    })
    wx.setStorageSync('user', null)
  },

  goToMyOrder: function () {
    wx.navigateTo({
      url: '../myOrder/myOrder',
    })
  },

  goToMyComment: function () {
    wx.navigateTo({
      url: '../mycomment/mycomment?type=1',
    })
  },

  //团长登录
  goTZAdmin() {
    wx.navigateTo({
      url: '../adminTZ/adminTZ',
    })
  },
  //配送员登录
  goPSAdmin() {
    wx.navigateTo({
      url: '../admin/admin?type=2',
    })
  },
  //去评论页面
  goCommentPage() {
    wx.navigateTo({
      url: '/pages/myComment/myComment',
    })
  },
  //去我的团长页
  myTZ() {
    wx.navigateTo({
      url: '/pages/myChief/myChief',
    })
  },
  onShow(options) {
    var user = app.globalData.userInfo;
    if (user && user.nickName) {
      this.setData({
        userInfo: user,
      })
    }
  },
})