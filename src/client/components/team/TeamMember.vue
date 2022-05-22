<template>
  <div class="teamMemberBlock">
    <div class="d-flex justify-content-between mb-6">
      <div class="d-flex">
        <b-button class="btn-sm mr-4" pill variant="outline-success"
          ><b-icon icon="plus"></b-icon>條件搜尋</b-button
        >
        <div class="btn-sm btn-light rounded-pill pointer text-center">
          清除
        </div>
      </div>
      <b-button
        @click="
          () => {
            $emit('openTeamfindMemberModal');
          }
        "
        class="btn-sm mr-4"
        pill
        variant="success"
        ><b-icon icon="plus"></b-icon>新增球員</b-button
      >
    </div>
    <div class="mb-4">
      <span class="h5 text-info pr-2">球隊成員列表</span>
      <span class="text-s text-success"
        >共 {{ memberdata.list.length }} 位成員</span
      >
    </div>
    <div class="row">
      <div
        class="col-3 col-lg-2 pointer"
        v-for="(item, index) in memberdata.list"
        :key="index"
      >
        <b-img
          class="mb-1 img-cover teamMemberBlock--headshot"
          width="120"
          height="160"
          :src="
            item.picture ? item.picture : 'https://placekitten.com/g/300/450'
          "
        ></b-img>
        <div class="text-m text-grey-700">
          {{ item.nickname }}
          <img
            :src="
              require(`~/assets/img/svg/${$transforRoleIcon(
                item.teamMemberLevelID
              )}.svg`)
            "
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    memberdata: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style scoped lang="scss">
.teamMemberBlock {
  &--headshot {
    @include sm {
      width: 80px;
      height: 100px;
    }
  }
}
</style>
