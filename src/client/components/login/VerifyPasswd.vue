<template>
  <div>
    <div v-if="!forgetPasswd">
      <div class="h3 text-info font-weight-bold mb-6">輸入您的密碼</div>
      <div class="d-flex align-items-center mb-6">
        <b-img
          class="mr-2 img-cover"
          :src="pic"
          width="55"
          height="55"
          rounded="circle"
        ></b-img>
        <div>
          <div class="text-s text-dark">個人帳戶</div>
          <div class="text-xs text-grey-300">{{ email }}</div>
        </div>
      </div>
      <form
        @submit.prevent="
          () => {
            $emit('verifyPasswd');
          }
        "
      >
        <div class="pb-6">
          <label class="d-block text-info" for="passwd">請輸入您的密碼</label>
          <div class="position-relative">
            <b-form-input
              style="max-height: 62px"
              id="passwd"
              v-model="passwd"
              placeholder="請輸入密碼"
              class="text-success"
              :state="isPasswdSuccess"
              :type="!isShowPasswd ? 'password' : 'text'"
              @change="
                () => {
                  $emit('enterPasswd', passwd);
                }
              "
            ></b-form-input>
            <svg
              @click="isShowPasswd = !isShowPasswd"
              v-if="!isShowPasswd"
              class="position-absolute pointer"
              style="top: 50%; right: 10px; transform: translateY(-50%)"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M18.4765 11.2854C18.8348 11.0776 19.2938 11.1997 19.5015 11.558L21.6484 15.2612C21.8561 15.6195 21.734 16.0784 21.3757 16.2862C21.0174 16.4939 20.5584 16.3718 20.3507 16.0135L18.2038 12.3104C17.9961 11.952 18.1182 11.4931 18.4765 11.2854Z"
                fill="#21B39A"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M14.3261 13.2581C14.734 13.1862 15.1229 13.4586 15.1948 13.8666L15.8604 17.6447C15.9323 18.0526 15.6599 18.4416 15.2519 18.5135C14.844 18.5853 14.455 18.3129 14.3832 17.905L13.7176 14.1268C13.6457 13.7189 13.9181 13.33 14.3261 13.2581Z"
                fill="#21B39A"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.66373 13.2488C10.0717 13.3204 10.3443 13.7093 10.2726 14.1172L9.60697 17.9047C9.53527 18.3127 9.14643 18.5853 8.73847 18.5136C8.33051 18.4419 8.05791 18.0531 8.12961 17.6451L8.79523 13.8576C8.86693 13.4497 9.25577 13.1771 9.66373 13.2488Z"
                fill="#21B39A"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.51198 11.2845C5.87078 11.4915 5.99387 11.9502 5.7869 12.309L3.64003 16.0308C3.43306 16.3896 2.97442 16.5127 2.61562 16.3057C2.25681 16.0988 2.13373 15.6401 2.34069 15.2813L4.48757 11.5595C4.69453 11.2007 5.15318 11.0776 5.51198 11.2845Z"
                fill="#21B39A"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.52877 9.25104C2.85101 8.99078 3.32322 9.04101 3.58348 9.36325C5.07563 11.2107 7.7694 13.5001 12 13.5001C16.2306 13.5001 18.9244 11.2107 20.4166 9.36325C20.6768 9.04101 21.149 8.99078 21.4713 9.25104C21.7935 9.51131 21.8437 9.98352 21.5835 10.3058C19.9256 12.3583 16.8444 15.0001 12 15.0001C7.15565 15.0001 4.07442 12.3583 2.41657 10.3058C2.1563 9.98352 2.20654 9.51131 2.52877 9.25104Z"
                fill="#21B39A"
              />
            </svg>
            <svg
              @click="isShowPasswd = !isShowPasswd"
              v-else
              class="position-absolute pointer"
              style="top: 50%; right: 10px; transform: translateY(-50%)"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.40717 8.09467C5.19504 6.3068 8.00057 4.5 12 4.5C15.9994 4.5 18.805 6.3068 20.5928 8.09467C21.4846 8.98644 22.1276 9.87691 22.5487 10.5457C22.7597 10.8807 22.916 11.1618 23.0208 11.362C23.0733 11.4621 23.113 11.5422 23.1402 11.5988C23.1539 11.6272 23.1644 11.6497 23.1719 11.6659L23.1809 11.6855L23.1837 11.6917L23.1847 11.6938L23.185 11.6947C23.1852 11.6951 23.1854 11.6954 22.5 12C23.1854 12.3046 23.1852 12.3049 23.185 12.3053L23.1847 12.3062L23.1837 12.3083L23.1809 12.3145L23.1719 12.3341C23.1644 12.3503 23.1539 12.3728 23.1402 12.4012C23.113 12.4578 23.0733 12.5379 23.0208 12.638C22.916 12.8382 22.7597 13.1193 22.5487 13.4543C22.1276 14.1231 21.4846 15.0136 20.5928 15.9053C18.805 17.6932 15.9994 19.5 12 19.5C8.00057 19.5 5.19504 17.6932 3.40717 15.9053C2.5154 15.0136 1.87235 14.1231 1.45126 13.4543C1.24035 13.1193 1.08405 12.8382 0.979181 12.638C0.92672 12.5379 0.887047 12.4578 0.859771 12.4012C0.846131 12.3728 0.835583 12.3503 0.82808 12.3341L0.819098 12.3145L0.816307 12.3083L0.815334 12.3062L0.814952 12.3053C0.814791 12.3049 0.814641 12.3046 1.5 12C0.814641 11.6954 0.814791 11.6951 0.814952 11.6947L0.815334 11.6938L0.816307 11.6917L0.819098 11.6855L0.82808 11.6659C0.835583 11.6497 0.846131 11.6272 0.859771 11.5988C0.887047 11.5422 0.92672 11.4621 0.979181 11.362C1.08405 11.1618 1.24035 10.8807 1.45126 10.5457C1.87235 9.87691 2.5154 8.98644 3.40717 8.09467ZM1.5 12L0.814641 11.6954C0.728453 11.8893 0.728453 12.1107 0.814641 12.3046L1.5 12ZM2.33859 12C2.42682 12.1653 2.55353 12.3897 2.72061 12.6551C3.0964 13.2519 3.6721 14.0489 4.46783 14.8447C6.05496 16.4318 8.49943 18 12 18C15.5006 18 17.945 16.4318 19.5322 14.8447C20.3279 14.0489 20.9036 13.2519 21.2794 12.6551C21.4465 12.3897 21.5732 12.1653 21.6614 12C21.5732 11.8347 21.4465 11.6103 21.2794 11.3449C20.9036 10.7481 20.3279 9.95106 19.5322 9.15533C17.945 7.5682 15.5006 6 12 6C8.49943 6 6.05496 7.5682 4.46783 9.15533C3.6721 9.95106 3.0964 10.7481 2.72061 11.3449C2.55353 11.6103 2.42682 11.8347 2.33859 12ZM22.5 12L23.1854 12.3046C23.2715 12.1107 23.2715 11.8893 23.1854 11.6954L22.5 12Z"
                fill="#21B39A"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9ZM7.5 12C7.5 9.51472 9.51472 7.5 12 7.5C14.4853 7.5 16.5 9.51472 16.5 12C16.5 14.4853 14.4853 16.5 12 16.5C9.51472 16.5 7.5 14.4853 7.5 12Z"
                fill="#21B39A"
              />
            </svg>
          </div>
          <div v-if="!isPasswdSuccess" class="mt-2 text-xs text-danger">
            密碼有誤!
          </div>
        </div>
        <div class="d-flex justify-content-end">
          <b-button
            :disabled="passwd.length === 0"
            :class="['btn-m', { 'btn-disabled': passwd.length === 0 }]"
            type="submit"
            variant="success"
            pill
            >繼續</b-button
          >
        </div>
      </form>
      <LineBlock class="my-6" />
      <a
        href="#"
        class="d-block text-success mb-6 pointer"
        @click="getPasswdCode"
      >
        忘記密碼？
      </a>
      <a href="#" class="d-block text-success pointer">登入其他帳號</a>
      <div @click="getPasswdCode">忘記密碼請點我</div>
    </div>
    <Verifycode
      v-if="forgetPasswd"
      :email="email"
      :codePassInfo="codePassInfo"
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
      @handleStep="
        (step) => {
          $emit('handleStep', step);
        }
      "
    />
  </div>
</template>

<script>
import Verifycode from "~/components/login/Verifycode";
import LineBlock from "~/components/common/LineBlock";

export default {
  components: {
    Verifycode,
    LineBlock,
  },
  props: {
    pic: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    forgetPasswd: {
      type: Boolean,
      default: false,
    },
    isPasswdSuccess: {
      type: Boolean,
      default: true,
    },
    codePassInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      passwd: "",
      isSuccess: true,
      isShowPasswd: false,
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
