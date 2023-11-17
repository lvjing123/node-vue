const express = require('express');
const router = express.Router();
const getRequest = require('../utils/getRequest')
const http = require('http');
// 引入数据库的连接
const queryClient = require('../dataBaseConnect')

router.get('/page', async(request, response, next) => {
  const sql = `select user_id, user_name from user_table`
  const queryRes = await queryClient(sql)
  response.send(queryRes.rows)
})


router.post('/page/save', async(request, response, next) => {
  // 1: 接受从客户端传来的数据，
  let username = request.body.user_name
  let user_id = 0
  let queryAllUserNumberSql = `select user_id, user_name from user_table`
  // 2: 找数据库user total
  const queryAllUserNumberSqlRes = await queryClient(queryAllUserNumberSql)
  // user_id 是数组最后一个元素的id+ 1
  user_id = queryAllUserNumberSqlRes.rows[queryAllUserNumberSqlRes.rows.length - 1].user_id + 1
  // console.log(user_id, '-===')
  const insertUserSql = `INSERT INTO user_table (user_id, user_name) VALUES ('${user_id}','${username}')`
  await queryClient(insertUserSql)
  response.send('添加成功')
})


router.delete('/page/delete', async(request, response, next) => {
  // 1: 接受从客户端传来的用户id
  let user_id = request.body.user_id
  let deletSql = `delete from user_table where user_id = ${user_id}`
  await queryClient(deletSql)
  response.send('删除成功')
})


router.post('/page/edit', async(request, response, next) => {
  // 1: 接受从客户端传来的用户id
  let user_id = request.body.user_id
  let user_name = request.body.user_name
  // console.log(user_id, user_name)
  let editSql = `update user_table set user_name = '${user_name}' where user_id = ${user_id}`
  await queryClient(editSql)
  response.send('更新成功')
})

module.exports = router;
