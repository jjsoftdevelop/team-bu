<template>
  <div class="teamInfoBlock">
    <div class="teamInfoBlock--banner">
      <div class="container p-0 d-flex justify-content-end position-relative">
        <div class="teamInfoBlock--info d-flex">
          <div>
            <b-img
              :src="teamInfo.data.logoUrl"
              rounded="circle"
              width="80"
              height="80"
              alt=""
              style="background: #fff"
              class="mr-8 img-cover"
            ></b-img>
          </div>
          <div>
            <div class="text-s">{{ teamInfo.data.teamMemberLevelText }}</div>
            <div class="mb-1">
              <div class="d-flex align-items-center">
                <span class="mb-0 mr-4 h3">{{ teamInfo.data.name }}</span>
                <span class="pointer text-light" @click="openTeamModifyModal"
                  ><svg
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.4003 3.3401L13.6603 0.600102C13.3027 0.264198 12.8341 0.0714609 12.3436 0.0585541C11.8532 0.0456473 11.3751 0.213471 11.0003 0.530102L2.0003 9.5301C1.67706 9.85607 1.4758 10.2833 1.4303 10.7401L1.0003 14.9101C0.986826 15.0566 1.00583 15.2042 1.05596 15.3425C1.10608 15.4808 1.1861 15.6063 1.2903 15.7101C1.38374 15.8028 1.49455 15.8761 1.61639 15.9259C1.73823 15.9756 1.86869 16.0009 2.0003 16.0001H2.0903L6.2603 15.6201C6.71709 15.5746 7.14433 15.3733 7.4703 15.0501L16.4703 6.0501C16.8196 5.68107 17.0084 5.18861 16.9953 4.68064C16.9822 4.17266 16.7682 3.69061 16.4003 3.3401ZM6.0803 13.6201L3.0803 13.9001L3.3503 10.9001L9.0003 5.3201L11.7003 8.0201L6.0803 13.6201ZM13.0003 6.6801L10.3203 4.0001L12.2703 2.0001L15.0003 4.7301L13.0003 6.6801Z"
                      fill="white"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <div class="d-flex mb-4">
              <b-img
                class="mr-1"
                :src="
                  teamInfo.data && teamInfo.data.categoryID
                    ? require(`~/assets/img/svg/${$transforSportIcon(
                        teamInfo.data.categoryID
                      )}.svg`)
                    : ''
                "
              ></b-img>
              <div class="text-s">
                {{ teamInfo.data.city }} / {{ teamInfo.data.typeText }} /
                {{ teamInfo.data.rankText }}
              </div>
            </div>
            <div class="d-flex">
              <div class="teamInfoBlock--avatar mr-4">
                <b-avatar rounded variant="outline-light">
                  <div
                    class="d-flex flex-column justify-content-center align-items-center"
                  >
                    <div class="h3 mb-0">50</div>
                    <div class="text-s">總成員</div>
                  </div>
                </b-avatar>
              </div>
              <div class="teamInfoBlock--avatar mr-4">
                <b-avatar rounded variant="outline-light">
                  <div
                    class="d-flex flex-column justify-content-center align-items-center"
                  >
                    <div class="h3 mb-0">50</div>
                    <div class="text-s">參與賽季</div>
                  </div>
                </b-avatar>
              </div>
              <div class="teamInfoBlock--avatar">
                <b-avatar rounded variant="outline-light">
                  <div
                    class="d-flex flex-column justify-content-center align-items-center"
                  >
                    <div class="h3 mb-0">50</div>
                    <div class="text-s">完成比賽</div>
                  </div>
                </b-avatar>
              </div>
            </div>
          </div>
        </div>
        <div class="teamInfoBlock--maskWrap">
          <div class="teamInfoBlock--mask"></div>
          <b-img
            class="teamInfoBlock--bannerImg"
            :src="teamInfo.data.bannerUrl"
            height="300"
            alt=""
          ></b-img>
        </div>
      </div>
    </div>
    <div class="teamInfoBlock--tabWrap d-flex justify-content-center">
      <div class="container">
        <div class="row text-s">
          <div
            :class="[
              'col teamInfoBlock--tab',
              { active: teamInfo.tab === TAB_INFO.MEMBER },
            ]"
            @click="handleTab(TAB_INFO.MEMBER)"
          >
            球隊成員
          </div>
          <div
            :class="[
              'col teamInfoBlock--tab',
              { active: teamInfo.tab === TAB_INFO.STAT },
            ]"
            @click="handleTab(TAB_INFO.STAT)"
          >
            數據
          </div>
          <div
            :class="[
              'col teamInfoBlock--tab',
              { active: teamInfo.tab === TAB_INFO.SEASON },
            ]"
            @click="handleTab(TAB_INFO.SEASON)"
          >
            賽季
          </div>
          <div
            :class="[
              'col teamInfoBlock--tab',
              { active: teamInfo.tab === TAB_INFO.POST },
            ]"
            @click="handleTab(TAB_INFO.POST)"
          >
            動態牆
          </div>
          <div
            :class="[
              'col teamInfoBlock--tab',
              { active: teamInfo.tab === TAB_INFO.ACCOUNTING },
            ]"
            @click="handleTab(TAB_INFO.ACCOUNTING)"
          >
            帳務管理
          </div>
        </div>
      </div>
    </div>
    <div v-if="teamInfo && teamInfo.data" class="container panel no-shadow">
      <div>
        <iframe width="300" height="300" src="https://mytalent.104.com.tw/"></iframe>
      </div>

      <div>
        <TeamMember
          @openTeamfindMemberModal="openTeamfindMemberModal"
          :memberdata="memberdata"
        />
      </div>
      <ModalBase :footHidden="true" :headerHidden="true" ref="teamModifyForm">
        <TeamModifyForm
          :form="teamInfo.data"
          @closeTeamModifyModal="closeTeamModifyModal"
        />
      </ModalBase>
      <ModalBase
        titleClass="text-info"
        modalTitle="新增球員"
        :footHidden="true"
        :headerHidden="false"
        :bodyCloseBtn="false"
        size="sm"
        ref="teamfindMember"
      >
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
import TeamMember from "~/components/team/TeamMember";
import ModalBase from "~/components/modal/ModalBase";

export default {
  components: {
    TeamModifyForm,
    ModalBase,
    TeamFindMember,
    TeamMember,
  },
  data() {
    return {
      teamInfo: {
        data: "",
        isLoading: false,
        tab: "",
      },
      teamID: "",
      TAB_INFO: {
        MEMBER: "member",
        STAT: "stat",
        SEASON: "season",
        POST: "post",
        ACCOUNTING: "accounting",
      },
      memberdata: {
        isLoading: false,
        list: [],
      },
    };
  },
  async mounted() {
    const id = this.$route.params.id;
    this.teamID = id;
    this.teamInfo.tab = this.$route.query.tab
      ? this.$route.query.tab
      : this.TAB_INFO.MEMBER;
    Promise.all([this.getTeamInfo(), this.getTeamMemberList()]);
  },
  methods: {
    async getTeamInfo() {
      try {
        this.teamInfo.isLoading = true;
        const res = await this.$api.getTeamList({ teamID: this.teamID });
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
    handleTab(tab) {
      this.teamInfo.tab = tab;
      this.$router.push({
        query: { ...this.$router.query, tab },
      });
    },
    async getTeamMemberList() {
      try {
        const res = await this.$api.getTeamMemberList({ teamID: this.teamID });
        this.memberdata.list = res;
      } catch (err) {
        console.log(err);
      }
    },
    openTeamfindMemberModal() {
      this.$refs.teamfindMember.openModal();
    },
  },
};
</script>

<style scoped lang="scss">
.teamInfoBlock {
  margin-top: -40px;
  &--banner {
    position: relative;
    background: #004556;
    &:after {
      @include lg {
        position: absolute;
        content: "";
        width: 100vw;
        height: 200px;
        top: 0;
        left: 0;
        background: #012f3a8c;
      }
    }
  }
  &--maskWrap {
    display: flex;
    justify-content: flex-end;
    position: relative;
    width: 900px;
    height: 300px;
    @include xl {
      width: 600px;
      height: 200px;
    }
    @include sm {
      width: 100%;
      height: 200px;
    }
  }
  &--mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        rgba(0, 69, 86, 0) 90.36%,
        #004556 100.15%
      ),
      linear-gradient(90deg, #004556 0.2%, rgba(0, 69, 86, 0) 19.52%);
  }
  &--bannerImg {
    width: 100%;
    width: 900px;
    object-fit: cover;

    @include xl {
      width: 600px;
      height: 200px;
    }
    @include sm {
      width: 100%;
      height: 200px;
    }
  }
  &--info {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translate(0%, -50%);
    z-index: 10;
    @include sm {
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  &--avatar {
    ::v-deep .b-avatar {
      width: 88px;
      height: 88px;
      border-radius: 16px !important;
      @include xl {
        width: 64px;
        height: 64px;
      }
    }
  }
  &--tabWrap {
    background: $Light-100;
  }
  &--tab {
    cursor: pointer;
    text-align: center;
    padding: 11px 0;
    background: $Light-100;
    color: $Dark-300;
    &.active {
      background: $Success-500;
      color: $Light;
    }
  }
  .h3 {
    @include xl {
      font-size: 20px;
      line-height: 30px;
      font-weight: 700;
    }
  }
  .text-s {
    @include xl {
      font-size: 12px;
      line-height: 16px;
    }
  }
}
</style>
