<template>
  <div>
    <v-date-picker
      v-model="date"
      :model-config="modelConfig"
      is-expanded
      :attributes="attributes"
    >
    </v-date-picker>
  </div>
</template>

<script>
// import PopoverRow from "v-calendar/lib/components/popover-row.umd.min";
export default {
  props: {
    attributes: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    date: {
      immediate: true,
      handler(nv, ov) {
        this.$emit("datePicker", nv);
      },
    },
  },
  // components: {
  //   PopoverRow,
  // },
  data() {
    return {
      modelConfig: {
        type: "string",
        mask: "iso",
        mask: "YYYY-MM-DD", // Uses 'iso' if missing
      },
      date: new Date(),
      value: "",
      context: null,
      // attributes: [
      //   // This is a single attribute
      //   {
      //     // An optional key can be used for retrieving this attribute later,
      //     // and will most likely be derived from your data object
      //     // key: Any,
      //     // Attribute type definitions
      //     highlight: {
      //       contentStyle: {
      //         color: "#21b39a",
      //       },
      //     }, // Boolean, String, Object
      //     dot: true, // Boolean, String, Object
      //     // bar: true, // Boolean, String, Object
      //     // content: "red", // Boolean, String, Object
      //     // popover: { ... }, // Only objects allowed
      //     // Your custom data object for later access, if needed
      //     // customData: { ... },
      //     // We also need some dates to know where to display the attribute
      //     // We use a single date here, but it could also be an array of dates,
      //     //  a date range or a complex date pattern.
      //     dates: new Date(),
      //     // You can optionally provide dates to exclude
      //     excludeDates: null,
      //     // Think of `order` like `z-index`
      //     order: 0,
      //   },
      // ],
    };
  },
  methods: {
    onContext(ctx) {
      this.context = ctx;
    },
  },
};
</script>
<style lang="scss" scoped></style>
