const queryClient = require('../dataBaseConnect')
module.exports = (socket) => {
  //从数据库获取数据
  const adminInterval = setInterval(async() => {
    // 从数据库查用户的数据
    const sql = `select user_id, user_name from user_table`
    // const client = await connectDB()
    // client.query(sql, async(err, res) => {
    //   if (err) {
    //     console.error(err, '数据库查询失败')
    //   } else {
    //     await client.end()
    //     socket.emit("admin", res.rows)
    //   }
    // })
    const queryRes = await queryClient(sql)
    socket.emit("admin", queryRes.rows)
  }, 3000);

  socket.on("disconnect", (reason) => {
    console.log('客户端关闭连接')
    clearInterval(adminInterval)
  });
}