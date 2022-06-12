<template>
  <div class="teamFindBlock">
    <div v-if="step === STEP_INFO.START">
      <h5 class="text-info text-center">請選擇你要</h5>
      <div class="d-flex justify-content-center py-6">
        <div
          @click="step = STEP_INFO.CREATE_CATEGORY"
          class="teamFindBlock--btn px-6 px-md-10 py-2 grey text-center normal-border-radius mr-4"
        >
          <div class="mb-2">
            <img src="~/assets/img/svg/create_team_icon.svg" alt="" />
          </div>
          <div class="text-info text-s font-weight-bold">創建球隊</div>
        </div>
        <div
          @click="step = STEP_INFO.FIND_CATEGORY"
          class="teamFindBlock--btn px-6 px-md-10 py-2 grey text-center normal-border-radius"
        >
          <div class="mb-2">
            <img src="~/assets/img/svg/find_team_icon.svg" alt="" />
          </div>
          <div class="text-info text-s font-weight-bold">找尋球隊</div>
        </div>
      </div>
    </div>
    <div v-if="step === STEP_INFO.CREATE_CATEGORY">
      <h5 class="text-info text-center mb-4">哪種運動類型</h5>
      <div class="teamFindBlock--wrap p-2 mb-3">
        <div class="row">
          <div
            @click="handleCate(key)"
            v-for="(item, key) in sportCate"
            :key="key"
            class="col-6 col-md-3 my-2"
          >
            <div
              class="teamFindBlock--btn white text-center normal-border-radius add-shadow p-4"
            >
              <img
                class="mb-1"
                width="24"
                height="24"
                :src="
                  item.iconSrc
                    ? require(`~/assets/img/svg/${item.iconSrc}.svg`)
                    : ''
                "
                alt=""
              />
              <div class="text-s text-success font-weight-bold">
                {{ item.text }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <b-button
          @click="step = STEP_INFO.START"
          class="px-6 btn-sm btn btn-light text-info font-weight-bold"
          pill
        >
          上一步
        </b-button>
      </div>
    </div>
    <div v-if="step === STEP_INFO.CREATE_FORM">
      <h5 class="text-center text-info">球隊資料</h5>
      <div>
        <div class="mb-6">
          <label class="text-info" for="">隊名</label>
          <div>
            <b-form-input
              v-model="createInfo.name"
              placeholder="輸入隊名"
              autocomplete="off"
              class="text-success"
            ></b-form-input>
          </div>
        </div>
        <div class="mb-6">
          <label class="text-info" for="">球隊類型</label>
          <div class="d-flex">
            <b-form-radio
              @change="handleRank"
              class="text-grey mr-2"
              v-model="createInfo.typeID"
              v-for="item in type"
              :key="item.value"
              :value="item.value"
              >{{ item.text }}</b-form-radio
            >
          </div>
        </div>
        <div class="mb-6">
          <label class="text-info" for="">球員平均年齡</label>
          <b-form-select
            v-model="createInfo.rankID"
            :options="rank"
          ></b-form-select>
        </div>
        <div class="mb-6">
          <label class="text-info" for="">地區</label>
          <b-form-select
            v-model="createInfo.city"
            :options="city"
          ></b-form-select>
        </div>
        <div class="d-flex justify-content-center">
          <b-button
            @click="step = STEP_INFO.CREATE_CATEGORY"
            class="px-6 btn-sm btn btn-light text-info font-weight-bold mr-6"
            pill
          >
            上一步
          </b-button>
          <b-button
            :disabled="!createInfo.name || !createInfo.city"
            class="btn-sm"
            variant="success"
            pill
            @click="teamCreate"
            >創建球隊</b-button
          >
        </div>
      </div>
    </div>
    <div v-if="step === STEP_INFO.FIND_CATEGORY">
      <h5 class="text-info text-center mb-4">哪種運動類型</h5>
      <div class="teamFindBlock--wrap p-2 mb-3">
        <div class="row">
          <div
            @click="
              () => {
                (findInfo.categoryID = key),
                  (step = STEP_INFO.FIND_FORM),
                  (teamList.data = []);
              }
            "
            v-for="(item, key) in sportCate"
            :key="key"
            class="col-6 col-md-3 my-2"
          >
            <div
              class="teamFindBlock--btn white text-center normal-border-radius add-shadow p-4"
            >
              <img
                class="mb-1"
                width="24"
                height="24"
                :src="
                  item.iconSrc
                    ? require(`~/assets/img/svg/${item.iconSrc}.svg`)
                    : ''
                "
                alt=""
              />
              <div class="text-s text-success font-weight-bold">
                {{ item.text }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <b-button
          @click="step = 'start'"
          class="px-6 btn-sm btn btn-light text-info font-weight-bold"
          pill
        >
          上一步
        </b-button>
      </div>
    </div>
    <div v-if="step === STEP_INFO.FIND_FORM">
      <h5 class="text-info text-center mb-4">找尋球隊</h5>
      <b-input-group class="mb-4">
        <b-form-input
          v-model="findInfo.name"
          type="text"
          placeholder="請輸入球隊名稱"
        ></b-form-input>
        <b-input-group-append>
          <b-button style="height: 35px" variant="success" @click="getTeamList"
            >搜尋</b-button
          >
        </b-input-group-append>
      </b-input-group>
      <div class="teamFindBlock--wrap p-2 mb-3" style="height: 145px">
        <div
          v-if="teamList.isInitial && !teamList.isLoading"
          class="text-s text-info mb-2"
        >
          共 {{ teamList.data.length }} 筆資料
        </div>
        <div class="row">
          <div
            v-for="(team, index) in teamList.data"
            :key="index"
            class="col-12 col-md-6 mb-3"
          >
            <TeamCard
              @clickAction="
                handleSelectTeam(
                  team.pid,
                  team.teamMemberLevelID,
                  team.teamMemberStatusID
                )
              "
              :team="team"
            />
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <b-button
          @click="step = 'findCategory'"
          class="px-6 btn btn-sm btn-light text-info font-weight-bold"
          pill
        >
          上一步
        </b-button>
      </div>
    </div>
    <div v-if="step === STEP_INFO.SELECT_ROLE">
      <h5 class="text-info text-center mb-4">申請成為球隊</h5>
      <div class="d-flex justify-content-center py-6">
        <div
          v-for="(item, key) in roleCate"
          :key="key"
          @click="teamJoinInfo.teamMemberLevelID = Number(key)"
          :class="[
            'teamFindBlock--btn mr-3 px-6 px-md-10 py-2 grey text-center normal-border-radius',
            { active: teamJoinInfo.teamMemberLevelID === Number(key) },
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
          @click="step = 'findForm'"
          class="px-6 btn btn-sm btn-light text-info font-weight-bold mr-6"
          pill
        >
          上一步
        </b-button>
        <b-button
          class="btn-sm"
          :disabled="!teamJoinInfo.teamMemberLevelID"
          variant="success"
          pill
          @click="handleJoin"
          >送出申請</b-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import TeamCard from "~/components/home/TeamCard";
// category 球種
// 1:棒球 2:壘球 3:籃球 4:排球 5:足球 6:羽球
// rank 年齡型態
// 1:12歲以下 2:12~18歲 3:18歲以上 4:國小 5:國中 6:高中/高職 7:大學/大專
// type 球隊型態
// 1.業餘 2.校隊
export default {
  components: {
    TeamCard,
  },
  props: {
    sportCate: {
      type: Object,
      default: () => {},
    },
    roleCate: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState(["user"]),
  },

  data() {
    return {
      STEP_INFO: {
        START: "start",
        CREATE_CATEGORY: "createCategory",
        CREATE_FORM: "createForm",
        FIND_CATEGORY: "findCategory",
        FIND_FORM: "findForm",
        SELECT_ROLE: "selectRole",
      },
      step: "start",
      showMemberLevel: false,
      teamJoinInfo: {
        teamID: null,
        memberID: null,
        picture: "",
        teamMemberLevelID: 1,
        type: "join",
      },
      createInfo: {
        name: "",
        logoUrl: "",
        bannerUrl: "",
        description: "",
        categoryID: null,
        typeID: 1,
        rankID: 1,
        leagueTag: "",
        city: null,
      },
      findInfo: {
        categoryID: null,
        name: "後港傭兵",
      },
      type: [
        { value: 1, text: "業餘" },
        { value: 2, text: "校隊" },
      ],
      rank: [
        { value: 1, text: "12歲以下" },
        { value: 2, text: "12~18歲" },
        { value: 3, text: "18歲以上" },
      ],
      city: [
        { value: null, text: "請選擇地區", disabled: true },
        { value: "宜蘭縣", text: "宜蘭縣" },
        { value: "基隆市", text: "基隆市" },
        { value: "台北市", text: "台北市" },
        { value: "新北市", text: "新北市" },
        { value: "桃園市", text: "桃園市" },
        { value: "新竹市", text: "新竹市" },
        { value: "新竹縣", text: "新竹縣" },
        { value: "苗栗縣", text: "苗栗縣" },
        { value: "台中市", text: "台中市" },
        { value: "彰化縣", text: "彰化縣" },
        { value: "南投縣", text: "南投縣" },
        { value: "雲林縣", text: "雲林縣" },
        { value: "嘉義市", text: "嘉義市" },
        { value: "嘉義縣", text: "嘉義縣" },
        { value: "台南市", text: "台南市" },
        { value: "高雄市", text: "高雄市" },
        { value: "屏東縣", text: "屏東縣" },
        { value: "花蓮縣", text: "花蓮縣" },
        { value: "台東縣", text: "台東縣" },
        { value: "金門縣", text: "金門縣" },
        { value: "連江縣", text: "連江縣" },
        { value: "澎湖縣", text: "澎湖縣" },
      ],
      teamList: {
        isInitial: false,
        data: [],
        isLoading: false,
      },
    };
  },
  methods: {
    async teamCreate() {
      try {
        const {
          name,
          logoUrl,
          bannerUrl,
          description,
          categoryID,
          typeID,
          rankID,
          leagueTag,
          city,
        } = this.createInfo;

        await this.$api.teamCreate({
          name,
          logoUrl,
          bannerUrl,
          description,
          categoryID,
          typeID,
          rankID,
          leagueTag,
          city,
        });
        this.$showToast({
          content: "創建成功！",
          title: "訊息",
          variant: "success",
        });
        this.$emit("getMyTeam");
        this.$emit("closeModal");
      } catch (err) {
        this.$showToast({
          content: "創建失敗！",
          title: "訊息",
          variant: "danger",
        });
        console.log(err);
        return err;
      }
    },
    handleRank() {
      if (this.createInfo.typeID === 1) {
        this.rank = [
          { value: 1, text: "12歲以下" },
          { value: 2, text: "12~18歲" },
          { value: 3, text: "18歲以上" },
        ];
        this.createInfo.rankID = 1;
      } else {
        this.rank = [
          { value: 4, text: "國小" },
          { value: 5, text: "國中" },
          { value: 6, text: "高中/高職" },
          { value: 7, text: "大學/大專" },
        ];
        this.createInfo.rankID = 4;
      }
    },
    handleCate(id) {
      this.createInfo.categoryID = Number(id);
      this.step = "createForm";
    },
    async getTeamList() {
      try {
        this.teamList.isInitial = true;
        this.teamList.isLoading = true;
        const { name, categoryID } = this.findInfo;
        const data = await this.$api.getTeamList({
          name: this.$encodeBase64(name),
          categoryID,
        });
        this.teamList.data = data;
      } catch (err) {
        console.log(err);
      } finally {
        this.teamList.isLoading = false;
      }
    },
    async handleJoin() {
      const { teamID, teamMemberLevelID, type } = this.teamJoinInfo;
      try {
        this.$api.teamJoin({
          teamID,
          memberID: this.user.pid,
          picture: this.user.picture,
          teamMemberLevelID,
          type,
        });
        this.$showToast({
          content: "申請成功！",
          title: "訊息",
          variant: "success",
        });
        this.$emit("getMyTeam");
        this.$emit("closeModal");
      } catch (err) {
        this.$showToast({
          content: "申請失敗！",
          title: "訊息",
          variant: "danger",
        });
        console.log(err);
      }
    },
    handleSelectTeam(TeamID, teamMemberLevelID, teamMemberStatusID) {
      if (
        teamMemberLevelID &&
        teamMemberStatusID !== 4 &&
        teamMemberStatusID !== 9
      ) {
        this.$showToast({ content: "已在球隊名單囉！", title: "訊息" });
        return;
      }
      this.step = this.STEP_INFO.SELECT_ROLE;
      this.teamJoinInfo.teamID = TeamID;
    },
  },
};
</script>
