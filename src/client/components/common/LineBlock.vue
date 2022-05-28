<template>
  <div class="lineBlock">
    <div class="lineBlock--line"></div>
    <div v-if="text" :class="['lineBlock--text', textBg, textPos]">
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "",
    },
    textBg: {
      type: String,
      default: "",
    },
    textPos: {
      type: String,
      default: "", // left or right
    },
  },
};
</script>
