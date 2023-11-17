<template>
    <div class="line-content">
      <span
        :class="[
          {
            'log-bold': props.content.bold,
            'log-underline': props.content.underline,
            'log-italic': props.content.italic
          },
          props.content.foreground ? 'log-fore-' + props.content.foreground : '',
          props.content.background ? 'log-back-' + props.content.background : ''
        ]"
        >{{ props.content.text }}</span
      >
    </div>
  </template>
  <script lang="ts" setup>
  const props = defineProps({
     /**
     * log text content
     */
    content: {
      type: Object as PropType<any>,
      default: () => {},
    },
  })
  
  </script>
  
  <style lang="scss" scoped>
  .line-content {
    span{
      display: flex
    }
    .log-bold {
      font-weight: bold;
    }
  
    .log-underline {
      text-decoration: underline;
    }
  
    .log-italic {
      font-style: italic;
    }
    .log-fore-red {
      color: $log-view-bright-red;
  
      &.log-underline {
        text-decoration-color:  $log-view-red;
      }
    }
  
    .log-fore-bright-red {
      color: $log-view-bright-red;
  
      &.log-underline {
        text-decoration-color: $log-view-bright-red;
      }
    }
  
    .log-back-red {
      background: $log-view-red;
    }
  
    .log-back-bright-red {
      background: $log-view-bright-red;
    }
  }
  </style>