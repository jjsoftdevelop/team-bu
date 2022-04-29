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
      <div v-if="!memberStatus.isFinish">
        <b-button-group size="sm">
          <b-button
            variant="success"
            @click="
              updateTeamMemberStatus(
                $encodeBase64(item.playerID),
                item.teamID,
                'agree'
              )
            "
            class="mr-2"
            >同意</b-button
          >
          <b-button
            variant="info"
            @click="
              updateTeamMemberStatus(
                $encodeBase64(item.playerID),
                item.teamID,
                'reject'
              )
            "
            >拒絕</b-button
          >
        </b-button-group>
      </div>
      <div v-else>已完成回覆</div>
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
    async updateTeamMemberStatus(memberID, teamID, type) {
      try {
        const pid = this.item.pid;
        const isShow = "0";
        if (!this.memberStatus.isLoading) {
          this.memberStatus.isLoading = true;
          if (type === "agree") {
            // 更新teamMember狀態
            const { type } = await this.$api.updateTeamMemberStatus({
              memberID,
              teamID,
              teamMemberStatusID: 3,
            });
            // 成功後 更新通知狀態
            if (type === "1") {
              this.memberStatus.isFinish = true;
            }
          }
          if (type === "reject") {
            // 更新teamMember狀態
            const { type } = await this.$api.updateTeamMemberStatus({
              memberID,
              teamID,
              teamMemberStatusID: 4,
            });
            // 成功後 更新通知狀態
            if (type === "1") {
              this.memberStatus.isFinish = true;
            }
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.memberStatus.isLoading = false;
      }
    },
  },
};
</script>

<style>
</style>