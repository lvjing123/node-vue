const connectDB = require('../dataBaseConnect')

export const queryClient = async(sql) => {
    const client = await connectDB()
    client.query(sql, (err, data) => {
    return new Promise(async(resolve, reject) => {
        if (err) {
            console.error(err, '数据库插入失败')
            reject(err)
            } else {
            await client.end();
            resolve(true)
        }
    })
})}