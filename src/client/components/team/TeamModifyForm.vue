<template>
  <div>
    <div v-if="modifyInfo">
      <div class="position-relative mb-2">
        <b-img
          :src="bannerFile.preview ? bannerFile.preview : modifyInfo.bannerUrl"
          class="w-100"
          height="300"
          alt=""
          style="object-fit: container"
        ></b-img>
        <label
          class="pointer position-absolute d-flex justify-content-center align-items-center"
          style="
            width: 28px;
            height: 28px;
            bottom: 10px;
            right: 10px;
            border-radius: 50%;
            background: black;
          "
          for="uploadBannerFile"
          ><svg
            width="14"
            height="12"
            viewBox="0 0 14 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.75 2.75V11.25H13.25V2.75H10.25L8.75 0.75H5.25L3.75 2.75H0.75Z"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </label>
        <div class="d-none">
          <input
            id="uploadBannerFile"
            type="file"
            @change="uploadBannerFile"
            name="uploadBox"
            accept="image/png, image/jpeg"
          />
        </div>
        <div
          class="position-absolute"
          style="left: 50%; top: 50%; transform: translate(-50%, -50%)"
        >
          <div class="position-relative mr-2">
            <label
              class="pointer position-absolute d-flex justify-content-center align-items-center"
              style="
                width: 28px;
                height: 28px;
                bottom: 0px;
                right: 0px;
                border-radius: 50%;
                background: black;
              "
              for="uploadLogoFile"
              ><svg
                width="14"
                height="12"
                viewBox="0 0 14 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.75 2.75V11.25H13.25V2.75H10.25L8.75 0.75H5.25L3.75 2.75H0.75Z"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </label>
            <div>
              <b-img
                :src="logoFile.preview ? logoFile.preview : modifyInfo.logoUrl"
                rounded="circle"
                width="80"
                height="80"
                alt=""
                style="object-fit: cover"
              ></b-img>
            </div>
            <div>
              <input
                class="d-none"
                id="uploadLogoFile"
                type="file"
                @change="uploadLogoFile"
                name="uploadBox"
                accept="image/png, image/jpeg"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="mb-2">
          <label for="">隊名</label>
          <div>
            <input type="text" v-model="modifyInfo.name" />
          </div>
        </div>
        <div class="mb-2">
          <label for="">選擇球隊類型</label>
          <b-form-select
            v-model="modifyInfo.typeID"
            :options="type"
            @change="handleRank"
          ></b-form-select>
        </div>
        <div class="mb-2">
          <label for="">球員平均年齡</label>
          <b-form-select
            v-model="modifyInfo.rankID"
            :options="rank"
          ></b-form-select>
        </div>
        <div class="mb-2">
          <label for="">地區</label>
          <b-form-select
            v-model="modifyInfo.city"
            :options="city"
          ></b-form-select>
        </div>
        <div>
          <b-button variant="info" @click="submit" class="mr-2">送出</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    this.modifyInfo = { ...this.form };
    this.handleRank();
  },
  data() {
    return {
      logoFile: {
        data: "",
        preview: "",
      },
      bannerFile: {
        data: "",
        preview: "",
      },
      modifyInfo: null,
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
    };
  },
  methods: {
    handleRank() {
      if (this.modifyInfo.typeID === 1) {
        this.rank = [
          { value: 1, text: "12歲以下" },
          { value: 2, text: "12~18歲" },
          { value: 3, text: "18歲以上" },
        ];
        this.modifyInfo.rankID = 1;
      } else {
        this.rank = [
          { value: 4, text: "國小" },
          { value: 5, text: "國中" },
          { value: 6, text: "高中/高職" },
          { value: 7, text: "大學/大專" },
        ];
        this.modifyInfo.rankID = 4;
      }
    },
    async submit() {
      let newLogoUrl, newBannerUrl;
      // 如果有上傳
      if (this.logoFile.data) {
        try {
          const { url } = await this.$api.uploadFile(this.logoFile.data);
          newLogoUrl = url;
        } catch (err) {
          newLogoUrl = "";
          alert(err);
        }
      }
      // 如果有上傳
      if (this.bannerFile.data) {
        try {
          const { url } = await this.$api.uploadFile(this.bannerFile.data);
          newBannerUrl = url;
        } catch (err) {
          newBannerUrl = "";
          alert(err);
        }
      }
      try {
        const {
          pid,
          name,
          logoUrl: oldLogoUrl,
          bannerUrl: oldBannerUrl,
          description,
          categoryID,
          typeID,
          rankID,
          leagueTag,
          city,
        } = this.modifyInfo;
        const res = await this.$api.teamModify({
          name,
          logoUrl: newLogoUrl ? newLogoUrl : oldLogoUrl,
          bannerUrl: newBannerUrl ? newBannerUrl : oldBannerUrl,
          description,
          categoryID,
          typeID,
          rankID,
          city,
          leagueTag,
          teamID: this.$encodeBase64(pid),
        });
        if (res.type === "1") {
          // 更新後的資料向外傳
          this.$emit("closeTeamModifyModal", res.data[0]);
        }
      } catch (err) {
        console.log(err);
      }
    },
    uploadLogoFile(event) {
      this.logoFile.data = event.target.files[0];
      this.logoFile.preview = URL.createObjectURL(this.logoFile.data);
    },
    uploadBannerFile(event) {
      this.bannerFile.data = event.target.files[0];
      this.bannerFile.preview = URL.createObjectURL(this.bannerFile.data);
    },
  },
};
</script>

<style></style>
