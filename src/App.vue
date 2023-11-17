<template>
  <el-config-provider 
    :locale="locale"
    :message="config"
  >
    <Base></Base> 
  </el-config-provider>
</template>

<script lang="ts" setup>
import Base from '@/views/common/Base.vue'
import { useLangStoreWidthOut } from '@/store/modules/lang'
import zhCn from 'element-plus'
import en from 'element-plus'

const langStore = useLangStoreWidthOut()
const language = computed(() => langStore.getLang)
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))

const config = reactive({
  max: 3
})
</script>

<style lang="scss"></style>
