<template>
  <div
    class="loginBlock position-relative d-flex justify-content-center align-items-start align-items-md-center"
  >
    <div class="loginBlock--mask"></div>
    <div class="loginBlock--wrap flex-column flex-md-row">
      <div class="loginBlock--logo">
        <img
          class="mb-md-8 py-2 p-md-0"
          src="~/assets/img/logo-medium.png"
          alt=""
        />
        <div class="d-none d-md-block">最新潮的運動社群數據記錄軟體</div>
      </div>
      <div class="panel normal-border-radius loginBlock--panel" style="">
        <!-- 登入表單 -->
        <Login
          v-if="step === STEP_INFO.START"
          @enterEmail="enterEmail"
          @verifyEmail="verifyEmail"
        />
        <!-- 確認驗證碼 -->
        <Verifycode
          v-if="step === STEP_INFO.VERIFYCODE"
          :email="loginInfo.email"
          :codePassInfo="codePassInfo"
          @enterVerifycode="enterVerifycode"
          @sendVerifycode="sendVerifycode"
          @verifycode="verifycode"
          @handleStep="handleStep"
        />
        <!-- 設定帳密&暱稱 -->
        <SettingInfo
          v-if="step === STEP_INFO.SETTING"
          @enterPasswd="enterPasswd"
          @enterNickname="enterNickname"
          @signUp="signUp"
        />
        <!-- 確認密碼 -->
        <VerifyPasswd
          v-if="step === STEP_INFO.VERIFYPASSWD"
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
          :codePassInfo="codePassInfo"
        />
        <!-- 忘記密碼設定密碼-->
        <SettingPasswd
          v-if="step === STEP_INFO.SETTINGPASSWD"
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
      codePassInfo: {
        isCodeSuccess: true,
        alertMsg: "",
      },
      STEP_INFO: {
        START: "start",
        VERIFYCODE: "verifycode",
        SETTING: "setting",
        VERIFYPASSWD: "verifyPasswd",
        SETTINGPASSWD: "settingPasswd",
      },
    };
  },
  methods: {
    handleStep(step) {
      this.isPasswdSuccess = true;
      this.codePassInfo.isCodeSuccess = true;
      this.codePassInfo.alertMsg = "";
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
        this.codePassInfo.alertMsg = "";
        this.codePassInfo.isCodeSuccess = true;
      } catch (err) {
        this.codePassInfo.alertMsg = "短時間內多次發出驗證碼，請稍後在試！";
        this.codePassInfo.isCodeSuccess = false;
        console.log(err);
      }
    },
    async sendVerifycode() {
      try {
        const { email } = this.loginInfo;
        await this.$api.sendVerifycode({ email });
        this.codePassInfo.alertMsg = "";
        this.codePassInfo.isCodeSuccess = true;
      } catch (err) {
        this.codePassInfo.alertMsg = "短時間內多次發出驗證碼，請稍後在試！";
        this.codePassInfo.isCodeSuccess = false;
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
          this.codePassInfo.isCodeSuccess = true;
        } else if (type === "1" && this.forgetPasswd) {
          this.step = "settingPasswd";
          this.codePassInfo.isCodeSuccess = true;
        } else if (
          (type === "0" && !this.forgetPasswd) ||
          (type === "0" && this.forgetPasswd)
        ) {
          this.step = "verifycode";
          this.codePassInfo.alertMsg = "驗證碼錯誤!";
          this.codePassInfo.isCodeSuccess = false;
        } else if (
          (type === "2" && !this.forgetPasswd) ||
          (type === "2" && this.forgetPasswd)
        ) {
          this.step = "verifycode";
          this.codePassInfo.alertMsg = "超過驗證時間!";
          this.codePassInfo.isCodeSuccess = false;
        }
      } catch (err) {
        this.codePassInfo.isCodeSuccess = false;
        this.codePassInfo.alertMsg = "驗證失敗!";
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
