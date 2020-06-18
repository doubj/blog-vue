<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>
