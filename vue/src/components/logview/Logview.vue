<template>
  <VirtualList
    class="log-viewer"
    ref="virturalListRef"
    :data-key="'uid'"
    :data-sources="dataSource"
    :data-component="LineWrapper"
    :estimate-size="50"
    :extra-props="extraProps"
    @totop="toTop"
    @tobottom="toBottom"
  />
</template>

<script setup lang="tsx">
import VirtualList from 'vue3-virtual-scroll-list';
import LogLoading from '@/components/logview/loading.vue'
import parse from '@/utils/parse'
import LineWrapper from '@/components/logview/line-wrapper.vue'

const start: Ref<number> = ref(0)
const animate = ref(null)

const virturalListRef = ref()
const props = defineProps({
  rowHeight: {
    type: Number,
    default: 20
  },
  height: {
    type: Number,
    default: 20
  },
  /**
   * The orginal log text shuold be shown
   */
  log: {
    type: String,
    default: '',
  },
  /**
   * Loading Status flag
   */
  loading: {
    type: Boolean,
    default: false
  },
  /**
   * Auto scroll to the bottom when the logs update. Defaults to be true
   */
  autoScroll: {
    type: Boolean,
    default: true
  },
  /**
   * Has number line if hasNumber is true. Defaults to be true.
   */
  hasNumber: {
    type: Boolean,
    default: true
  },
  /**
   * Auto scroll to bottom's time duration(ms), defaults to 0 means to no duration.
   */
  scrollDuration: {
    type: Number,
    default: 1000
  }
})

// 可以参考聊天室的功能
// https://github.com/reactjser/vue3-virtual-scroll-list-examples/blob/main/src/views/chat-room/Main.vue

const isScroll: Ref<Boolean> = ref(props.autoScroll)
// 除了key 和 source 需要额外传给log 的 每一个子元素的配置项
const extraProps = computed(() => {
  return {
    height: props.height,
    hasNumber: props.hasNumber,
  }
})

const dataSource = ref(
  [
    {
      uid: 'unique_1', 
      text: { foreground: 'black',
            bold: true,
            text: 'color is red and bold is true'
        }
    },
    {
      uid: 'unique_2', 
      text: { foreground: 'black',
            bold: true,
            text: 'asdgsgsg'
        },
    },
    {
      uid: 'unique_3', 
      text: { foreground: 'black',
            bold: true,
            text: 'sdsddfdf=========121'
        },
    },
      
      
  ]
)

// 滚动到顶部的时候，停止自动滚动
const toTop = () => {
  isScroll.value = false
}

// 滚动到底部的时候，开始自动滚动
const toBottom = () => {
  isScroll.value = true
}

watch(
  () => [...dataSource.value],
  (val: any) => {
    if (isScroll.value) {
      virturalListRef.value && virturalListRef.value.scrollToIndex(val.length + 1)
    }
},{
  immediate: true,
}
)


// 边缘服务列表轮询
let intervalSetData: NodeJS.Timer | null = null
const getInterval = async () => {
  intervalSetData = setInterval(async () => {
    const time = new Date().getTime()
    dataSource.value.push({
      uid: `unique_${time}`, 
      text: { foreground: 'black',
            bold: true,
            text: time
        }
    },)
  }, 1000)
}

onMounted( () => {
  getInterval()
})

onUnmounted(() => {
  if (intervalSetData) {
    clearInterval(intervalSetData as NodeJS.Timer)
    intervalSetData = null
  }
})



</script>
<style lang="scss" scoped>
.log-viewer {
  font-size: 12px;
  background-color: #222;
  padding: 20px 0;
  height: 200px;
  overflow-y: auto;
}
</style>