<template>
  <div>
    <div class="d-flex">
      <b-input-group class="mb-4">
        <b-form-input
          v-model="email"
          type="text"
          placeholder="XXX@gmail.com"
        ></b-form-input>
        <b-input-group-append>
          <b-button
            style="height: 35px"
            variant="success"
            @click="getMemberByEmail"
            >搜尋</b-button
          >
        </b-input-group-append>
      </b-input-group>
    </div>
    <div class="text-info">
      <b-table
        emptyText="搜尋無結果"
        :busy="memberList.isLoading"
        table-class="text-grey-500 text-s"
        thead-class="bg-info-800 text-light"
        tbody-td-class="d-flex align-items-center"
        :fields="tableField"
        striped
        hover
        :items="memberList.data"
        show-empty
      >
        <template #empty="scope">
          <div class="text-center">
            {{
              memberList.isLoading
                ? ""
                : !memberList.isInitial && !memberList.isLoading
                ? "請使用上方搜尋框"
                : scope.emptyText
            }}
          </div>
        </template>
        <template #cell(picture)="data">
          <b-img
            width="32"
            height="32"
            :src="
              data.item.picture
                ? data.item.picture
                : require('~/assets/img/anonymous-person-icon-18.jpg')
            "
            rounded="circle"
          ></b-img>
        </template>
        <template #cell(teamMemberStatusID)="data">
          <div>
            {{ formatStatus(data.item.teamMemberStatusID) }}
          </div>
        </template>
        <template #cell(action)="data">
          <div>
            <b-button
              v-if="formatStatus(data.item.teamMemberStatusID) === '-'"
              class="btn-sm"
              pill
              variant="outline-success"
              @click="
                () => {
                  memberID = data.item.pid;
                  picture = data.item.picture;
                  $refs.selectRole.openModal();
                }
              "
              >加入</b-button
            >
          </div>
        </template>
      </b-table>

      <ModalBase
        bodyClass="h-320"
        :footHidden="true"
        :headerHidden="true"
        ref="selectRole"
        size="sm"
      >
        <h5 class="text-info text-center mb-4">申請成為球隊</h5>
        <div class="d-flex justify-content-center py-6">
          <div
            v-for="(item, key) in roleCate"
            :key="key"
            @click="teamMemberLevelID = key"
            :class="[
              'teamFindBlock--btn mr-3 px-6 px-md-10 py-2 grey text-center normal-border-radius',
              { active: teamMemberLevelID === key },
            ]"
          >
            <div class="mb-2">
              <img
                :src="require(`~/assets/img/svg/${item.iconBigSrc}.svg`)"
                alt=""
              />
            </div>
            <div class="text-info text-s font-weight-bold">{{ item.text }}</div>
          </div>
        </div>
        <div class="d-flex justify-content-center">
          <b-button
            @click="
              () => {
                $refs.selectRole.hideModal();
              }
            "
            class="px-6 btn btn-sm btn-light text-info font-weight-bold mr-6"
            pill
          >
            取消
          </b-button>
          <b-button
            class="btn-sm"
            :disabled="!teamMemberLevelID"
            variant="success"
            pill
            @click="teamJoin"
            >送出申請</b-button
          >
        </div>
      </ModalBase>
    </div>
  </div>
</template>

<script>
import { roleCate } from "~/constants/roleCate";
import ModalBase from "~/components/modal/ModalBase";

export default {
  components: {
    ModalBase,
  },
  props: {
    teamID: {
      type: String,
      default: "",
    },
  },
  mounted() {
    Object.assign(this.roleCate, roleCate);
  },
  data() {
    return {
      roleCate: {},
      email: "a10010134@gmail.com",
      memberID: "",
      picture: "",
      teamMemberLevelID: "1",
      memberList: {
        isInitial: false,
        isLoading: false,
        data: [],
      },
      tableField: [
        { key: "picture", label: "頭像" },
        { key: "nickname", label: "暱稱" },
        { key: "teamMemberStatusID", label: "狀態" },
        { key: "action", label: "動作" },
      ],
    };
  },
  methods: {
    formatStatus(status) {
      if (status === 1) {
        return "邀請球員中";
      } else if (status === 2) {
        return "申請加入中";
      } else if (status === 3) {
        return "已加入球隊";
      } else {
        return "-";
      }
    },
    async getMemberByEmail() {
      try {
        this.memberList.isInitial = true;
        this.memberList.isLoading = true;
        const email = this.email;
        const res = await this.$api.getMemberByEmail({
          email,
          teamID: this.teamID,
        });
        this.memberList.data = res;
      } catch (err) {
        console.log(err);
      } finally {
        this.memberList.isLoading = false;
      }
    },
    async teamJoin() {
      try {
        const memberID = this.memberID;
        const picture = this.picture;
        const teamID = this.teamID;
        const teamMemberLevelID = Number(this.teamMemberLevelID);
        await this.$api.teamJoin({
          teamID,
          memberID,
          picture,
          teamMemberLevelID,
          type: "invite",
        });
        this.$showToast({
          content: "邀請成功！",
          title: "訊息",
          variant: "success",
        });
        await this.getMemberByEmail();
        this.$refs.selectRole.hideModal();
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style></style>
