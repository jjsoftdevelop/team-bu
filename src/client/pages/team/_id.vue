<template>
  <div>
    <div class="text-center mb-2" style="background: #adadad">
      <b-img
        :src="teamInfo.data.bannerUrl"
        class="w-100"
        height="300"
        alt=""
        style="object-fit: cover"
      ></b-img>
    </div>
    <div v-if="teamInfo && teamInfo.data" class="container">
      <div class="d-flex justify-content-between">
        <div class="d-flex">
          <div>
            <b-img
              :src="teamInfo.data.logoUrl"
              rounded="circle"
              width="80"
              height="80"
              alt=""
              style="object-fit: cover"
              class="mr-2"
            ></b-img>
          </div>
          <div>
            <div>{{ teamInfo.data.teamMemberLevelText }}</div>
            <div>
              {{ teamInfo.data.name }} |
              <span class="pointer" @click="openTeamModifyModal"
                ><svg
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.4003 3.3401L13.6603 0.600102C13.3027 0.264198 12.8341 0.0714609 12.3436 0.0585541C11.8532 0.0456473 11.3751 0.213471 11.0003 0.530102L2.0003 9.5301C1.67706 9.85607 1.4758 10.2833 1.4303 10.7401L1.0003 14.9101C0.986826 15.0566 1.00583 15.2042 1.05596 15.3425C1.10608 15.4808 1.1861 15.6063 1.2903 15.7101C1.38374 15.8028 1.49455 15.8761 1.61639 15.9259C1.73823 15.9756 1.86869 16.0009 2.0003 16.0001H2.0903L6.2603 15.6201C6.71709 15.5746 7.14433 15.3733 7.4703 15.0501L16.4703 6.0501C16.8196 5.68107 17.0084 5.18861 16.9953 4.68064C16.9822 4.17266 16.7682 3.69061 16.4003 3.3401ZM6.0803 13.6201L3.0803 13.9001L3.3503 10.9001L9.0003 5.3201L11.7003 8.0201L6.0803 13.6201ZM13.0003 6.6801L10.3203 4.0001L12.2703 2.0001L15.0003 4.7301L13.0003 6.6801Z"
                    fill="black"
                  />
                </svg>
              </span>
              |
              {{ teamInfo.data.categoryText }}
            </div>
            <div>
              {{ teamInfo.data.city }} / {{ teamInfo.data.typeText }} /
              {{ teamInfo.data.rankText }}
            </div>
          </div>
        </div>
        <div>
          <div
            class="btn btn-secondary"
            @click="
              () => {
                $refs.teamfindMember.openModal();
              }
            "
          >
            新增球員
          </div>
        </div>
      </div>
      <ModalBase :footHidden="true" :headerHidden="true" ref="teamModifyForm">
        <TeamModifyForm
          :form="teamInfo.data"
          @closeTeamModifyModal="closeTeamModifyModal"
        />
      </ModalBase>
      <ModalBase :footHidden="true" :headerHidden="true" ref="teamfindMember">
        <TeamFindMember
          :teamID="teamID"
          @closeTeamModifyModal="closeTeamModifyModal"
        />
      </ModalBase>
    </div>
  </div>
</template>

<script>
import TeamModifyForm from "~/components/team/TeamModifyForm";
import TeamFindMember from "~/components/team/TeamFindMember";
import ModalBase from "~/components/modal/ModalBase";

export default {
  components: {
    TeamModifyForm,
    ModalBase,
    TeamFindMember,
  },
  data() {
    return {
      teamInfo: {
        data: "",
        isLoading: false,
      },
      teamID: "",
    };
  },
  async mounted() {
    const id = this.$route.params.id;
    this.teamID = id;
    this.getTeamInfo(id);
  },
  methods: {
    async getTeamInfo(id) {
      try {
        this.teamInfo.isLoading = true;
        const res = await this.$api.getTeamList({ teamID: id });
        this.teamInfo.data = res[0];
      } catch (err) {
      } finally {
        this.teamInfo.isLoading = false;
      }
    },
    openTeamModifyModal() {
      this.$refs.teamModifyForm.openModal();
    },
    closeTeamModifyModal(newTeamInfo) {
      this.teamInfo.data = { ...this.teamInfo.data, ...newTeamInfo };
      this.$refs.teamModifyForm.hideModal();
    },
  },
};
</script>

<style></style>
