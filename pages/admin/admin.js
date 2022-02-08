const app = getApp()
let name = ""
let password = ""

let db = wx.cloud.database()
const $ = db.command.aggregate

let adminPeiSong = null
Page({
  data: {
    isShowPopup: false,
    isAdmin: false,
    list: []
  },
  //退出登录
  loginOut() {
    this.setData({
      isAdmin: false
    })
    wx.setStorageSync('adminPeiSong', null)
  },
  onLoad() {
    adminPeiSong = wx.getStorageSync('adminPeiSong')
    if (adminPeiSong && adminPeiSong.name && adminPeiSong.password) {
      this.setData({
        isAdmin: true
      })
    }
    this.getTuanZhangOrder()
  },
  //配送员查询所有团长的订单
  getTuanZhangOrder() {
    // 1,查询总量
    db.collection('order')
      .aggregate()
      .match({
        status: 0
      })
      .group({
        _id: '$good.name',
        num: $.sum('$good.quantity')
      })
      .end().then(res => {
        console.log('查询团长订单成功', res)
        this.setData({
          list: res.list
        })
      }).catch(res => {
        console.log('查询团长订单失败', res)
      })
    // 2,查询每个团长
    db.collection('order')
      .aggregate()
      .match({
        status: 0
      })
      .group({
        _id: {
          chiefName: '$chiefName',
          pickupAddress: '$pickupAddress'
        },
        num: $.sum('$good.quantity')
      })
      .end().then(res => {
        console.log('查询团长订单成功2', res)
        this.setData({
          list2: res.list
        })
      }).catch(res => {
        console.log('查询团长订单失败2', res)
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
        title: '用户名不能为空',
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
  login(name, password) {
    wx.cloud.callFunction({
        name: "tuanzhang",
        data: {
          action: "peisongLogin",
          name: name,
          password
        }
      })
      .then(res => {
        console.log("登陆成功", res)
        if (res.result && res.result.data.length > 0) {
          this.setData({
            isAdmin: true
          })
          adminPeiSong = res.result.data[0]
          wx.setStorageSync('adminPeiSong', adminPeiSong)
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
  },

  /**
   * 查看每个团长的明细
   */
  detailed(e) {
    let item = e.currentTarget.dataset.item
    console.log(item._id.chiefName)
    db.collection('order')
      .aggregate()
      .match({
        status: 0,
        chiefName: item._id.chiefName
      })
      .group({
        _id: '$good.name',
        num: $.sum('$good.quantity')
      })
      .end().then(res => {
        console.log('查询单个团长订单成功', res)
        this.setData({
          chief: item,
          isShowPopup: true,
          list3: res.list
        })
      }).catch(res => {
        console.log('查询单个团长订单失败', res)
      })
  },
  closePop() {
    this.setData({
      isShowPopup: false,
    })
  }


})