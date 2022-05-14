<template>
  <form
    @submit.prevent="
      () => {
        $emit('verifycode');
      }
    "
  >
    <div class="mb-6">
      <div class="h3 text-info font-weight-bold mb-6">驗證帳戶</div>
      <div class="text-info mb-2">輸入我們剛傳送到以下電子郵件的代碼：</div>
      <div class="text-info font-weight-bold">{{ email }}</div>
      <input
        style="opacity: 0"
        ref="verifycode"
        type="text"
        placeholder="驗證碼"
        v-model="code"
        maxlength="6"
        @change="
          () => {
            $emit('enterVerifycode', code);
          }
        "
      />
    </div>
    <div class="mb-6" style="height: 88px">
      <div class="d-flex justify-content-between">
        <div class="codeField" @click="focusVerifycode">
          {{ code.substr(0, 1) }}
        </div>
        <div class="codeField" @click="focusVerifycode">
          {{ code.substr(1, 1) }}
        </div>
        <div class="codeField" @click="focusVerifycode">
          {{ code.substr(2, 1) }}
        </div>
        <div class="codeField" @click="focusVerifycode">
          {{ code.substr(3, 1) }}
        </div>
        <div class="codeField" @click="focusVerifycode">
          {{ code.substr(4, 1) }}
        </div>
        <div class="codeField" @click="focusVerifycode">
          {{ code.substr(5, 1) }}
        </div>
      </div>
      <div v-if="!isCodeSuccess" class="mt-2 text-xs text-danger">
        驗證碼有誤!
      </div>
    </div>
    <div class="d-flex justify-content-between mb-6">
      <span
        ><span class="text-grey pr-1">沒收到信請點擊</span
        ><a
          href="#"
          class="text-grey-300"
          @click="
            () => {
              $emit('sendVerifycode');
            }
          "
          >再寄一次</a
        ></span
      >
      <span class="text-info">還有2:00可點擊</span>
    </div>
    <div class="d-flex justify-content-end">
      <div
        class="btn-m btn-light rounded-pill pointer mr-4"
        @click="
          () => {
            $emit('handleStep', 'start');
          }
        "
      >
        上一步
      </div>
      <b-button
        :disabled="code.length !== 6"
        :class="['btn-m', { 'btn-disabled': code.length !== 6 }]"
        type="submit"
        variant="success"
        pill
        >繼續</b-button
      >
    </div>
  </form>
</template>

<script>
export default {
  props: {
    email: {
      type: String,
      default: "",
    },
    isCodeSuccess: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      code: "",
    };
  },
  mounted() {
    this.focusVerifycode();
  },
  methods: {
    focusVerifycode() {
      this.$refs.verifycode.focus();
    },
  },
};
</script>

<style scoped lang="scss">
.codeField {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 64px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  color: #333333;
  font-weight: bold;
}
</style>
