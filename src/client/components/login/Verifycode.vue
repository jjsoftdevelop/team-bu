<template>
  <div>
    <div>系統已寄送驗證信至以下信箱，請將收到驗證碼填入以下欄位驗證</div>
    <div class="text-blue">若沒收到信請點此</div>
    <div class="d-flex">
      <div>{{ email }}</div>
      <div
        class="btn btn-secondary"
        @click="
          () => {
            $emit('sendVerifycode');
          }
        "
      >
        再寄一次
      </div>
    </div>
    <div class="d-flex flex-column">
      <div>
        <input
          type="text"
          placeholder="驗證碼"
          v-model="code"
          @change="
            () => {
              $emit('enterVerifycode', code);
            }
          "
        />
      </div>
    </div>
    <div
      class="btn btn-secondary"
      @click="
        () => {
          $emit('verifycode');
        }
      "
    >
      送出
    </div>
  </div>
</template>

<script>
export default {
  props: {
    email: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      code: "",
    };
  },
};
</script>

<style></style>
