<template>
  <div class="navBlock">
    <div class="container">
      <div
        class="d-flex justify-content-between align-items-center py-1 py-md-3"
      >
        <div class="navBlock--logo pointer">
          <img src="~/assets/img/svg/logo.svg" alt="" />
        </div>
        <div class="d-flex align-items-center">
          <div
            v-show="!isOpenTool"
            class="mr-6 navBlock--searchInput d-sm-block"
          >
            <SearchInput />
          </div>
          <div class="navBlock--tools">
            <div
              :class="[
                'navBlock--tool',
                { 'd-flex align-items-center': isOpenTool },
              ]"
            >
              <b-img
                class="img-contain"
                width="32"
                height="32"
                :src="
                  user && user.picture
                    ? user.picture
                    : 'https://icon-library.com/images/anonymous-person-icon/anonymous-person-icon-18.jpg'
                "
                rounded="circle"
                alt=""
              ></b-img>
            </div>
            <div
              :class="[
                'navBlock--tool',
                { 'd-flex align-items-center': isOpenTool },
              ]"
            >
              <img src="~/assets/img/svg/notification_icon.svg" alt="" />
            </div>
            <div
              :class="[
                'navBlock--tool',
                { 'd-flex align-items-center': isOpenTool },
              ]"
            >
              <img src="~/assets/img/svg/calender_icon.svg" alt="" />
            </div>
            <div
              class="navBlock--toolCollect"
              @click="isOpenTool = !isOpenTool"
            >
              <img
                v-show="!isOpenTool"
                src="~/assets/img/svg/tools_collect.svg"
                alt=""
              />
              <img
                v-show="isOpenTool"
                src="~/assets/img/svg/tools_collect_close.svg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <b-navbar type="dark" variant="dark">
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
              <div style="width: 380px">
                <div class="d-flex justify-content-around p-3">
                  <span
                    style="cursor: pointer; white-space: nowrap"
                    :class="{
                      'font-weight-bold': notificationTab.active === index,
                    }"
                    v-for="(item, index) in notificationTab.tabs"
                    :key="index"
                    @click="notificationTab.active = index"
                    >{{ item }}</span
                  >
                </div>
                <div v-show="notificationTab.active === 0">
                  <div
                    v-for="(item, index) in notificationNotice"
                    :key="item.pid"
                    class="pl-2 pr-2"
                  >
                    <NotificationNotice :item="item" />
                    <hr v-show="notificationNotice.length !== index + 1" />
                  </div>
                </div>
                <div v-show="notificationTab.active === 1">
                  <div
                    v-for="(item, index) in notificationApply"
                    :key="item.pid"
                    class="pl-2 pr-2"
                  >
                    <NotificationApply :item="item" />
                    <hr v-show="notificationApply.length !== index + 1" />
                  </div>
                </div>
              </div>
            </b-nav-item-dropdown>
            <div class="text-white" style="cursor: pointer" @click="logout">
              登出
            </div>
          </div>
          <router-link to="/login" v-else>登入</router-link>
        </div>
      </div>
    </b-navbar-nav>
  </b-navbar> -->
</template>

<script>
import { mapState } from "vuex";
import NotificationApply from "~/components/notification/NotificationApply";
import NotificationNotice from "~/components/notification/NotificationNotice";
import SearchInput from "~/components/common/SearchInput";
export default {
  components: {
    NotificationApply,
    NotificationNotice,
    SearchInput,
  },
  computed: {
    ...mapState(["user"]),
    notificationNotice() {
      return this.notificationInfo.data.filter(
        (item) => item.typeID !== 3 && item.typeID !== 4
      );
    },
    notificationApply() {
      return this.notificationInfo.data.filter(
        (item) => item.typeID === 3 || item.typeID === 4
      );
    },
  },
  data() {
    return {
      isOpenTool: false,
      notificationInfo: {
        isLoading: false,
        data: [],
      },
      notificationTab: {
        active: 0,
        tabs: ["個人通知", "申請通知"],
      },
    };
  },
  async mounted() {
    // 有登入才去撈通知
    if (this.user && this.user.pid) {
      await this.getNotification();
    }
  },
  methods: {
    async logout() {
      try {
        await this.$api.logout();
        window.location.href = "/login";
      } catch (err) {
        console.log(err);
      }
    },
    async getNotification() {
      try {
        this.notificationInfo.isLoading = true;
        const res = await this.$api.getNotification();
        this.notificationInfo.data = res;
      } catch (err) {
        console.log(err);
      } finally {
        this.notificationInfo.isLoading = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.navBlock {
  background: $Light;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  &--tools {
    display: flex;
  }

  &--toolCollect {
    display: none;
    @include md {
      cursor: pointer;
      display: flex;
      align-items: center;
    }
  }

  &--tool {
    padding-right: 24px;
    cursor: pointer;
    &:last-of-type {
      padding-right: 0px;
    }
    @include md {
      display: none;
    }
  }
  &--searchInput {
    width: 229px;
    max-width: 229px;
  }
  &--logo {
    img {
      @include md {
        height: 24px;
      }
    }
  }
}
</style>
