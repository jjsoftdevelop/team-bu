<template>
  <div>
    <div @click="getPasswdCode">忘記密碼請點我</div>
    <div v-if="!forgetPasswd">
      <div>請輸入密碼</div>
      <input
        type="text"
        v-model="passwd"
        @change="
          () => {
            $emit('enterPasswd', passwd);
          }
        "
      />
      <div
        class="btn btn-secondary"
        @click="
          () => {
            $emit('verifyPasswd');
          }
        "
      >
        確認
      </div>
    </div>
    <Verifycode
      v-if="forgetPasswd"
      :email="email"
      @enterVerifycode="
        (code) => {
          $emit('enterVerifycode', code);
        }
      "
      @sendVerifycode="
        () => {
          $emit('sendVerifycode');
        }
      "
      @verifycode="
        () => {
          $emit('verifycode');
        }
      "
    />
  </div>
</template>

<script>
import Verifycode from "~/components/login/Verifycode";
export default {
  components: {
    Verifycode,
  },
  props: {
    email: {
      type: String,
      default: "",
    },
    forgetPasswd: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      passwd: "",
    };
  },
  methods: {
    getPasswdCode() {
      this.$emit("handleForgetPasswd", true);
      this.$emit("sendVerifycode");
    },
  },
};
</script>

<style></style>
