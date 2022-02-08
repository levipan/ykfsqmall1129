Page({
  data: {
    address: '改成你的地址', //团购公司地址
    phone: '改成你的电话', //投诉电话
    weixin: '改成你的微信', //公司微信，用于投诉
    //店铺经纬度
    latitude: 30.353351,//换成你自己的
    longitude: 120.231010,//换成你自己的
    //标记点
    markers: [{
      id: 0,
      name: "改成你公司的名字",//换成你自己的
      address: "改成你的地址",//换成你自己的
      latitude: 30.353351,//换成你自己的
      longitude: 120.231010,//换成你自己的
      width: 50,
      height: 50
    }]

  },
  //拨打电话
  Call() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone //仅为示例，这个号码也是石头哥的微信号
    })
  },
  //复制微信
  Copy() {
    wx.setClipboardData({
      data: this.data.weixin,
    })
  },
  //导航
  navRoad(event) {
    console.log(event)
    wx.getLocation({ //获取当前经纬度
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度，
      success: function (res) {
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: event.currentTarget.dataset.marker.latitude, //要去的纬度-地址
          longitude: event.currentTarget.dataset.marker.longitude, //要去的经度-地址
          name: event.currentTarget.dataset.marker.name,
          address: event.currentTarget.dataset.marker.address
        })
      }
    })
  }
})