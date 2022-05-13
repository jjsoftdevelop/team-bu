<template>
  <div>
    <b-card-group>
      <b-card
        v-for="(item, index) in memberdata.list"
        :key="index"
        :title="item.nickname"
        :img-src="
          item.picture ? item.picture : 'https://placekitten.com/g/300/450'
        "
        img-alt="Image"
        img-top
      >
        <b-card-text>
          {{item.teamMemberPos}}
          {{item.teamMemberNo}}
          {{item.levelText}}
        </b-card-text>
        <template #footer>
          <small class="text-muted">Last updated 3 mins ago</small>
        </template>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
export default {
  props: {
    teamID: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      memberdata: {
        isLoading: false,
        list: [],
      },
    };
  },
  mounted() {
    this.getTeamMemberList();
  },
  methods: {
    async getTeamMemberList() {
      try {
        const teamID = this.teamID;
        const res = await this.$api.getTeamMemberList({ teamID });
        this.memberdata.list = res;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style></style>
