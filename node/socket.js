const socket = require("socket.io")
const manageSocket = require('./views/manage')
const adminSocket = require('./views/admin')


module.exports = (server) => {
  // console.log('server')
  const io = socket(server, {
    cors: {
      origin: "*",
    }
  })
  // 事件
  io.on('connection', async(socket) => {
    console.log('连接成功')
    adminSocket(socket)
  })
}