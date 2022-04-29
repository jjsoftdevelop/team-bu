<template>
  <div class="d-flex p-3" style="border: 1px solid black">
    <!-- {{ team }} -->
    <div class="mr-2">
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
};
</script>

<style></style>
