<template>
  <div class="searchInputBlock">
    <input v-model="keyword" type="text" placeholder="搜尋球隊" />
    <div class="pointer searchInputBlock--tools">
      <img v-if="!keyword" src="~/assets/img/svg/search_icon.svg" alt="" />
      <img
        v-if="keyword"
        @click="keyword = ''"
        src="~/assets/img/svg/search_close_icon.svg"
        alt=""
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: "",
    };
  },
};
</script>

<style scoped lang="scss">
.searchInputBlock {
  position: relative;
  input {
    width: 100%;
    background: $Light-100;
    border-radius: 25px;
    border: 0px;
    padding: 6px 16px;
    color: $Dark-700;
    font-size: 14px;
    &:focus {
      border: 0px;
      outline: 0px;
      color: $Success-500;
    }
    &::placeholder {
      color: $Dark-300;
    }
  }
  &--tools {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
