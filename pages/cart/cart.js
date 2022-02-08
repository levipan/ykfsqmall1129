const app=getApp()
const db = wx.cloud.database()
Page({
  data: {
    totalMoney: 0,
    totalNum: 0,
    cartList: [], //购物车数据
  },
  onLoad: function (options) {
    console.log('执行了onLoad')
  },
  onShow() {
    console.log('执行了onShow')
    // 获取购物车缓存数据
    let cartList = wx.getStorageSync('cart') || []
    console.log('本地缓存的购物车数据', cartList)
    this.setData({
      cartList: cartList
    })
    this.getTotal()
  },


  // 点击减少
  jian(e) {
    let id = e.currentTarget.dataset.id
    console.log('点击了-', e.currentTarget.dataset.id)
    let cartList = this.data.cartList
    // 遍历购物车
    cartList.forEach((item, index) => {
      if (item._id == id) {
        if (item.quantity > 0) {
          item.quantity -= 1
          if (item.quantity == 0) { //如果点击的菜品数量为0，就移除
            cartList.splice(index, 1) //删除下标为index的元素
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: '数量不能小于0',
          })
        }
      }
    })
    console.log('-----遍历以后的购物车列表', cartList)
    this.setData({
      cartList
    })
    this.getTotal()
    wx.setStorageSync('cart', cartList)
  },
  // 点击加号
  jia(e) {
    let id = e.currentTarget.dataset.id
    console.log('点击了+', e.currentTarget.dataset.id)
    let cartList = this.data.cartList
    cartList.forEach(item => {
      if (item._id == id) {
        item.quantity += 1
      }
    })
    console.log('++++遍历以后的购物车列表', cartList)
    this.setData({
      cartList
    })
    this.getTotal()
    wx.setStorageSync('cart', cartList)
  },
  // 计算总价格和总数量
  getTotal() {
    let cartList = this.data.cartList
    let totalMoney = 0
    let totalNum = 0

    cartList.forEach(item => {
      totalNum += item.quantity
      totalMoney += item.quantity * item.price
    })
    this.setData({
      totalMoney,
      totalNum
    })
  },


  // 删除购物车里的一条数据
  closeCartItem(e) {
    console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    let cartList = this.data.cartList
    // 从购物车数组里删除当前菜品
    cartList.splice(index, 1)

    this.setData({
      cartList
    })
    // 重新计算总价格
    this.getTotal()
    // 把更新后的数据重新缓存
    wx.setStorageSync('cart', cartList)
  },
  // 去商品列表页
  goMall() {
    wx.navigateTo({
      url: '/pages/mall/mall',
    })
  },
  // 去支付
  goOrder() {
    let userInfo = app.globalData.userInfo;
    if (!userInfo || !userInfo.nickName) {
      this.showLoginView()
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/pay',
    })
  },
  /**
   *  授权登陆相关
   */
  //弹起登录弹窗
  showLoginView() {
    this.setData({
      isShowAddressSetting: true
    })
  },
  //关闭登录弹窗
  closeLoginView() {
    this.setData({
      isShowAddressSetting: false
    })
  },
  //授权登录
  goLogin(e) {
    console.log('用户信息', e)
    if (e.detail.userInfo) {
      var user = e.detail.userInfo;
      this.setData({
        isShowAddressSetting: false
      })
      user.openid = app.globalData.openid;
      app._saveUserInfo(user);
      wx.navigateTo({
        url: '/pages/pay/pay'
      })
    } else {
      app.showErrorToastUtils('登陆需要允许授权');
    }
  },
})