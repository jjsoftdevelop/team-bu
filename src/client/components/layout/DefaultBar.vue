<template>
  <b-navbar type="dark" variant="dark">
    <b-navbar-nav class="w-100">
      <div class="d-flex justify-content-between w-100">
        <div class="text-white">Team-Bu</div>
        <div>
          <router-link to="/verify" v-if="!isLogin">登入</router-link>
          <div class="d-flex align-items-center" v-else>
            <b-img
              class="mr-2"
              width="30"
              height="30"
              :src="user.picture"
              rounded
              style="object-fit: contain"
              alt=""
            ></b-img>
            <div class="text-white mr-2">{{ user.nickname }}</div>
            <div class="text-white" style="cursor: pointer" @click="logout">
              登出
            </div>
          </div>
        </div>
      </div>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  methods: {
    async logout() {
      try {
        await this.$api.logout();
        window.location.href = "/verify";
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style></style>
