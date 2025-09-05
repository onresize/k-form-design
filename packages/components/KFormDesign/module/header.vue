<!--
 * @Description: 头部
 -->
<template>
  <header class="header" v-text="title"></header>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "表单设计器"
    }
  }
};
</script>
