<template>
  <div class="d-flex flex-column">
     <a class="btn btn-primary" href="/auth/verify/google">Google 登入</a>
    <div>或</div>
    <div>
      <label class="d-block" for="">請輸入您的信箱</label>
      <input type="text" v-model="email" @change="enterEmail" />
      <div class="btn btn-secondary" @click="verifyEmail">送出</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
    };
  },
  methods: {
    enterEmail() {
      this.$emit("enterEmail", this.email);
    },
    verifyEmail() {
      this.$emit("verifyEmail");
    },
  },
};
</script>

<style></style>
