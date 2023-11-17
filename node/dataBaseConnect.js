// 使用 dotenv 读出数据库的配置
const dotenv = require('dotenv')
const { Client } = require('pg')
dotenv.config()

// const client = new Client({
//     user: process.env.PGUSER,
//     host: process.env.PGHOST,
//     database: process.env.PGDATABASE,
//     password: process.env.PGPASSWORD,
//     port: process.env.PGPORT
// })

module.exports = async(sql) => {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'node',
        password: '2161105452',
        port: '5432'
    })
    await client.connect()
    return new Promise((resolve, reject) => {
        client.query(sql, async(err, res) => {
            if (err) {
                console.error(err, '数据库插入失败')
                reject(err)
            } else {
                await client.end();
                return resolve(res)
            }
        })
    })  
}
