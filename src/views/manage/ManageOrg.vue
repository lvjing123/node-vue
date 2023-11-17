<template>
    <div>
        manage
        {{ t('common.name') }}
        {{ `${pageInfo.name}` }}
        <el-button @click="handlerOpenSocket">点击</el-button>
        <el-button @click="handlerClick">点击1</el-button>
    </div>
</template>

<script lang="ts" setup>
import { socket } from '@/socket'

const { t } = useI18n()

interface pageInfo {
    name: string
    id?: number
}

const pageInfo: Ref<pageInfo> = ref({
    name:''
} as pageInfo)

const handlerOpenSocket = () => {
    socket.emit('createUser', {
        name: 'duduud',
        id: 1
    })
}

const handlerClick = () => {
    socket.emit('addAdmin', {
        name: 'admin',
        id: 1
    })
}

const init = () => {
    socket.on('initPage', (data: pageInfo) => {
        console.log(data, 'data in client')
        pageInfo.value = data
    })
}
onMounted( () => {
    init()
})

</script>

<style lang="scss" scoped></style>