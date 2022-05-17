<template>
  <div class="py-6 text-m">
    <div class="d-flex flex-column">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex mb-2">
          <div class="mr-4">
            <b-img
              width="56"
              height="56"
              :src="user && user.picture"
              rounded="circle"
            ></b-img>
          </div>
          <div>
            <div class="mb-2 font-weight-bold">
              {{ user.nickname }}
            </div>
            <div>
              <span
                class="pr-2"
                v-for="(item, index) in myJoinSport"
                :key="index"
              >
                <b-img
                  v-if="item.categoryID"
                  :src="
                    require(`~/assets/img/svg/${formatSportIcon(
                      item.categoryID
                    )}.svg`)
                  "
                  width="16"
                  height="16"
                  rounded="circle"
                ></b-img>
              </span>
            </div>
          </div>
        </div>
        <a
          class="btn btn-sm d-block btn-outline-success rounded-pill font-weight-bold"
          href="#"
          >個人檔案</a
        >
      </div>

      <div class="text-s text-grey-700 font-weight-bold text-nowrap">
        <span class="pr-4">
          <img
            style="vertical-align: text-bottom"
            src="~/assets/img/svg/account_manager_icon.svg"
          />
          <span>管理員</span>
          <span>1</span>
        </span>
        <span class="pr-4">
          <img
            style="vertical-align: baseline"
            src="~/assets/img/svg/account_player_icon.svg"
          />
          <span>球員</span>
          <span>1</span>
        </span>
        <span>
          <img
            style="vertical-align: text-top"
            src="~/assets/img/svg/account_fans_icon.svg"
          />
          <span>粉絲</span>
          <span>1</span>
        </span>
      </div>
    </div>
    <LineBlock class="my-6" />
    <div class="d-flex flex-column text-s">
      <div class="d-flex align-items-center justify-content-between mb-6">
        <div class="d-flex align-items-center">
          <img
            class="mr-4"
            src="~/assets/img/svg/account_setting_icon.svg"
            width="24"
            height="24"
            alt=""
          />
          <span class="font-weight-bold text-info">帳戶設定</span>
        </div>
        <img src="~/assets/img/svg/arrow_right_icon.svg" width="10" alt="" />
      </div>
      <div class="d-flex align-items-center justify-content-between mb-6">
        <div class="d-flex align-items-center">
          <img
            class="mr-4"
            src="~/assets/img/svg/account_notification_icon.svg"
            width="24"
            height="24"
            alt=""
          />
          <span class="font-weight-bold text-info">通知設定</span>
        </div>
        <img src="~/assets/img/svg/arrow_right_icon.svg" width="10" alt="" />
      </div>
      <div class="d-flex align-items-center justify-content-between mb-6">
        <div class="d-flex align-items-center">
          <img
            class="mr-4"
            src="~/assets/img/svg/account_helper_icon.svg"
            width="24"
            height="24"
            alt=""
          />
          <span class="font-weight-bold text-info">協助及資源</span>
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-between mb-6">
        <div class="d-flex align-items-center">
          <img
            class="mr-4"
            src="~/assets/img/svg/account_private_icon.svg"
            width="24"
            height="24"
            alt=""
          />
          <span class="font-weight-bold text-info">隱私權政策</span>
        </div>
      </div>
      <div
        class="d-flex align-items-center justify-content-between"
        @click="
          () => {
            $emit('logout');
          }
        "
      >
        <div class="d-flex align-items-center">
          <img
            class="mr-4"
            src="~/assets/img/svg/account_logout_icon.svg"
            width="24"
            height="24"
            alt=""
          />
          <span class="font-weight-bold text-info">登出</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sportCate } from "~/constants/sportCate";
import LineBlock from "~/components/common/LineBlock";

export default {
  components: {
    LineBlock,
  },
  props: {
    user: {
      type: Object,
      default: () => {},
    },
    myJoinSport: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    console.log(sportCate);
  },
  methods: {
    formatSportIcon(cateID) {
      const src = sportCate[cateID].iconSrc;
      return src;
    },
  },
};
</script>

<style></style>
