<template>
    <el-container class="dashboard-container">
      <el-header>
        <Header></Header>
      </el-header>
      <el-container>
        <el-aside>
          <LeftSider></LeftSider>
        </el-aside>
        <el-container>
          <el-main>
            <router-view />        
          </el-main>
        </el-container>
      </el-container>
    </el-container>
</template>
  
<script lang="ts" setup>
import Header from '@/views/common/Header.vue'
import LeftSider from '@/views/common/LeftSider.vue'
</script>
  
<style lang="scss" scoped>
.dashboard-container {
  min-width: 1280px;
  overflow-x: auto;
  min-height: calc(100vh - 60px);
  width: 100%;
  :deep(.el-header){
      padding: 0;
  }
  :deep(.el-aside ){
      width: $aside-width;
  }
}
</style>
  