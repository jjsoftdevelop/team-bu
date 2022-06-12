<template>
  <div class="teamEventBlock text-info">
    <div class="row">
      <div class="col-6 position-relative">
        <EventCalendar @datePicker="datePicker" :attributes="attributes" />
        <div class="d-flex justify-content-end mt-3">
          <div class="teamEventBlock--addEvent" @click="openTeamEventFormModal">
            <b-icon icon="plus"></b-icon>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="text-m text-grey-700 font-weight-bold mb-1">
          {{ formatPickDate }}
        </div>
        <div>
          <div
            :class="[
              'panel teamEventBlock--item',
              item.isGame === 0 ? 'event' : 'game',
            ]"
            v-for="item in eventInfo.data"
            :key="item.pid"
          >
            <div
              class="text-dark font-weight-bold mb-2 d-flex align-items-center"
            >
              <span class="pr-2">{{ item.title }}</span>
              <svg
                class="pointer"
                @click="
                  () => {
                    singleEvent = item;
                    openTeamEventFormModal();
                  }
                "
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.4003 3.34L13.6603 0.599995C13.3027 0.264091 12.8341 0.0713541 12.3436 0.0584473C11.8532 0.0455405 11.3751 0.213365 11.0003 0.529995L2.0003 9.52999C1.67706 9.85596 1.4758 10.2832 1.4303 10.74L1.0003 14.91C0.986826 15.0565 1.00583 15.2041 1.05596 15.3424C1.10608 15.4807 1.1861 15.6062 1.2903 15.71C1.38374 15.8027 1.49455 15.876 1.61639 15.9258C1.73823 15.9755 1.86869 16.0008 2.0003 16H2.0903L6.2603 15.62C6.71709 15.5745 7.14433 15.3732 7.4703 15.05L16.4703 6.05C16.8196 5.68096 17.0084 5.1885 16.9953 4.68053C16.9822 4.17256 16.7682 3.6905 16.4003 3.34ZM6.0803 13.62L3.0803 13.9L3.3503 10.9L9.0003 5.31999L11.7003 8.02L6.0803 13.62ZM13.0003 6.68L10.3203 4L12.2703 2L15.0003 4.72999L13.0003 6.68Z"
                  fill="#4F4F4F"
                />
              </svg>
            </div>
            <div class="text-grey-700 text-xs d-flex align-items-center mb-2">
              <span class="pr-4 text-nowrap"
                ><svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 1.3125C3.85902 1.3125 1.3125 3.85902 1.3125 7C1.3125 10.141 3.85902 12.6875 7 12.6875C10.141 12.6875 12.6875 10.141 12.6875 7C12.6875 3.85902 10.141 1.3125 7 1.3125ZM9.625 7.875H7C6.88397 7.875 6.77269 7.82891 6.69064 7.74686C6.60859 7.66481 6.5625 7.55353 6.5625 7.4375V3.5C6.5625 3.38397 6.60859 3.27269 6.69064 3.19064C6.77269 3.10859 6.88397 3.0625 7 3.0625C7.11603 3.0625 7.22731 3.10859 7.30936 3.19064C7.39141 3.27269 7.4375 3.38397 7.4375 3.5V7H9.625C9.74103 7 9.85231 7.04609 9.93436 7.12814C10.0164 7.21019 10.0625 7.32147 10.0625 7.4375C10.0625 7.55353 10.0164 7.66481 9.93436 7.74686C9.85231 7.82891 9.74103 7.875 9.625 7.875Z"
                    fill="#4F4F4F"
                  />
                </svg>
                {{ item.time }}</span
              ><span class="singleEllipsis"
                ><svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 0C4.08541 0 1.72266 2.36275 1.72266 5.27735C1.72266 6.25206 1.91344 7.25878 2.46093 7.98438L7 14L11.5391 7.98438C12.0364 7.32533 12.2773 6.16022 12.2773 5.27735C12.2773 2.36275 9.91459 0 7 0ZM7 3.05651C8.22636 3.05651 9.22082 4.05099 9.22082 5.27733C9.22082 6.5037 8.22636 7.49817 7 7.49817C5.77365 7.49817 4.77918 6.5037 4.77918 5.27735C4.77918 4.05099 5.77365 3.05651 7 3.05651Z"
                    fill="#4F4F4F"
                  />
                </svg>
                {{ item.location }}</span
              >
            </div>
            <div class="text-dark font-weight-bold text-s">
              比賽對手：{{ item.opponent }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <ModalBase
      titleClass="text-info"
      :modalTitle="
        JSON.stringify(singleEvent) === '{}' ? '創建事件' : '修改事件'
      "
      :footHidden="true"
      :headerHidden="false"
      :bodyCloseBtn="false"
      ref="teamEventForm"
    >
      <TeamEventForm
        :event="singleEvent"
        @addEvent="addEvent"
        @updateEvent="updateEvent"
        @hideTeamEventFormModal="hideTeamEventFormModal"
        @destroySingleEvent="destroySingleEvent"
      />
    </ModalBase>
  </div>
</template>

<script>
import ModalBase from "~/components/modal/ModalBase";
import EventCalendar from "~/components/navbar/EventCalendar";
import TeamEventForm from "~/components/team/TeamEventForm";

export default {
  props: {
    teamID: {
      type: String,
      default: "",
    },
  },
  components: {
    ModalBase,
    EventCalendar,
    TeamEventForm,
  },
  async mounted() {
    // 取得所有行事曆
    await this.getAllEvent();
  },
  computed: {
    formatPickDate() {
      if (this.pickDate) {
        const date = new Date(this.pickDate);
        const format = date.toLocaleString("zh-Hans", {
          dateStyle: "full",
        });
        return format;
      } else {
        return "";
      }
    },
  },
  data() {
    return {
      singleEvent: {},
      pickDate: "",
      attributes: [
        {
          dot: "red",
          dates: [],
        },
        {
          dot: "green",
          dates: [],
        },
      ],
      eventInfo: {
        isLoading: false,
        data: [],
      },
    };
  },
  methods: {
    async getAllEvent() {
      const event = await this.getEvent();
      this.attributes[0].dates = [];
      this.attributes[1].dates = [];
      event.forEach((item) => {
        const date = new Date(item.date).toDateString();
        if (item.isGame) {
          // red 比賽
          this.attributes[0].dates.push(date);
        } else {
          // green 非比賽
          this.attributes[1].dates.push(date);
        }
      });
    },
    destroySingleEvent() {
      this.singleEvent = {};
    },
    openTeamEventFormModal() {
      this.$refs.teamEventForm.openModal();
    },
    hideTeamEventFormModal() {
      this.$refs.teamEventForm.hideModal();
    },
    async datePicker(date) {
      if (date) {
        const pick = new Date(date);
        const startDate = pick.toLocaleDateString();
        const endDate = pick.toLocaleDateString();
        this.pickDate = startDate;
        this.eventInfo.data = await this.getEvent(startDate, endDate);
      }
    },
    async getEvent(startDate = "", endDate = "") {
      try {
        this.eventInfo.isLoading = true;
        const event = await this.$api.getEvent({
          teamID: this.teamID,
          startDate,
          endDate,
        });
        return event;
      } catch (err) {
        console.log(err);
      } finally {
        this.eventInfo.isLoading = false;
      }
    },
    async updateEvent(eventInfo) {
      try {
        const params = { ...eventInfo, teamID: this.teamID };
        const event = await this.$api.updateEvent({ ...params });
        if (event) {
          const update = event[0];
          const index = this.eventInfo.data.findIndex(
            (item) => item.pid === update.pid
          );
          this.eventInfo.data[index] = { ...update };
          await this.getAllEvent();
          this.hideTeamEventFormModal();
          this.$showToast({
            content: "修改成功！",
            title: "訊息",
            variant: "success",
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async addEvent(eventInfo) {
      try {
        const params = { ...eventInfo, teamID: this.teamID };
        const event = await this.$api.addEvent({ ...params });
        if (event) {
          await this.getAllEvent();
          this.hideTeamEventFormModal();
          this.$showToast({
            content: "創建成功！",
            title: "訊息",
            variant: "success",
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.teamEventBlock {
  &--addEvent {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: $Success-900;
    font-size: 32px;
    color: $Light;
    cursor: pointer;
  }
  &--item {
    margin-bottom: 16px;
    &.game {
      border-left: 3px solid $Error-500;
    }
    &.event {
      border-left: 3px solid $Success-500;
    }
  }
}
</style>
