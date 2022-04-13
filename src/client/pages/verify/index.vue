<template>
  <div>
    <div @click="step = 'start'">----back</div>
    <div v-if="step === 'start'">
      <div>google</div>
      <a href="/auth/verify/google">auth</a>
      <hr />
      <div>verifyEmail</div>
      <input type="text" v-model="loginInfo.email" />
      <div @click="verifyEmail">verifyEmail</div>
      <hr />
    </div>
    <div v-if="step === 'login'">
      <div>verifyPasswd</div>
      <input type="text" v-model="loginInfo.passwd" />
      <div @click="verifyPasswd">verifyPasswd</div>
      <hr />
    </div>
    <div v-if="step === 'signin'">
      <div>passwd</div>
      <input type="text" v-model="loginInfo.passwd" />
      <div>passwdCheck</div>
      <input type="text" v-model="loginInfo.passwdCheck" />
      <div>nickname</div>
      <input type="text" v-model="loginInfo.nickname" />
      <div @click="signUp">signUp</div>
    </div>
    <div @click="logout">登出</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginInfo: {
        email: "jjsoftdevelop@gmail.com",
        passwd: "jj04050406",
        passwdCheck: "jj04050406",
        nickname: "開發測試",
      },
      step: "start",
    };
  },
  methods: {
    async verifyEmail() {
      try {
        const { email } = this.loginInfo;
        const res = await this.$api.verifyEmail({
          email,
        });
        this.step = res.nextStep;
      } catch (err) {
        console.log(err);
      }
    },
    async verifyPasswd() {
      try {
        const { email, passwd } = this.loginInfo;
        const res = await this.$api.verifyPasswd({
          email,
          passwd,
        });
        if (res.type === "2") {
          this.$router.push("/");
        }
      } catch (err) {
        console.log(err);
      }
    },
    async signUp() {
      try {
        const { email, passwd, nickname } = this.loginInfo;
        const res = await this.$api.signUp({
          email,
          passwd,
          nickname,
        });
      } catch (err) {
        console.log(err);
      }
    },
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

<style></style>
