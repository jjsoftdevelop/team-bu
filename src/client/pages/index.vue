<template>
  <div>
    <NotOpen />
    <div @click="logout">登出</div>
  </div>
</template>
<script>
import NotOpen from "@/components/NotOpen";

export default {
  components: {
    NotOpen,
  },
  mounted() {
    const isLogin = this.$cookies.get("isLogin");
    console.log(isLogin);
  },
  methods: {
    async logout() {
      try {
        await this.$api.logout();
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
