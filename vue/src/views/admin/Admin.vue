<template>
    <!-- <el-button @click="open">开启socket</el-button>
    <el-button @click="close">关闭socket</el-button>
    <div>
        admin
        {{ t('common.name') }}
        {{ pageInfo.title }} 
    </div>
    <el-input v-model="inputValue" placeholder="Please input" />
    <el-button @click="add">添加一条数据</el-button>
    <el-table :data="userList" style="width: 100%">
        <el-table-column prop="user_id" label="id" width="120" />
        <el-table-column prop="user_name" label="name" width="260">
            <template #default="scope">
                <span v-if="editIndex !== scope.$index">{{ scope.row.user_name }}</span>
                <el-input v-else v-model="editRow.user_name" @keyup.enter.native="changeName" />
            </template>
        </el-table-column>
        <el-table-column fixed="right" label="Operations" width="120">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="deleteUser(scope.row)">删除</el-button>
                <el-button link type="primary" size="small" @click="editUser(scope.$index, scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table> -->
    <Logview :log="log" />
</template>

<script lang="ts" setup>
import { queryAdminPageInfo, saveAdminPageInfo, deleteAdminPageInfo, editAdminPageInfo } from '@/api/admin'
import { AdminModel } from '@/types/admin'
import { socket } from "@/socket"
import Logview from '@/components/logview/Logview.vue'

const { t } = useI18n()
const pageInfo: Ref<AdminModel> = ref({} as AdminModel)
const userList:Ref<any[]> = ref([])
const inputValue: Ref<string> = ref('')
const editIndex: Ref<number> = ref(-1)
//
const log = ref('') 
const get = url => new Promise((resolve, reject)=>{
  const xhr = new XMLHttpRequest()
  xhr.open("GET",url)
  xhr.send()
  xhr.onload = data => resolve(data.target.responseText)
})

const getPageInfo = async() => {
    try{
        const data = await queryAdminPageInfo()
        userList.value = data
    } catch {

    } 
}

const socketPage = () => {
    userList.value = []
    // 接手从服务端传来的消息
    socket.on('admin', (row: any) => {
        userList.value = row
    })
}

const open = () => {
    socket.connect()
}

const close = () => {
    socket.disconnect()
}

const add = async () => {
    // 普通的接口请求
    try{
        console.log('/121')
        const params = {
            user_name: inputValue.value
        }
        const data = await saveAdminPageInfo(params)
    } catch {

    } 
}

const deleteUser = async(row: any) => {
    const res = await deleteAdminPageInfo({
        user_id: row.user_id
    })
}

const editRow: Ref<any> = ref({})
const editUser = async (index: number, row: any) => {
    editIndex.value = index
    editRow.value = { ...row }
}

const changeName = async() => {
    const res = await editAdminPageInfo(editRow.value)
    editIndex.value = -1
    getPageInfo()
}

const getBuildLog = ()=> {
      const logUrl = 'https://mockapi.eolinker.com/IeZWjzy87c204a1f7030b2a17b00f3776ce0a07a5030a1b/log-viewer'
      get(logUrl).then(res=>{
        res = JSON.parse(res)
        log.value = res.payload.logs
      })
    }

onMounted( () => {
    // 获取页面需要渲染的数据，例如：
    // getBuildLog()
})

</script>

<style lang="scss" scoped>
.render-time{
    display: inline-block;
    line-height: 20px;
    font-size: 16px;
    margin: 10px;
}
</style>