<template>
  <div>
    <div v-if="step === 'start'">
      <h2>請選擇你要</h2>
      <b-button-group>
        <b-button variant="info" @click="step = 'createCategory'" class="mr-2"
          >創建球隊</b-button
        >
        <b-button variant="info" @click="step = 'findCategory'"
          >找尋球隊</b-button
        >
      </b-button-group>
    </div>
    <div v-if="step === 'createCategory'">
      <h2>哪種運動類型</h2>
      <b-button-group class="mb-2">
        <b-button
          v-for="item in categoryArr"
          :key="item.id"
          variant="info"
          class="mr-2"
          @click="handleCate(item.id)"
          >{{ item.text }}</b-button
        >
      </b-button-group>
      <div>
        <b-button @click="step = 'start'">上一步</b-button>
      </div>
    </div>
    <div v-if="step === 'createForm'">
      <h2>球隊基本資料</h2>
      <div>
        <div class="mb-2">
          <label for="">隊名</label>
          <div>
            <input type="text" v-model="createInfo.name" />
          </div>
        </div>
        <div class="mb-2">
          <label for="">選擇球隊類型</label>
          <b-form-select
            v-model="createInfo.typeID"
            :options="type"
            @change="handleRank"
          ></b-form-select>
        </div>
        <div class="mb-2">
          <label for="">球員平均年齡</label>
          <b-form-select
            v-model="createInfo.rankID"
            :options="rank"
          ></b-form-select>
        </div>
        <div class="mb-2">
          <label for="">地區</label>
          <b-form-select
            v-model="createInfo.city"
            :options="city"
          ></b-form-select>
        </div>
        <div>
          <b-button @click="step = 'createCategory'">上一步</b-button>
          <b-button variant="info" @click="teamCreate" class="mr-2"
            >創建球隊</b-button
          >
        </div>
      </div>
    </div>
    <div v-if="step === 'findCategory'">
      <h2>哪種運動類型</h2>
      <b-button-group class="mb-2">
        <b-button
          v-for="item in categoryArr"
          :key="item.id"
          variant="info"
          class="mr-2"
          @click="(findInfo.categoryID = item.id), (step = 'findForm')"
          >{{ item.text }}</b-button
        >
      </b-button-group>
      <div>
        <b-button @click="step = 'start'">上一步</b-button>
      </div>
    </div>
    <div v-if="step === 'findForm'">
      <label for="">找尋球隊名稱</label>
      <div class="d-flex mb-2">
        <input type="text" v-model="findInfo.name" class="mr-1" />
        <b-button variant="info" @click="getTeamList">搜尋</b-button>
      </div>
      <b-button-group class="mb-2">
        <b-button
          v-for="item in teamList.data"
          :key="item.pid"
          variant="info"
          class="mr-2"
          @click="(showMemberLevel = true), (teamJoinInfo.teamID = item.pid)"
          >{{ item.name }}<br />({{ item.city }})<br />({{
            item.nickname
          }})</b-button
        >
      </b-button-group>
      <div v-if="showMemberLevel">
        <b-form-group label="Individual radios" v-slot="{ ariaDescribedby }">
          <b-form-radio
            v-model="teamJoinInfo.teamMemberLevelID"
            :aria-describedby="ariaDescribedby"
            name="some-radios"
            value="1"
            >球員</b-form-radio
          >
          <b-form-radio
            v-model="teamJoinInfo.teamMemberLevelID"
            :aria-describedby="ariaDescribedby"
            name="some-radios"
            value="2"
            >粉絲</b-form-radio
          >
          <b-form-radio
            v-model="teamJoinInfo.teamMemberLevelID"
            :aria-describedby="ariaDescribedby"
            name="some-radios"
            value="3"
            >管理員</b-form-radio
          >
        </b-form-group>
      </div>
      <div class="d-flex">
        <b-button class="mr-2" @click="step = 'findCategory'">上一步</b-button>
        <b-button variant="success" v-if="showMemberLevel" @click="handleJoin"
          >送出申請</b-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
// category 球種
// 1:棒球 2:壘球 3:籃球 4:排球 5:足球 6:羽球
// rank 年齡型態
// 1:12歲以下 2:12~18歲 3:18歲以上 4:國小 5:國中 6:高中/高職 7:大學/大專
// type 球隊型態
// 1.業餘 2.校隊
export default {
  computed: {
    ...mapState(["user"]),
  },
  data() {
    return {
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
        city: "",
      },
      findInfo: {
        categoryID: null,
        name: "後港傭兵",
      },
      categoryArr: [
        { id: 1, text: "棒球" },
        { id: 2, text: "壘球" },
        { id: 3, text: "籃球" },
        { id: 4, text: "排球" },
        { id: 5, text: "足球" },
        { id: 6, text: "羽球" },
      ],
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
        { value: "台北市", text: "台北市" },
        { value: "新北市", text: "新北市" },
        { value: "台中市", text: "台中市" },
        { value: "高雄市", text: "高雄市" },
        { value: "台東市", text: "台東市" },
      ],
      teamList: {
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
      } catch (err) {
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
      this.createInfo.categoryID = id;
      this.step = "createForm";
    },
    async getTeamList() {
      try {
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
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style></style>
