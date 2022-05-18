<template>
  <div class="panel container add-shadow normal-border-radius">
    <div class="d-flex justify-content-between">
      <div class="d-flex align-items-center">
        <span class="text-info h4 pr-2">我的球隊</span>
        <span class="text-success text-s"
          >共{{ myTeamData.list.length }}支</span
        >
      </div>
      <div
        @click="openTeamFind"
        class="position-fixed"
        style="bottom: 50px; right: 50px"
      >
        <b-avatar variant="success" class="pointer" icon="plus"></b-avatar>
      </div>
    </div>
    <div class="d-flex flex-wrap">
      <div
        v-show="item.list.length !== 0"
        @click="activeSport = key"
        :class="[
          'btn btn-secondary btn-switch btn-switch-sm rounded-pill pointer font-weight-bold text-xs text-success mr-2 mb-2',
          { disabled: activeSport !== key },
        ]"
        v-for="(item, key) in sportCate"
        :key="key"
      >
        <b-img
          width="16"
          height="16"
          class="mr-1"
          :src="
            item && item.iconSrc
              ? require(`~/assets/img/svg/${item.iconSrc}.svg`)
              : ''
          "
        ></b-img>
        {{ item.text }}
        {{ item.list.length }}
      </div>
    </div>
    <LineBlock class="pt-4 pb-6" />
    <div class="row">
      <div
        class="col-12 col-md-6 mb-4"
        v-show="team.categoryID === Number(activeSport)"
        v-for="team in myTeamData.list"
        :key="team.teamID"
      >
        <TeamCard
          :team="team"
          @clickAction="
            () => {
              $router.push(`/team/${team.teamID}`);
            }
          "
        />
      </div>
    </div>
    <ModalBase :footHidden="true" :headerHidden="true" ref="teamFind">
      <TeamFind
        :sportCate="sportCate"
        @closeModal="
          () => {
            $refs.teamFind.hideModal();
          }
        "
        @getMyTeam="getMyTeam"
      />
    </ModalBase>
  </div>
</template>

<script>
import TeamCard from "~/components/home/TeamCard";
import TeamFind from "~/components/home/TeamFind";
import ModalBase from "~/components/modal/ModalBase";
import LineBlock from "~/components/common/LineBlock";
import { sportCate } from "~/constants/sportCate";
export default {
  components: {
    TeamCard,
    TeamFind,
    ModalBase,
    LineBlock,
  },
  mounted() {
    this.getMyTeam();
    Object.assign(this.sportCate, sportCate);
  },
  data() {
    return {
      myTeamData: {
        list: [],
        isLoading: false,
      },
      sportCate: {},
      activeSport: "1",
    };
  },
  watch: {
    // 新增運動分類個別隊數
    "myTeamData.list": {
      deep: true,
      immediate: true,
      handler(nv, ov) {
        for (let i in this.sportCate) {
          this.sportCate[i]["list"] = [];
          nv.forEach((el) => {
            if (el.categoryID === Number(i)) {
              this.sportCate[i].list.push(el);
            }
          });
        }
      },
    },
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
    openTeamFind() {
      this.$refs.teamFind.openModal();
    },
  },
};
</script>

<style></style>
