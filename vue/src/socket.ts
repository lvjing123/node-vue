import io from "socket.io-client"

interface StateModel {
    connected: boolean
    adminEvents: any[]
}
export const state = reactive({
    connected: false,
    adminEvents: [],
} as StateModel)

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000'

export const socket = io('http://localhost:3000')

socket.on('connect', () => {
    console.log('客户端开始连接')
    state.connected = true
})

socket.on('disconnect', () => {
    console.log('关闭连接')
    state.connected = false
})


