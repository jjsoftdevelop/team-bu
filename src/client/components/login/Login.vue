<template>
  <div class="d-flex flex-column">
    <div class="mb-6">
      <div class="text-grey">哈囉！歡迎回來</div>
      <div class="h3 text-info font-weight-bold mb-1">登入帳號</div>
      <div class="text-grey-700">如欲註冊請直接輸入信箱即可</div>
    </div>
    <div>
      <label class="d-block text-info" for="email">電子郵件地址</label>
      <form id="email" @submit.prevent="verifyEmail">
        <div class="pb-6" style="max-height: 62px">
          <b-form-input
            v-model="email"
            placeholder="XXXX@mail.com"
            class="text-success"
            :state="isSuccess"
            @change="enterEmail"
          ></b-form-input>
          <b-form-invalid-feedback>
            請輸入正確的Email格式
          </b-form-invalid-feedback>
        </div>
        <div class="d-flex justify-content-end">
          <b-button
            :disabled="email.length === 0"
            :class="['btn-m', { 'btn-disabled': email.length === 0 }]"
            type="submit"
            variant="success"
            pill
            >繼續</b-button
          >
        </div>
      </form>
    </div>
    <LineBlock text="或" class="my-6" />
    <a
      style="height: 56px"
      class="btn btn-m btn-light font-weight-bold d-flex align-items-center justify-content-center"
      href="/auth/verify/google"
      ><svg
        class="mr-1"
        width="25"
        height="24"
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M24.02 12.2729C24.02 11.422 23.9436 10.6038 23.8018 9.81836H12.5V14.4602H18.9582C18.68 15.9602 17.8345 17.2311 16.5636 18.082V21.0929H20.4418C22.7109 19.0038 24.02 15.9274 24.02 12.2729Z"
          fill="#4285F4"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12.499 24.0003C15.739 24.0003 18.4554 22.9257 20.4408 21.093L16.5627 18.0821C15.4881 18.8021 14.1136 19.2275 12.499 19.2275C9.37357 19.2275 6.72812 17.1166 5.78448 14.2803H1.77539V17.3894C3.74994 21.3112 7.80812 24.0003 12.499 24.0003Z"
          fill="#34A853"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5.78545 14.2799C5.54545 13.5599 5.40909 12.7908 5.40909 11.9999C5.40909 11.209 5.54545 10.4399 5.78545 9.71993V6.61084H1.77636C0.963636 8.23084 0.5 10.0636 0.5 11.9999C0.5 13.9363 0.963636 15.769 1.77636 17.389L5.78545 14.2799Z"
          fill="#FBBC05"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12.499 4.77273C14.2608 4.77273 15.8427 5.37818 17.0863 6.56727L20.5281 3.12545C18.4499 1.18909 15.7336 0 12.499 0C7.80812 0 3.74994 2.68909 1.77539 6.61091L5.78448 9.72C6.72812 6.88364 9.37357 4.77273 12.499 4.77273Z"
          fill="#EA4335"
        />
      </svg>
      快速使用 Google 登入</a
    >
  </div>
</template>

<script>
import LineBlock from "~/components/common/LineBlock";
export default {
  components: {
    LineBlock,
  },
  data() {
    return {
      email: "",
      isSuccess: true,
    };
  },
  methods: {
    enterEmail() {
      this.$emit("enterEmail", this.email);
    },
    verifyEmail() {
      const regex = /^([\w\.\-]){1,64}\@([\w\.\-]){1,64}$/;
      if (regex.test(this.email)) {
        this.isSuccess = true;
      } else {
        this.isSuccess = false;
        return;
      }
      this.$emit("verifyEmail");
    },
  },
};
</script>

<style></style>
