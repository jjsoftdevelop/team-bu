<template>
  <div>
    <!-- @keyup.enter="usePlace" -->
    <div class="d-flex align-items-center mb-3">
      <GmapAutocomplete
        :value="
          locationInfo && locationInfo.location
            ? locationInfo.location
            : editLocationInfo.location
        "
        v-if="autocomplete"
        @place_changed="setPlace"
        :options="{
          fields: ['geometry', 'formatted_address', 'address_components'],
        }"
      >
      </GmapAutocomplete>
      <div class="text-info text-nowrap" @click="reset">清除</div>
    </div>

    <GmapMap
      v-if="
        (markers[0] && markers[0].position && markers[0].position.lat) ||
        (editLocationInfo &&
          editLocationInfo.position &&
          editLocationInfo.position.lat)
      "
      :center="
        markers[0].position.lat
          ? markers[0].position
          : editLocationInfo.position
      "
      :zoom="16"
      map-type-id="roadmap"
      :style="{ width: '80%', height: `${height}px` }"
      ><GmapMarker
        :position="
          markers[0].position.lat
            ? markers[0].position
            : editLocationInfo.position
        "
        :clickable="false"
        :draggable="false"
    /></GmapMap>
  </div>
</template>

<script>
export default {
  props: {
    editLocationInfo: {
      type: Object,
      default: () => {},
    },
    height: {
      type: Number,
      default: 300,
    },
    autocomplete: {
      type: Boolean,
      default: true,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  data: function () {
    return {
      locationInfo: {
        position: "",
        location: "",
      },
      markers: [
        {
          position: { lat: "", lng: "" },
        },
      ],
      place: null,
    };
  },
  methods: {
    reset() {
      this.$emit("reset");
    },
    getLocation() {
      return this.locationInfo && this.locationInfo.location
        ? this.locationInfo
        : this.editLocationInfo;
    },
    setPlace(place) {
      this.place = place;
      this.usePlace(this.place);
    },
    usePlace(place) {
      if (place && place.geometry) {
        var newPostion = {
          lat: this.place.geometry.location.lat(),
          lng: this.place.geometry.location.lng(),
        };

        this.center = newPostion;
        this.markers[0].position = newPostion;
        this.locationInfo.position = newPostion;
        this.locationInfo.location = place.formatted_address;
        this.place = null;
      }
    },
  },
};
</script>

<style lang="scss">
.pac-target-input {
  display: block;
  width: 100%;
  height: calc(1.5em + 0.75rem + 2px);
  padding: 16px 10px;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  &:focus {
    color: #495057;
    background-color: #fff;
    border-color: #495057;
    outline: 0;
    box-shadow: 0px 0px 0px 2px #b7ebd2;
  }
}
.pac-container {
  z-index: 999999;
}
</style>
