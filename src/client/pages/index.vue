<template>
  <div>
    <NotOpen />
  </div>
</template>
<script>
import NotOpen from "@/components/NotOpen";

export default {
  components: {
    NotOpen,
  },
  async mounted() {
    this.$router.push("/home");
  },
};
</script>
