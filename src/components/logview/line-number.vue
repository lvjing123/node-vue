<template>
  <div class="line-number" :class="props.className">{{ props.number }}</div>
</template>

<script lang="ts" setup>
  const props = defineProps({
     /**
     * log text content
     */
    number: {
      type: Number,
      default: 0,
    },
    className: {
      type: Array as PropType<any>,
      default: () => [],
    },
  })  
</script>