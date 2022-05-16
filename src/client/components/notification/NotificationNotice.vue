<template>
  <div class="d-flex align-items-center  py-2">
    <div>
      <b-img
        class="mr-4"
        width="30"
        height="30"
        :src="item.picture"
        rounded="circle"
        style="object-fit: contain"
        alt=""
      ></b-img>
    </div>
    <div>
      <div class="d-flex flex-column">
        <div class="font-weight-bold text-info text-s mb-1">{{ item.title }}</div>
        <div class="text-grey text-xs">{{ item.content }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      memberStatus: {
        isLoading: false,
        isFinish: false,
      },
    };
  },
  methods: {
    async updateNotification({ pid, isShow, isRead }) {
      try {
        await this.$api.updateNotification({
          pid,
          isShow,
          isRead,
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style></style>
