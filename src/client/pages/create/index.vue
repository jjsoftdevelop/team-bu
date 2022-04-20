<template>
  <div>
    <div @click="teamCreate" style="cursor: pointer">創建球隊</div>
  </div>
</template>

<script>
// category 球種
// 1:棒球 2:壘球 3:籃球 4:排球 5:足球 6:羽球
// rank 年齡型態
// 1:12歲以下 2:12~18歲 3:18歲以上 4:國小 5:國中 6:高中/高職 7:大學/大專
// type 球隊型態
// 1.業餘 2.校隊
export default {
  data() {
    return {
      createInfo: {
        name: "後港傭兵",
        logoUrl: "",
        bannerUrl: "",
        description: "",
        categoryID: 1,
        typeID: 1,
        rankID: 3,
        leagueTag: "大漢聯盟,測試",
        city: "台北市",
      },
    };
  },
  methods: {
    async teamCreate() {
      console.log(this.createInfo);
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
  },
};
</script>

<style></style>
