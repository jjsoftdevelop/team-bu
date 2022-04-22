<template>
  <b-navbar type="dark" variant="dark">
    <b-navbar-nav class="w-100">
      <div class="d-flex justify-content-between w-100">
        <div class="text-white">Team-Bu</div>
        <div>
          <div class="d-flex align-items-center" v-if="user && user.pid">
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
            <b-nav-item-dropdown text="通知" right>
              <div
                v-for="(item, index) in joinNotificationInfo.data"
                :key="item.pid"
                class="pl-2 pr-2"
                style="width: 280px"
              >
                <NotificationJoin :item="item" />
                <hr v-show="joinNotificationInfo.data.length !== index + 1" />
              </div>
            </b-nav-item-dropdown>
            <div class="text-white" style="cursor: pointer" @click="logout">
              登出
            </div>
          </div>
          <router-link to="/verify" v-else>登入</router-link>
        </div>
      </div>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import { mapState } from "vuex";
import NotificationJoin from "~/components/notification/NotificationJoin";
export default {
  components: {
    NotificationJoin,
  },
  computed: {
    ...mapState(["user"]),
  },
  data() {
    return {
      joinNotificationInfo: {
        isLoading: false,
        data: [],
      },
    };
  },
  async mounted() {
    // 有登入才去撈通知
    if (this.user && this.user.pid) {
      await this.getJoinNotification();
    }
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
    async getJoinNotification() {
      try {
        this.joinNotificationInfo.isLoading = true;
        const res = await this.$api.getJoinNotification();
        this.joinNotificationInfo.data = res;
      } catch (err) {
        console.log(err);
      } finally {
        this.joinNotificationInfo.isLoading = false;
      }
    },
  },
};
</script>

<style></style>
