module.exports = (socket) => {
    let userInfo = {
        name:'chushihua'
      }
    // 初始化页面
    socket.emit('initPage',userInfo)
    // 创建用户
    socket.on('createUser', async(args) => {
      console.log('添加用户，消息来自客户端', args)
      userInfo = args
      socket.emit('initPage',userInfo)
    })
}