<template>
  <div class="d-flex align-items-start">
    <div>
      <b-img
        class="mr-2"
        width="30"
        height="30"
        :src="item.picture"
        rounded
        style="object-fit: contain"
        alt=""
      ></b-img>
    </div>
    <div>
      <div class="d-flex flex-column">
        <div>{{ item.title }}</div>
        <div>{{ item.content }}</div>
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

<style>
</style>