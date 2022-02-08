const app = getApp()
const db = wx.cloud.database()
Page({

  onLoad() {
    //选择过团长
    if (app.globalData.tuanzhang && app.globalData.tuanzhang.name) {
      this.setData({
        chief: app.globalData.tuanzhang
      })
    } else {
      this.setData({
        chief: {}
      })
    }
  },
  //拨打团长电话
  call(e) {
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  //复制团长微信
  copy(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.weixin,
    })
  },
  //获取团长信息
  getTuanZhang() {
    db.collection('tuanzhang').get()
      .then(res => {
        this.setData({
          tuanzhangList: res.data
        })
      })
  },
  //切换团长
  changeTZ() {
    this.getTuanZhang(); //请求团长列表
    this.setData({
      isShowPopup: true,
    })
  },
  //选择团长
  selectTZ(e) {
    let item = e.currentTarget.dataset.item
    console.log(item)
    wx.showModal({
      title: '确定选择？',
      content: '您要选择' + item.name + "做为您的团长",
      cancelColor: '取消',
      success: res => {
        if (res.confirm) {
          app._saveTuanZhang(item)
          this.setData({
            chief: item,
            isShowPopup: false,
          })
        }
      }
    })
  },
})