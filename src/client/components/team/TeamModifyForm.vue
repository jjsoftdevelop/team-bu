<template>
  <div>
    <div v-if="modifyInfo">
      <div class="position-relative mb-6">
        <b-img
          :src="bannerFile.preview ? bannerFile.preview : modifyInfo.bannerUrl"
          class="w-100 img-cover"
          height="200"
          alt=""
        ></b-img>
        <label
          class="pointer position-absolute d-flex justify-content-center align-items-center"
          style="
            width: 28px;
            height: 28px;
            bottom: 10px;
            right: 10px;
            border-radius: 50%;
          "
          @click="openCropperModal"
          ><svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12.9973" r="12" fill="#21B39A" />
            <path
              d="M5.75 9.74731V18.2473H18.25V9.74731H15.25L13.75 7.74731H10.25L8.75 9.74731H5.75Z"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 15.7473C13.2426 15.7473 14.25 14.74 14.25 13.4973C14.25 12.2547 13.2426 11.2473 12 11.2473C10.7574 11.2473 9.75 12.2547 9.75 13.4973C9.75 14.74 10.7574 15.7473 12 15.7473Z"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </label>
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
              "
              for="uploadLogoFile"
              ><svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12.9973" r="12" fill="#21B39A" />
                <path
                  d="M5.75 9.74731V18.2473H18.25V9.74731H15.25L13.75 7.74731H10.25L8.75 9.74731H5.75Z"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 15.7473C13.2426 15.7473 14.25 14.74 14.25 13.4973C14.25 12.2547 13.2426 11.2473 12 11.2473C10.7574 11.2473 9.75 12.2547 9.75 13.4973C9.75 14.74 10.7574 15.7473 12 15.7473Z"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </label>
            <div class="rounded-circle bg-light">
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
        <div class="mb-6">
          <label class="text-info" for="">球隊名稱</label>
          <div>
            <b-form-input
              v-model="modifyInfo.name"
              placeholder="輸入球隊名稱"
              autocomplete="off"
            ></b-form-input>
          </div>
        </div>
        <div class="mb-6">
          <label class="text-info" for="">選擇球隊類型</label>
          <b-form-select
            v-model="modifyInfo.typeID"
            :options="type"
            @change="handleRank"
          ></b-form-select>
        </div>
        <div class="mb-6">
          <label class="text-info" for="">球員平均年齡</label>
          <b-form-select
            v-model="modifyInfo.rankID"
            :options="rank"
          ></b-form-select>
        </div>
        <div class="mb-6">
          <label class="text-info" for="">地區</label>
          <b-form-select
            v-model="modifyInfo.city"
            :options="city"
          ></b-form-select>
        </div>
        <div class="d-flex justify-content-center">
          <b-button
            @click="
              () => {
                $emit('closeTeamModifyModal');
              }
            "
            class="px-6 btn-l btn btn-light text-info font-weight-bold mr-6"
            pill
          >
            取消
          </b-button>
          <b-button
            :disabled="!modifyInfo.name"
            class="btn-l"
            variant="success"
            pill
            @click="submit"
            >儲存</b-button
          >
        </div>
      </div>
    </div>
    <ModalBase
      :noBackdropClose="true"
      :footHidden="true"
      :headerHidden="true"
      ref="cropperModal"
    >
      <Cropper
        :imgSrc="form.bannerUrl"
        @getFileObj="getFileObj"
        @closeCropperModal="closeCropperModal"
      />
    </ModalBase>
  </div>
</template>

<script>
import ModalBase from "~/components/modal/ModalBase";
import Cropper from "~/components/common/Cropper";

export default {
  components: {
    ModalBase,
    Cropper,
  },
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
    };
  },
  methods: {
    getFileObj(file) {
      this.uploadBannerFile(file);
    },
    openCropperModal() {
      this.$refs.cropperModal.openModal();
    },
    closeCropperModal() {
      this.$refs.cropperModal.hideModal();
    },
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
        }
      }
      // 如果有上傳
      if (this.bannerFile.data) {
        try {
          const { url } = await this.$api.uploadFile(this.bannerFile.data);
          newBannerUrl = url;
        } catch (err) {
          newBannerUrl = "";
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
          teamID: pid,
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
      console.log(event.target.files[0]);
      this.logoFile.preview = URL.createObjectURL(this.logoFile.data);
    },
    uploadBannerFile(file) {
      this.bannerFile.data = file;
      this.bannerFile.preview = URL.createObjectURL(this.bannerFile.data);
    },
  },
};
</script>

<style></style>
