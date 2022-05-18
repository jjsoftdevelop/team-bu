<template>
  <div v-if="user && user.pid" id="navBlock" class="navBlock">
    <div class="container">
      <div
        class="d-flex justify-content-between align-items-center py-1 py-md-3"
      >
        <router-link to="/home" class="navBlock--logo pointer">
          <img src="~/assets/img/svg/logo.svg" alt="" />
        </router-link>
        <div class="d-flex align-items-center">
          <div
            :class="[
              'mr-6 navBlock--searchInput d-md-block',
              { 'd-none': isOpenTool },
            ]"
          >
            <SearchInput />
          </div>
          <!-- 個人帳號 -->
          <div class="navBlock--tools">
            <div
              :class="[
                'navBlock--tool',
                { 'd-flex align-items-center': isOpenTool },
              ]"
            >
              <b-dropdown
                variant="link"
                toggle-class="text-decoration-none"
                no-caret
                offset="-168px"
              >
                <template #button-content>
                  <b-img
                    class="img-contain"
                    width="30"
                    height="30"
                    :src="
                      user && user.picture
                        ? user.picture
                        : require('~/assets/img/anonymous-person-icon-18.jpg')
                    "
                    rounded="circle"
                    alt=""
                  ></b-img>
                </template>
                <b-dropdown-text>
                  <div>
                    <Account
                      :user="user"
                      :myJoinSport="myJoinSport"
                      :myRoleOnTeams="myRoleOnTeams"
                      @logout="logout"
                    />
                  </div>
                </b-dropdown-text>
              </b-dropdown>
            </div>
            <!-- 通知相關 -->
            <div
              :class="[
                'navBlock--tool',
                { 'd-flex align-items-center': isOpenTool },
              ]"
            >
              <b-dropdown
                variant="link"
                toggle-class="text-decoration-none"
                no-caret
                offset="-224px"
              >
                <template #button-content>
                  <img
                    width="30"
                    height="30"
                    src="~/assets/img/svg/notification_icon.svg"
                    alt=""
                  />
                </template>
                <b-dropdown-text>
                  <div>
                    <div class="d-flex justify-content-around p-3">
                      <span
                        :class="[
                          'btn btn-switch btn-switch-m rounded-pill pointer font-weight-bold text-xs',
                          {
                            active: notificationTab.active === index,
                          },
                        ]"
                        v-for="(item, index) in notificationTab.tabs"
                        :key="index"
                        @click="notificationTab.active = index"
                        >{{ item }}</span
                      >
                    </div>
                    <LineBlock />
                    <div class="py-3">
                      <div v-show="notificationTab.active === 0">
                        <div
                          v-for="(item, index) in notificationNotice"
                          :key="item.pid"
                          class="pl-2 pr-2"
                        >
                          <NotificationNotice :item="item" />
                          <hr
                            v-show="notificationNotice.length !== index + 1"
                          />
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
                  </div>
                </b-dropdown-text>
              </b-dropdown>
            </div>
            <!-- 行事曆相關 -->
            <div
              :class="[
                'navBlock--tool',
                { 'd-flex align-items-center': isOpenTool },
              ]"
            >
              <b-dropdown
                variant="link"
                toggle-class="text-decoration-none"
                no-caret
                offset="-280px"
              >
                <template #button-content>
                  <img
                    width="30"
                    height="30"
                    src="~/assets/img/svg/calender_icon.svg"
                    alt=""
                  />
                </template>
                <b-dropdown-text><EventCalendar /></b-dropdown-text>
              </b-dropdown>
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
    <div></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import NotificationApply from "~/components/notification/NotificationApply";
import NotificationNotice from "~/components/notification/NotificationNotice";
import SearchInput from "~/components/common/SearchInput";
import Account from "~/components/navbar/Account";
import LineBlock from "~/components/common/LineBlock";
import EventCalendar from "~/components/navbar/EventCalendar";

export default {
  components: {
    NotificationApply,
    NotificationNotice,
    SearchInput,
    Account,
    LineBlock,
    EventCalendar,
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
      myJoinSport: [],
      myRoleOnTeams: {},
    };
  },
  async mounted() {
    // 有登入才去撈通知
    if (this.user && this.user.pid) {
      await this.getNotification();
      await this.getMyJoinSport();
      await this.getMyRoleOnTeams();
    }
  },
  beforeMount() {
    setTimeout(() => {
      window.addEventListener("scroll", this.handleScroll);
    }, 1000);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll(e) {
      const navBlock = document.getElementById("navBlock");
      const body = document.body;
      const isMobile = window.screen && window.screen.width < 992;
      if (navBlock) {
        if (e.target.scrollTop > 10 || window.scrollY > 10) {
          navBlock.style.position = "fixed";
          if (!isMobile) {
            body.style.paddingTop = "100px";
          } else {
            body.style.paddingTop = "86px";
          }
        } else {
          navBlock.style.position = "relative";
          body.style.paddingTop = "0px";
        }
      }
    },
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
    async getMyJoinSport() {
      try {
        const res = await this.$api.getMyJoinSport();
        this.myJoinSport = res;
      } catch (err) {
        console.log(err);
      }
    },
    async getMyRoleOnTeams() {
      try {
        const res = await this.$api.getMyRoleOnTeams();
        this.myRoleOnTeams = res;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.navBlock {
  position: relative;
  top: 0;
  left: 0;
  background: $Light;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  width: 100%;
  z-index: 99;
  margin-bottom: 40px;
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
    ::v-deep button {
      padding: 0px;
    }
    ::v-deep .dropdown-menu {
      width: 320px;
      top: 13px !important;
      padding: 0px;
      @include md {
        top: 1px !important;
      }
    }
    ::v-deep .b-dropdown-text {
      padding: 0px 16px;
    }
  }
  &--searchInput {
    width: 229px;
    max-width: 229px;
    @include md {
      width: 130px;
      max-width: 130px;
    }
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
