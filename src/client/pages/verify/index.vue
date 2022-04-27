<template>
  <div>
    <div v-if="step === 'start'">
      <div class="mb-2">google</div>
      <a class="btn btn-primary" href="/auth/verify/google">登入</a>
      <hr />
      <div>Email</div>
      <div class="mb-2">
        <input type="text" v-model="loginInfo.email" />
      </div>
      <div class="d-flex">
        <div class="btn btn-secondary mr-1" @click="step = 'start'">上一步</div>
        <div class="btn btn-primary" @click="verifyEmail">下一步</div>
      </div>
      <hr />
    </div>
    <div v-if="step === 'passwd'">
      <div>Passwd</div>
      <div class="mb-2">
        <input type="text" v-model="loginInfo.passwd" />
      </div>
      <div class="d-flex">
        <div class="btn btn-secondary mr-1" @click="step = 'start'">上一步</div>
        <div class="btn btn-primary" @click="verifyPasswd">登入</div>
      </div>
      <div @click="step = 'verifyForgetcode'">忘記密碼</div>
      <hr />
    </div>
    <div v-if="step === 'verifycode'">
      <div>verifycode</div>
      <div class="mb-2">
        <input type="text" v-model="loginInfo.verifycode" />
      </div>
      <div class="d-flex">
        <div class="btn btn-secondary mr-1" @click="step = 'start'">上一步</div>
        <div class="btn btn-primary" @click="enterVerifycode">下一步</div>
      </div>
      <hr />
    </div>
    <div v-if="step === 'verifyForgetcode'">
      <div>verifyForgetcode</div>
      <div class="mb-2">
        <input type="text" v-model="loginInfo.verifycode" />
      </div>
      <div class="d-flex">
        <div class="btn btn-secondary mr-1" @click="step = 'passwd'">上一步</div>
        <div class="btn btn-primary" @click="enterForgetVerifycode">下一步</div>
      </div>
      <hr />
    </div>
    <div v-if="step === 'setting'">
      <div>headshot</div>
      <input
        type="file"
        name="uploadBox"
        @change="uploadFile"
        accept="image/png, image/jpeg"
      />
      <div>passwd</div>
      <input type="text" v-model="loginInfo.passwd" />
      <div>passwdCheck</div>
      <input type="text" v-model="loginInfo.passwdCheck" />
      <div>nickname</div>
      <div class="mb-2">
        <input type="text" v-model="loginInfo.nickname" />
      </div>
      <div class="d-flex">
        <div class="btn btn-secondary mr-1" @click="step = 'start'">上一步</div>
        <div class="btn btn-primary" @click="signUp">註冊</div>
      </div>
    </div>
    <div v-if="step === 'settingPasswd'">
      <div>passwd</div>
      <input type="text" v-model="loginInfo.passwd" />
      <div>passwdCheck</div>
      <input type="text" v-model="loginInfo.passwdCheck" />
      <div class="d-flex">
        <div class="btn btn-primary" @click="signUp">註冊</div>
      </div>
    </div>
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
        verifycode: "",
        headshot: "",
      },
      step: "start",
    };
  },
  methods: {
    async enterVerifycode() {
      try {
        const { email, verifycode } = this.loginInfo;
        const res = await this.$api.enterVerifycode({
          email,
          verifycode,
        });
        if (res.type === "1") {
          this.step = "setting";
        }
        if (res.type === "2") {
          this.step = "verifycode";
        }
      } catch (err) {
        console.log(err);
      }
    },
     async enterForgetVerifycode() {
      try {
        const { email, verifycode } = this.loginInfo;
        const res = await this.$api.enterVerifycode({
          email,
          verifycode,
        });
        if (res.type === "1") {
          this.step = "setting";
        }
        if (res.type === "2") {
          this.step = "verifycode";
        }
      } catch (err) {
        console.log(err);
      }
    },
    async verifyEmail() {
      try {
        const { email } = this.loginInfo;
        const res = await this.$api.verifyEmail({
          email,
        });
        if (res.type === "1") {
          this.step = "setting";
        }
        if (res.type === "2") {
          this.step = "verifycode";
        }
        if (res.type === "3") {
          this.step = "passwd";
        }
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
          console.log(res);
          window.location.href = "/create";
        }
      } catch (err) {
        console.log(err);
      }
    },
    uploadFile(event) {
      this.loginInfo.headshot = event.target.files[0];
    },
    async signUp() {
      try {
        const { email, passwd, nickname ,headshot} = this.loginInfo;
        const { url } = await this.$api.uploadFile(headshot);
        const res = await this.$api.signUp({
          email,
          passwd,
          nickname,
          url,
        });
        const { type } = res;
        if (type === "1") {
          window.location.href = "/";
        }
      } catch (err) {
        console.log(err);
      }
    },
    async logout() {
      try {
        await this.$api.logout();
        window.location.href = "/verify";
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style></style>
