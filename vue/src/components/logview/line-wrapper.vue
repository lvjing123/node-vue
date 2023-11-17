<template>
    <div class="line-wrapper" :style="customStyle">
      <line-number v-if="props.hasNumber" :number="props.index + 1"></line-number>
      <slot>
        <line-content :content="props.source.text"></line-content>
      </slot>
    </div>
  </template>

  <script lang="ts" setup>
  import LineContent from './line-content.vue'
  import LineNumber from './line-number.vue'
  const props = defineProps( { 
      /**
       * line-content attrs
       */
      index: { // index of current item
        type: Number
      },
      source:  {
        type: Object as PropType<any>,
        default: () => {},
      },
      /**
       * the line height
       */
      height: {
        type: Number,
        default: 20
      },
      comStyle: {
        type: Object as PropType<any>,
        default: () =>{}
      },
      hasNumber: {
        type: Boolean,
        default: false
      },
    }
  )
  const customStyle = computed(() => {
    const height =
          typeof props.height === 'number' ? props.height + 'px' : props.height
        return Object.assign(
          {
            lineHeight: height,
            height
          },
          props.comStyle
        )
  })
  </script>
  <style lang="scss" scoped>
  .line-wrapper {
    display: flex;
    color: #f1f1f1;
    line-height: 20px;
    height: 20px;
    white-space: pre;
    // word-break: break-all;
    box-sizing: border-box;
    padding-left: 16px;
  
    &:hover {
      background-color: #444;
    }
  
    .line-number {
      min-width: 40px;
      text-align: right;
      color: #666;
      padding-right: 10px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  }
  </style>