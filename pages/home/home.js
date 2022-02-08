const app = getApp()
let searchKey = '' //搜索词
const db = wx.cloud.database()
Page({
  data: {
    tzName: '未选择',
    banner: [{
        picUrl: '/image/1.jpg'
      },
      {
        picUrl: '/image/2.jpg'
      }, {
        picUrl: '/image/3.jpg'
      }
    ],
  },
  //切换团长
  changeTZ() {
    wx.navigateTo({
      url: '/pages/myChief/myChief',
    })
  },

  //页面可见
  onShow() {
    this.getTopBanner() //请求顶部轮播图
    this.getHotGood() //请求首页推荐商品
    //选择过团长
    if (app.globalData.tuanzhang && app.globalData.tuanzhang.name) {
      this.setData({
        tzName: app.globalData.tuanzhang.name
      })
    }

  },
  //获取用户输入的搜索词
  getSearchKey(e) {
    searchKey = e.detail.value
  },
  //搜索点击事件
  goSearch() {
    wx.navigateTo({
      url: '/pages/newGood/newGood?searchKey=' + searchKey,
    })
  },
  //获取首页顶部轮播图
  getTopBanner() {
    db.collection("lunbotu")
      .get()
      .then(res => {
        console.log("首页banner成功", res.data)
        if (res.data && res.data.length > 0) {
          //如果后台配置轮播图就用后台的，没有的话就用默认的
          this.setData({
            banner: res.data
          })
        }
      }).catch(res => {
        console.log("首页banner失败", res)
      })
  },
  //去商城
  goMall() {
    wx.navigateTo({
      url: '/pages/mall/mall',
    })
  },
  //去新品页
  goNewGood() {
    wx.navigateTo({
      url: '/pages/newGood/newGood',
    })
  },
  //查看公司地址
  goAddress() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },

  //获取首页推荐位的商品
  getHotGood() {
    wx.cloud.callFunction({
      name: "getGoodList",
      data: {
        action: 'getHot'
      }
    }).then(res => {
      console.log("首页推荐商品数据", res.result)
      this.setData({
        goodList: res.result.data,
      })
    }).catch(res => {
      console.log("菜品数据请求失败", res)
    })
  },
  //去商品详情页
  goDetail(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?goodid=' + e.currentTarget.dataset.id
    })
  },

})