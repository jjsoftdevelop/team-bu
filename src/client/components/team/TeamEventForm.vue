<template>
  <div class="custom-scrollbar">
    <div class="teamEventForm pr-2">
      <div class="mb-6">
        <label class="text-info" for="">名稱</label>
        <div>
          <b-form-input
            v-model="createEvent.title"
            placeholder="輸入事件名稱"
            autocomplete="off"
          ></b-form-input>
        </div>
      </div>
      <div class="mb-6 row">
        <div class="col-6">
          <label class="text-info" for="">日期</label>
          <div>
            <b-form-input type="date" v-model="createEvent.date"></b-form-input>
          </div>
        </div>
        <div class="col-6">
          <label class="text-info" for="">時間</label>
          <div>
            <b-form-input type="time" v-model="createEvent.time"></b-form-input>
          </div>
        </div>
      </div>
      <div class="mb-6">
        <label class="text-info" for="">地點</label>
        <div>
          <Map
            ref="map"
            :height="200"
            @reset="reset"
            :editLocationInfo="editLocationInfo"
          />
        </div>
      </div>
      <div class="mb-6">
        <label class="text-info" for="">通知球隊成員</label>
        <div>
          <b-form-checkbox
            switch
            v-model="createEvent.isNotify"
            size="lg"
          ></b-form-checkbox>
        </div>
      </div>
      <div class="mb-6">
        <label class="text-info" for="">備註</label>
        <b-form-textarea
          id="textarea"
          v-model="createEvent.remark"
          placeholder="加上備註..."
        ></b-form-textarea>
      </div>
      <div class="mb-6">
        <label class="text-info" for="">正式比賽</label>
        <div>
          <b-form-checkbox
            switch
            v-model="createEvent.isGame"
            size="lg"
          ></b-form-checkbox>
        </div>
      </div>
      <div v-if="createEvent.isGame">
        <div class="mb-6">
          <label class="text-info" for="">賽季</label>
          <div>
            <b-form-input
              v-model="createEvent.season"
              placeholder="輸入賽季名稱"
              autocomplete="off"
            ></b-form-input>
          </div>
        </div>
        <div class="mb-6">
          <label class="text-info" for="">對手</label>
          <div>
            <b-form-input
              v-model="createEvent.opponent"
              placeholder="輸入對手"
              autocomplete="off"
            ></b-form-input>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center mt-6">
      <b-button
        @click="
          () => {
            $emit('hideTeamEventFormModal');
          }
        "
        class="px-6 btn-l btn btn-light text-info font-weight-bold mr-6"
        pill
      >
        取消
      </b-button>
      <b-button
        :disabled="
          !createEvent.title ||
          !createEvent.date ||
          !createEvent.time ||
          (createEvent.isGame && (!createEvent.season || !createEvent.opponent))
        "
        class="btn-l"
        variant="success"
        pill
        @click="addEvent"
        >建立</b-button
      >
    </div>
  </div>
</template>

<script>
import Map from "~/components/common/GoogleMap";
export default {
  props: {
    event: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    Map,
  },
  data() {
    return {
      isEdit: false,
      createEvent: {
        title: "",
        date: "",
        time: "",
        location: "",
        position: "",
        isNotify: true,
        remark: "",
        isGame: false,
        opponent: "待定",
        season: "無",
      },
      editLocationInfo: {},
    };
  },
  destroyed() {
    this.$emit("destroySingleEvent");
  },
  watch: {
    "createEvent.isGame": {
      handler(nv, ov) {
        if (
          nv &&
          this.createEvent.opponent === "" &&
          this.createEvent.season === ""
        ) {
          this.createEvent.opponent = "待定";
          this.createEvent.season = "無";
        }
      },
    },
    event: {
      immediate: true,
      deep: true,
      handler(nv, ov) {
        if (JSON.stringify(nv) !== "{}") {
          this.isEdit = true;
          this.createEvent = {
            ...this.event,
            isGame: this.event.isGame === 1,
            isNotify: this.event.isNotify === 1,
            position: this.event.position
              ? JSON.parse(this.event.position)
              : "",
          };
          this.editLocationInfo.position = this.createEvent.position;
          this.editLocationInfo.location = this.createEvent.location;
        } else {
          this.isEdit = false;
        }
      },
    },
  },
  methods: {
    reset() {
      this.editLocationInfo = {};
    },
    addEvent() {
      const { position, location } = this.$refs.map.getLocation();
      this.createEvent.position = position;
      this.createEvent.location = location;
      if (this.isEdit) {
        this.$emit("updateEvent", this.createEvent);
      } else {
        this.$emit("addEvent", this.createEvent);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.teamEventForm {
  height: 352px;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
