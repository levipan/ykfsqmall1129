const app = getApp()
let name = ""
let password = ""

//-1订单取消,0新下单待发货,1已发货待领取，2已领取待评价,3订单已完成
let orderStatus = 0

let adminTZ = null
Page({
  data: {
    isAdmin: false,
    // 顶部菜单切换
    navbar: ["待到货", "待用户领取", "已完成"],
    // 默认选中菜单
    currentTab: 0,
    list: []
  },
  //退出登录
  loginOut() {
    this.setData({
      isAdmin: false
    })
    wx.setStorageSync('adminTZ', null)
  },
  //顶部tab切换
  navbarTap: function (e) {
    let index = e.currentTarget.dataset.idx;
    this.setData({
      currentTab: index
    })
    //-1订单取消,0新下单待发货,1已发货待领取，2已领取待评价,3订单已完成
    if (index == 0) {
      orderStatus = 0;
    } else if (index == 1) {
      orderStatus = 1;
    } else if (index == 2) {
      orderStatus = 3;
    } else {
      orderStatus = 0;
    }
    this.getOrderList();
  },
  onLoad() {
    adminTZ = wx.getStorageSync('adminTZ')
    if (adminTZ && adminTZ.phone && adminTZ.password) {
      orderStatus = 0
      this.getOrderList();
      this.setData({
        isAdmin: true
      })
      wx.setNavigationBarTitle({
        title: '我是团长~' + adminTZ.name,
      })
    } else {
      this.setData({
        isAdmin: false
      })
    }
  },
  getOrderList() {
    wx.cloud.callFunction({
        name: 'getOrderList',
        data: {
          action: 'tuanzhang',
          chiefId: adminTZ._id, //团长id
          status: orderStatus
        }
      })
      .then(res => {
        console.log("团长名下订单列表", res)
        this.setData({
          list: res.result.data
        })
      }).catch(res => {
        console.log("团长名下订单列表失败", res)
      })
  },
  //已到货
  daohuo(e) {
    wx.cloud.callFunction({
        name: 'tuanzhang',
        data: {
          action: 'daohuo',
          orderId: e.currentTarget.dataset.id,
        }
      })
      .then(res => {
        console.log("到货成功", res)
        this.getOrderList();
      }).catch(res => {
        console.log("到货失败", res)
      })
  },
  //用户已领取
  lingqu(e) {
    wx.cloud.callFunction({
        name: 'tuanzhang',
        data: {
          action: 'lingqu',
          orderId: e.currentTarget.dataset.id,
        }
      })
      .then(res => {
        console.log("到货成功", res)
        this.getOrderList();
      }).catch(res => {
        console.log("到货失败", res)
      })
  },

  //管理员登陆相关
  getName: function (e) {
    name = e.detail.value
  },

  getPassWord: function (e) {
    password = e.detail.value
  },
  formSubmit: function () {
    if (name == '' || name == undefined) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return;
    }
    if (password == '' || password == undefined) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    }
    this.login(name, password)
  },
  //登录
  login(phone, password) {
    wx.cloud.callFunction({
        name: "tuanzhang",
        data: {
          action: "login",
          phone: phone,
          password
        }
      })
      .then(res => {
        console.log("登陆成功", res)
        if (res.result && res.result.data.length > 0) {
          this.setData({
            isAdmin: true
          })
          adminTZ = res.result.data[0]
          wx.setStorageSync('adminTZ', adminTZ)
          this.getOrderList();
        } else {
          this.setData({
            isAdmin: false
          })
          wx.showToast({
            icon: 'none',
            title: '账号或密码错误',
          })
        }
      }).catch(res => {
        console.log("登陆失败", res)
        wx.showToast({
          icon: 'none',
          title: '账号或密码错误',
        })
        this.setData({
          isAdmin: false
        })
      })
  }



})