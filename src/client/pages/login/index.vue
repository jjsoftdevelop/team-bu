<template>
  <div
    class="loginBlock position-relative d-flex justify-content-center align-items-center"
  >
    <div class="loginBlock--mask"></div>
    <div class="loginBlock--wrap">
      <div>
        <img class="mb-8" src="~/assets/img/logo-medium.png" alt="" />
        <div>最新潮的運動社群數據記錄軟體</div>
      </div>
      <div
        class="panel normal-border-radius"
        style="width: 440px; height: 542px"
      >
        <!-- 登入表單 -->
        <Login
          v-if="step === 'start'"
          @enterEmail="enterEmail"
          @verifyEmail="verifyEmail"
        />
        <!-- 確認驗證碼 -->
        <Verifycode
          v-if="step === 'verifycode'"
          :email="loginInfo.email"
          :isCodeSuccess="isCodeSuccess"
          @enterVerifycode="enterVerifycode"
          @sendVerifycode="sendVerifycode"
          @verifycode="verifycode"
          @handleStep="handleStep"
        />
        <!-- 設定帳密&暱稱 -->
        <SettingInfo
          v-if="step === 'setting'"
          @enterPasswd="enterPasswd"
          @enterNickname="enterNickname"
          @signUp="signUp"
        />
        <!-- 確認密碼 -->
        <VerifyPasswd
          v-if="step === 'verifyPasswd'"
          @enterVerifycode="enterVerifycode"
          @enterPasswd="enterPasswd"
          @verifyPasswd="verifyPasswd"
          @sendVerifycode="sendVerifycode"
          @verifycode="verifycode"
          @handleForgetPasswd="handleForgetPasswd"
          @handleStep="handleStep"
          :email="loginInfo.email"
          :forgetPasswd="forgetPasswd"
          :isPasswdSuccess="isPasswdSuccess"
          :pic="loginInfo.pic"
          :isCodeSuccess="isCodeSuccess"
        />
        <!-- 忘記密碼設定密碼-->
        <SettingPasswd
          v-if="step === 'settingPasswd'"
          @enterPasswd="enterPasswd"
          @settingPasswd="settingPasswd"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Login from "~/components/login/Login";
import Verifycode from "~/components/login/Verifycode";
import SettingInfo from "~/components/login/SettingInfo";
import VerifyPasswd from "~/components/login/VerifyPasswd";
import SettingPasswd from "~/components/login/SettingPasswd";

export default {
  layout: "empty",
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
        pic: "",
      },
      isPasswdSuccess: true,
      isCodeSuccess: true,
    };
  },
  methods: {
    handleStep(step) {
      this.isPasswdSuccess = true;
      this.isCodeSuccess = true;
      this.step = step;
    },
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
          this.loginInfo.pic = res.pic;
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
          this.isCodeSuccess = true;
        } else if (type === "2" && !this.forgetPasswd) {
          this.step = "verifycode";
          this.isCodeSuccess = false;
        } else if (type === "1" && this.forgetPasswd) {
          this.step = "settingPasswd";
          this.isCodeSuccess = true;
        }
      } catch (err) {
        this.isCodeSuccess = false;
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
          this.isPasswdSuccess = true;
          window.location.href = "/home";
        } else {
          this.isPasswdSuccess = false;
        }
      } catch (err) {
        this.isPasswdSuccess = false;
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
          window.location.href = "/home";
        }
      } catch (err) {
        console.log(err);
      }
    },
    async settingPasswd(value) {
      try {
        this.loginInfo.passwd = value;
        const { passwd, email, verifycode } = this.loginInfo;
        const res = await this.$api.settingPasswd({
          passwd,
          email,
          verifycode,
        });
        const { type } = res;
        if (type === "1") {
          window.location.href = "/home";
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.loginBlock {
  background-image: url("~/assets/img/login_main.png");
  background-repeat: no-repeat;
  background-size: cover;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  &--mask {
    background: rgba(35, 35, 35, 0.481);
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  &--wrap {
    width: 50%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 20;
  }
}
</style>
