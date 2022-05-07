<template>
  <div>
    <div class="d-flex">
      <label for="">球員帳號</label>
      <input type="text" v-model="email" />
      <div @click="getMemberByEmail">找尋球員{{ teamID }}</div>
    </div>
    <div>
      <div v-for="(item, index) in memberList.data" :key="index">
        <div class="row">
          <div class="col-3">頭貼</div>
          <div class="col-3">姓名</div>
          <div class="col-3">狀態</div>
          <div class="col-3">動作</div>
        </div>
        <div class="row">
          <div class="col-3">
            <b-img width="28" height="28" :src="item.picture" circle></b-img>
          </div>
          <div class="col-3">{{ item.nickname }}</div>
          <div class="col-3">
            {{ formatStatus(item.teamMemberStatusID, item.teamID) }}
          </div>
          <div class="col-3">
            <div
              class="btn btn-secondary"
              @click="
                teamJoin({
                  memberID: item.pid,
                  picture: item.picture,
                })
              "
            >
              送出邀請
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          <label for="player">球員</label>
          <input
            id="player"
            type="radio"
            v-model="teamMemberLevelID"
            value="1"
          />
          <label for="manager">管理員</label>
          <input
            id="manager"
            type="radio"
            v-model="teamMemberLevelID"
            value="2"
          />
          <label for="fans">粉絲</label>
          <input id="fans" type="radio" v-model="teamMemberLevelID" value="3" />
        </div>
      </div>
    </div>
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
      email: "a10010134@gmail.com",
      memberList: {
        isLoading: false,
        data: [],
      },
      teamMemberLevelID: "1",
    };
  },
  methods: {
    formatStatus(status, teamID) {
      if (
        teamID === this.teamID &&
        (status === 1 || status === 2 || status === 3)
      ) {
        return "已是隊員";
      } else {
        return "";
      }
    },
    async getMemberByEmail() {
      try {
        this.memberList.isLoading = true;
        const email = this.email;
        const res = await this.$api.getMemberByEmail({ email });
        this.memberList.data = res;
      } catch (err) {
        console.log(err);
      } finally {
        this.memberList.isLoading = false;
      }
    },
    async teamJoin({ memberID, picture }) {
      try {
        const teamID = this.teamID;
        const teamMemberLevelID = Number(this.teamMemberLevelID);
        const res = await this.$api.teamJoin({
          teamID,
          memberID,
          picture,
          teamMemberLevelID,
          type: "invite",
        });
        console.log(res);
      } catch (err) {}
    },
  },
};
</script>

<style></style>
