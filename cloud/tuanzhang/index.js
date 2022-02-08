// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const dbOrder = cloud.database().collection('order')
  if (event.action == 'daohuo') { //到货
    return await dbOrder.doc(event.orderId).update({
      data: {
        //-1订单取消,0新下单待发货,1已发货待领取，2已领取待评价,3订单已完成
        status: 1
      }
    })
  } else if (event.action == 'lingqu') { //用户已领取
    return await dbOrder.doc(event.orderId).update({
      data: {
        //-1订单取消,0新下单待发货,1已发货待领取，2已领取待评价,3订单已完成
        status: 2
      }
    })
  } else if (event.action == 'login') { //团长登录
    return await cloud.database().collection('tuanzhang').where({
      phone: event.phone,
      password: event.password
    }).get()
  } else if (event.action == 'peisongLogin') { //配送管理员登录
    return await cloud.database().collection('admin').where({
      name: event.name,
      password: event.password
    }).get()
  } else if (event.action == 'getTuanZhangOrder') { //配送员查询所有团长的订单
    return await dbOrder.where({
      name: event.name,
      password: event.password
    }).get()
  }
}