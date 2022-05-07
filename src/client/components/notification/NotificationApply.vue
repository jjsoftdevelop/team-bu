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
                $encodeBase64(item.teamID),
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
                $encodeBase64(item.teamID),
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
            // 此通知的 type
            // 1:個人通知 2:系統通知 3:要求加入 4:邀請加入 5:球隊同意加入
            // 6:球員同意加入 7:球隊拒絕加入 8:球員拒絕加入
            const notificationType =  this.item.type
            // 更新teamMember狀態
            const { type } = await this.$api.updateTeamMemberStatus({
              memberID,
              teamID,
              teamMemberStatusID: notificationType === 3 ? 4 : 5,
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