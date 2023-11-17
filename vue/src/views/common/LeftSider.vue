<template>
    <div class="left-sider-container">
        <el-menu 
            class="el-menu-vertical-demo" 
            :default-active="defaultActive" 
            @open="handleOpen" 
            @close="handleClose"
            router
            >
            <MenuItem :menuItemData="menuData">
            </MenuItem>
        </el-menu>
    </div>
</template>

<script lang="ts" setup>
import { MenuModel } from '@/types/leftSider'
import MenuItem from '@/views/ElComs/MenuItem.vue'

const route = useRoute()

const menuData: Ref<MenuModel[]> = ref([])

const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}

const defaultActive: Ref<string> = ref('/admin')

const initMenuData = () => {
    menuData.value = [
        {
            title: 'admin',
            path: '/admin',
        },
        {
            title: 'manage',
            path: '/manage',
        }
    ]
}

watch(
  () => route.path,
  () => {
    try {
        defaultActive.value = route.path
    } catch (error) {
      //
    }
})

onMounted(() => {
    initMenuData()
})
</script>

<style lang="scss" scoped>
.left-sider-container {
    width: $aside-width;
}
</style>
