<template>
  <div>
    <div v-if="setPasswd">
      <div>設定一組密碼吧</div>
      <div>
        <div>新密碼</div>
        <input type="text" v-model="passwd" />
      </div>
      <div>
        <div>再輸入一次</div>
        <input type="text" v-model="passwdCheck" />
      </div>
      <div class="btn btn-secondary" @click="checkPasswd">確認</div>
    </div>
    <div v-else>
      <div>設定暱稱吧</div>
      <input
        type="text"
        v-model="nickname"
        @change="
          () => {
            $emit('enterNickname', nickname);
          }
        "
      />
      <div
        class="btn btn-secondary"
        @click="
          () => {
            $emit('signUp');
          }
        "
      >
        確認
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      setPasswd: true,
      passwd: "",
      passwdCheck: "",
      nickname: "",
    };
  },
  methods: {
    checkPasswd() {
      if (this.passwd === this.passwdCheck) {
        this.setPasswd = false;
        this.$emit("enterPasswd", this.passwd);
      }
    },
  },
};
</script>

<style></style>
