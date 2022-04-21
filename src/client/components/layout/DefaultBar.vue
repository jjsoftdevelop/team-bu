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
              <b-dropdown-item
                v-for="item in joinNotificationInfo.data"
                :key="item.pid"
                href="#"
              >
                <div class="d-flex align-items-center">
                  <div>
                    <b-img
                      class="mr-2"
                      width="30"
                      height="30"
                      :src="item.picture"
                      rounded
                      style="object-fit: contain"
                      alt=""
                    ></b-img>
                  </div>
                  <div class="d-flex flex-column">
                    <div>{{ item.nickname }}</div>
                    <div>發送了 {{ item.name }} 的加入申請</div>
                  </div>
                </div>
              </b-dropdown-item>
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
export default {
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
        // 先取得 我創建的球隊
        let ownTeam = await this.$api.getOwnTeam();
        ownTeam = ownTeam.map((team) => team.pid);
        if (ownTeam.length === 0) return;
        // 如果有 再去撈是否有人要求加入球隊
        const teamID = ownTeam.toString();
        const res = await this.$api.getJoinNotification({ teamID });
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
