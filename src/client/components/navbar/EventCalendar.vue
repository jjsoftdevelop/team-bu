<template>
  <div class="d-flex justify-content-center">
    <b-calendar hide-header v-model="value" @context="onContext" locale="en-US">
      <template #nav-next-month>
        <b-icon icon="chevron-right"></b-icon>
      </template>
      <template #nav-next-year>
        <b-icon icon="chevron-double-right"></b-icon>
      </template>
      <template #nav-prev-month>
        <b-icon icon="chevron-left"></b-icon>
      </template>
      <template #nav-prev-year>
        <b-icon icon="chevron-double-left"></b-icon>
      </template>
    </b-calendar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      context: null,
    };
  },
  methods: {
    onContext(ctx) {
      this.context = ctx;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .b-calendar-nav {
    // display: none !important;
  }
  .small {
    display: none !important;
  }
  .font-weight-bold {
    font-weight: 400 !important;
  }
  .b-calendar-grid-weekdays {
    color: $Info-900;
  }
  .b-calendar-grid-caption {
    color: $Info-900;
  }
  .b-calendar-grid {
    border: 0px;
    padding-top: 24px;
    padding-bottom: 24px;
    &:focus {
      box-shadow: none;
    }
  }
  button[title="Previous month"] {
    margin-right: 150px;
  }
  button[title="Current month"] {
    display: none !important;
  }
  button {
    &.btn-sm {
      min-width: initial !important;
    }
    &:focus {
      box-shadow: none;
    }
  }
  .b-calendar-nav {
    padding-top: 24px;
    position: absolute;
    width: inherit;
  }
  .btn-primary:not(:disabled):not(.disabled):active,
  .btn-primary:not(:disabled):not(.disabled).active,
  .show > .btn-primary.dropdown-toggle {
    background-color: $Light-100;
    color: $Success-500;
    box-shadow: none;
  }
  .b-calendar-grid-weekdays {
    margin-top: 24px;
  }
}
</style>
