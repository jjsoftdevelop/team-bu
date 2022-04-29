<template>
  <div>
    <div class="d-flex p-3 justify-content-between">
      <div>我的球隊 共{{ myTeamData.list.length }} 支</div>
      <div class="btn btn-secondary" @click="openTimeFind">新增</div>
    </div>
    <div v-for="team in myTeamData.list" :key="team.teamID">
      <TeamCard :team="team" />
    </div>
    <ModalBase :footHidden="true" :headerHidden="true" ref="timeFind">
      <TeamFind />
    </ModalBase>
  </div>
</template>

<script>
import TeamCard from "~/components/home/TeamCard";
import TeamFind from "~/components/home/TeamFind";
import ModalBase from "~/components/modal/ModalBase";
export default {
  components: {
    TeamCard,
    TeamFind,
    ModalBase,
  },
  mounted() {
    this.getMyTeam();
  },
  data() {
    return {
      myTeamData: {
        list: [],
        isLoading: false,
      },
    };
  },
  methods: {
    async getMyTeam() {
      try {
        this.myTeamData.isLoading = true;
        this.myTeamData.list = await this.$api.getMyTeam();
      } catch (err) {
        console.log(err);
      } finally {
        this.myTeamData.isLoading = false;
      }
    },
    openTimeFind() {
      this.$refs.timeFind.openModal();
    },
  },
};
</script>

<style></style>
