<template>
  <div class="d-flex p-3 pointer" style="border: 1px solid black" @click="goTeam">
    <div class="mr-2 position-relative">
      <img
        width="96"
        height="96"
        :src="
          team.logoUrl
            ? team.logoUrl
            : 'https://picsum.photos/250/250/?image=54'
        "
        alt=""
      />
      <div
        v-if="team.teamMemberLevelID === 3"
        class="position-absolute p-1 d-flex align-items-center justify-content-center"
        style="
          width: 26px;
          height: 26px;
          bottom: 10px;
          right: 10px;
          background-color: white;
          border-radius: 50%;
        "
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.0121 7.793C13.4409 8.36544 12.7127 8.75562 11.9197 8.91422C11.1268 9.07282 10.3046 8.9927 9.5571 8.684L4.6881 14.552C3.7971 15.443 2.3571 15.443 1.4661 14.552C0.575102 13.661 0.575102 12.221 1.4661 11.339L7.3341 6.461C6.7221 4.976 7.0191 3.212 8.2251 2.006C9.3771 0.853998 11.0331 0.547998 12.4731 1.052L9.8721 3.653L12.4101 6.191L14.9841 3.608C15.4611 5.03 15.1461 6.659 14.0121 7.793ZM2.4291 13.589C2.7891 13.94 3.3651 13.94 3.7161 13.589C4.0761 13.229 4.0761 12.653 3.7161 12.302C3.3651 11.942 2.7891 11.942 2.4291 12.302C2.26036 12.4737 2.1658 12.7048 2.1658 12.9455C2.1658 13.1862 2.26036 13.4173 2.4291 13.589Z"
            fill="#959595"
          />
        </svg>
      </div>
    </div>
    <div class="d-flex flex-column">
      <div>{{ team.name }}</div>
      <div>
        {{ team.categoryText }}/{{ team.city }}/{{ team.typeText }}/{{
          team.rankText
        }}
      </div>
      <div class="d-flex">
        <div v-for="(item, index) in team.memberPic" :key="index">
          <b-img
            :src="item"
            rounded="circle"
            width="25"
            height="25"
            alt=""
            style="object-fit: cover"
          ></b-img>
        </div>
        <div>{{ team.memberPic.length }}位成員</div>
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
    goTeam() {
      this.$router.push(`/team/${this.team.teamID}`);
    },
  },
};
</script>

<style></style>
