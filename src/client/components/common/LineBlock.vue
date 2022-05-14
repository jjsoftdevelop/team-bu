<template>
  <div class="lineBlock">
    <div class="lineBlock--line"></div>
    <div v-if="text" class="lineBlock--text">{{ text }}</div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "",
    },
  },
};
</script>
