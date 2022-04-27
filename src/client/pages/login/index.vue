<template>
  <div class="d-flex justify-content-center align-items-center">
    <div class="col-4 p-4" style="background-color: #eee">
      <Login
        v-if="step === 'start'"
        @enterEmail="enterEmail"
        @verifyEmail="verifyEmail"
      />
      <Verifycode
        v-if="step === 'verifycode'"
        :email="loginInfo.email"
        @enterVerifycode="enterVerifycode"
        @sendVerifycode="sendVerifycode"
        @verifycode="verifycode"
      />
      <SettingInfo
        v-if="step === 'setting'"
        @enterPasswd="enterPasswd"
        @enterNickname="enterNickname"
        @signUp="signUp"
      />
      <VerifyPasswd
        v-if="step === 'verifyPasswd'"
        @enterVerifycode="enterVerifycode"
        @enterPasswd="enterPasswd"
        @verifyPasswd="verifyPasswd"
        @sendVerifycode="sendVerifycode"
        @verifycode="verifycode"
        @handleForgetPasswd="handleForgetPasswd"
        :email="loginInfo.email"
        :forgetPasswd="forgetPasswd"
      />
      <SettingPasswd
        v-if="step === 'settingPasswd'"
        @enterPasswd="enterPasswd"
        @settingPasswd="settingPasswd"
      />
    </div>
  </div>
</template>

<script>
import Login from "~/components/login/login";
import Verifycode from "~/components/login/Verifycode";
import SettingInfo from "~/components/login/SettingInfo";
import VerifyPasswd from "~/components/login/VerifyPasswd";
import SettingPasswd from "~/components/login/SettingPasswd";

export default {
  components: {
    Login,
    Verifycode,
    SettingInfo,
    VerifyPasswd,
    SettingPasswd,
  },
  data() {
    return {
      forgetPasswd: false,
      step: "start",
      loginInfo: {
        email: "",
        verifycode: "",
        passwd: "",
      },
    };
  },
  methods: {
    enterEmail(email) {
      this.loginInfo.email = email;
    },
    enterVerifycode(code) {
      this.loginInfo.verifycode = code;
    },
    enterPasswd(passwd) {
      this.loginInfo.passwd = passwd;
    },
    enterNickname(nickname) {
      this.loginInfo.nickname = nickname;
    },
    handleForgetPasswd(value) {
      this.forgetPasswd = value;
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
          this.step = "verifyPasswd";
        }
      } catch (err) {
        console.log(err);
      }
    },
    async sendVerifycode() {
      try {
        const { email } = this.loginInfo;
        await this.$api.sendVerifycode({ email });
      } catch (err) {
        console.log(err);
      }
    },
    async verifycode() {
      try {
        const { email, verifycode } = this.loginInfo;
        const { type } = await this.$api.enterVerifycode({
          email,
          verifycode,
        });
        if (type === "1" && !this.forgetPasswd) {
          this.step = "setting";
        } else if (type === "2" && !this.forgetPasswd) {
          this.step = "verifycode";
        } else if (type === "1" && this.forgetPasswd) {
          this.step = "settingPasswd";
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
          window.location.href = "/create";
        }
      } catch (err) {
        console.log(err);
      }
    },
    async signUp() {
      try {
        const { email, passwd, nickname } = this.loginInfo;
        // const { url } = await this.$api.uploadFile(headshot);
        const res = await this.$api.signUp({
          email,
          passwd,
          nickname,
        });
        const { type } = res;
        if (type === "1") {
          window.location.href = "/create";
        }
      } catch (err) {
        console.log(err);
      }
    },
    async settingPasswd(value) {
      try {
        this.loginInfo.passwd = value;
        const { passwd, email } = this.loginInfo;
        const res = await this.$api.settingPasswd({
          passwd,
          email,
        });
        const { type } = res;
        if (type === "1") {
          // this.step = "verifyPasswd";
          // this.forgetPasswd = false;
          window.location.href = "/create";
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style></style>
