<template>
  <div>
    <div>發信測試</div>
    <div class="d-flex">
      <label for="mailto">
        <div>收件者</div>
        <input id="mailto" v-model="mailData.mailto" type="text" />
        <div>
          <span
            class="pointer text-primary"
            @click="mailData.mailto = 'a10010134@gmail.com'"
            >a10010134@gmail.com</span
          ><br />
          <span
            class="pointer text-primary"
            @click="mailData.mailto = 'jassica4060@gmail.com'"
            >jassica4060@gmail.com</span
          >
        </div>
      </label>
      <label for="mailTitle">
        <div>標題</div>
        <input id="mailTitle" v-model="mailData.mailTitle" type="text" />
      </label>
      <label for="mailContent">
        <div>內容</div>
        <input id="mailContent" v-model="mailData.mailContent" type="text" />
      </label>
    </div>
    <b-button @click="sendEmail">發信</b-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mailData: {
        mailto: "",
        mailTitle: "測試信",
        mailContent: "這是一封測試信",
      },
    };
  },
  methods: {
    async sendEmail() {
      try {
        const { mailto, mailTitle, mailContent } = this.mailData;
        const res = await this.$api.sendEmail({
          mailto,
          mailTitle,
          mailContent,
        });
        console.log(res);
        this.showToast("發送成功", "信件已寄出");
      } catch (err) {
        this.showToast("發送失敗", `錯誤訊息${err}`);
      }
    },
    showToast(title = "", content = "") {
      this.$bvToast.toast(content, {
        title,
        autoHideDelay: 5000,
        appendToast: true,
      });
    },
  },
};
</script>

<style>
</style>