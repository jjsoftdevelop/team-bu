<template>
  <div class="eventBlock container">
    <div class="eventBlock--header">
      <div
        class="d-flex align-items-center justify-content-between text-grey-700"
      >
        <div class="d-flex align-items-center">
          <div class="eventBlock--avatar d-flex mr-6">
            <b-avatar rounded variant="outline-light">
              <div
                class="d-flex flex-column justify-content-center align-items-center"
              >
                <div class="text-xs mb-0">11月</div>
                <div class="h4">26</div>
              </div>
            </b-avatar>
          </div>
          <div class="text-l font-weight-bold">
            <div class="mb-2">109年秋季聯賽</div>
            <div class="mb-2">2022 / 11 / 26 - 12:00 PM</div>
            <div class="mb-2 text-m font-weight-normal">比分： - : -</div>
          </div>
        </div>
        <div>
          <b-button class="btn-sm mr-4" pill variant="outline-success"
            >刪除活動</b-button
          >
        </div>
      </div>
    </div>
    <div class="eventBlock--body">
      <div class="eventBlock--tab">
        <div class="d-flex py-3 px-6">
          <b-button class="btn-sm mr-4" pill variant="success"
            >比賽分數</b-button
          >
          <b-button class="btn-sm mr-4" pill variant="success"
            >紀錄比賽</b-button
          >
        </div>
      </div>
      <div class="eventBlock--setting bg-light">
        <div class="d-flex justify-content-between py-3 px-6">
          <b-button
            class="btn-l mr-4 font-weight-bold"
            pill
            variant="outline-success"
            >先發球員設定</b-button
          >
          <div class="d-flex align-items-center">
            <div class="mr-6">
              <img
                class="mr-1"
                src="~/assets/img/svg/event_member_icon.svg"
                alt=""
              />
              <span class="font-weight-bold text-info">25</span>
            </div>
            <div class="mr-2 text-s">
              <img
                class="mr-1"
                src="~/assets/img/svg/event_agree_icon.svg"
                alt=""
              />
              <span class="text-success">25</span>
            </div>
            <div class="mr-2 text-s">
              <img
                class="mr-1"
                src="~/assets/img/svg/event_reject_icon.svg"
                alt=""
              />
              <span class="text-error">25</span>
            </div>
            <div class="mr-2 text-s">
              <img
                class="mr-1"
                src="~/assets/img/svg/event_question_icon.svg"
                alt=""
              />
              <span class="text-attention">25</span>
            </div>
          </div>
        </div>
      </div>
      <div class="eventBlock--member">
        <div
          class="eventBlock--memberRow d-flex justify-content-between align-items-center px-6 py-3 bg-light-100"
        >
          <div class="d-flex align-items-center font-weight-bold">
            <b-img
              class="img-contain mr-2"
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
            <div class="text-grey-700">洪逸翔</div>
          </div>
          <div class="d-flex">
            <b-button class="btn-m mr-4" pill variant="success">出席</b-button>
            <b-button class="btn-m" pill variant="secondary">不出席</b-button>
          </div>
        </div>
        <div
          class="eventBlock--memberRow d-flex justify-content-between align-items-center px-6 py-2 bg-light"
        >
          <div class="d-flex align-items-center font-weight-bold">
            <b-img
              class="img-contain mr-2"
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
            <div class="text-grey-700">洪逸翔</div>
          </div>
          <div class="d-flex">
            <div class="mr-2 text-s">
              <img
                class="mr-1"
                src="~/assets/img/svg/event_agree_icon.svg"
                alt=""
              />
              <span class="text-success">出席</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
.eventBlock {
  margin-top: -40px;
  &--header {
    padding: 16px 56px;
    background: $Light-100;
    border-top: 2px solid $Error-500;
  }
  &--avatar {
    ::v-deep .b-avatar {
      border: 1px solid $Dark-700;
      width: 64px;
      height: 64px;
      border-radius: 16px !important;
    }
  }
  &--tab {
    background: $Dark-200;
  }
  &--memberRow {
    border-bottom: 1px solid $Light-300;
  }
}
</style>
