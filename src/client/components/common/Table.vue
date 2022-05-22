<template>
  <b-table
    v-if="isInitial"
    emptyText="搜尋無結果"
    :busy="isLoading"
    table-class="text-grey-500 text-s"
    thead-class="bg-info-800 text-light"
    tbody-td-class="d-flex align-items-center"
    striped
    hover
    :items="list"
    :fields="field"
    show-empty
  >
    <template #empty="scope">
      <div class="text-center">{{ scope.emptyText }}</div>
    </template>
  </b-table>
</template>

<script>
export default {
  props: {
    isInitial: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: () => [],
    },
    field: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style></style>
