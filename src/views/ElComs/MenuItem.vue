<template>
    <div>
        <template v-for="item in props.menuItemData">
            <!-- 因为有子集和无子集渲染html标签不一样，所以要分为两种情况
            情况一：有子集的情况：                         -->
            <el-sub-menu v-if="item?.children && item.children.length" :key="item.path" :index="item.path">
                <template #title>
                    <i :class="item.icon"></i>
                    <span>{{ item.title }}</span>
                </template>
                <MenuItem :menuItemData="item.children"></MenuItem>
            </el-sub-menu>
            <!-- 情况二：没子集的情况： -->
            <el-menu-item :key="item.path + 'item'" v-else :index="item.path">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
            </el-menu-item>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { MenuModel } from '@/types/leftSider'
import MenuItem from '@/views/ElComs/MenuItem.vue'
const props = defineProps({
    // 列名称
    menuItemData: {
        type: Array as PropType<MenuModel[]>,
        default: () => [],
    },
})
</script>

<style lang="scss" scoped></style>
