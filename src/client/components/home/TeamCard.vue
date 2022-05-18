<template>
  <div class="d-flex pointer add-shadow" @click="clickAction">
    <img
      style="min-width: 96px"
      class="img-cover"
      width="96"
      height="96"
      :src="
        team.logoUrl ? team.logoUrl : 'https://picsum.photos/250/250/?image=54'
      "
      alt=""
    />
    <div
      style="width: calc(100% - 96px)"
      class="d-flex flex-column justify-content-center px-4"
    >
      <div class="d-flex align-items-center mb-1">
        <div class="singleEllipsis text-info text-m font-weight-bold pr-2">
          {{ team.name }}
        </div>
        <img
          v-if="team.teamMemberLevelID"
          :src="
            require(`~/assets/img/svg/${$transforRoleIcon(
              team.teamMemberLevelID
            )}.svg`)
          "
          alt=""
        />
      </div>
      <div class="text-grey text-xs mb-2">
        {{ team.categoryText }}/{{ team.city }}/{{ team.typeText }}/{{
          team.rankText
        }}
      </div>
      <div
        v-if="team.teamMemberStatusID === 2 || team.teamMemberStatusID === 3"
      >
        <b-badge
          disabled
          v-if="team.teamMemberStatusID === 2"
          pill
          variant="secondary"
          >申請加入中</b-badge
        >
        <b-badge
          disabled
          v-if="team.teamMemberStatusID === 1"
          pill
          variant="secondary"
          >邀請加入中</b-badge
        >
      </div>
      <div class="text-xs text-grey" v-else-if="team.nickname">
        建立者
        <span class="text-success font-weight-bold">{{ team.nickname }}</span>
      </div>
      <div
        v-else-if="team && team.memberPic.length > 0"
        class="d-flex align-items-center"
        style="height: 25px"
      >
        <div
          class="memberPic"
          :style="{ transform: `translateX(${-5 * index}px)` }"
          v-for="(item, index) in team.memberPic"
          :key="index"
        >
          <b-img
            v-if="index < 3"
            :src="
              item ? item : require('~/assets/img/anonymous-person-icon-18.jpg')
            "
            thumbnail
            rounded="circle"
            width="25"
            height="25"
            alt=""
          ></b-img>
        </div>
        <div class="text-xs text-success">
          {{
            team.memberPic.length > 3
              ? `+${team.memberPic.length - 3}`
              : team.memberPic.length
          }}位成員
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    team: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    clickAction() {
      this.$emit("clickAction");
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .img-thumbnail {
  min-width: 25px;
  height: 25px;
}
</style>
