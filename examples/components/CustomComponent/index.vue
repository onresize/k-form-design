<!--
 * @Description:自定义控件
 -->
<template>
  <div>
    <input
      type="text"
      :disabled="disabled"
      :value="value"
      @input="handleChange"
    />
  </div>
</template>
<script>
export default {
  name: "cc",
  props: ["record", "value", "disabled", "dynamicData"],
  methods: {
    handleChange(e) {
      // 使用 onChange 事件修改值
      this.$emit("change", e.target.value);
    }
  },
  created() {
    console.log(this.$attrs)
  }
};
</script>
