<template>
  <div class="teamPostCard panel p-4">
    <div class="mb-4 d-flex justify-content-between align-items-center">
      <div class="d-flex">
        <b-img
          class="mr-2"
          rounded="circle"
          width="32"
          height="32"
          :src="
            item.picture
              ? item.picture
              : require('~/assets/img/anonymous-person-icon-18.jpg')
          "
        ></b-img>
        <div>
          <div class="text-m font-weight-bold text-dark">
            {{ item.nickname ? item.nickname : "匿名者" }}
          </div>
          <div class="text-grey-300 text-xs">
            <span class="pr-1">{{ dateFormat(item.createdate) }}</span
            ><span
              ><svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.25 11.25H9.75V9.375C9.74921 8.67905 9.47239 8.01183 8.98028 7.51972C8.48817 7.02761 7.82095 6.75079 7.125 6.75H4.875C4.17905 6.75079 3.51183 7.02761 3.01972 7.51972C2.52761 8.01183 2.25079 8.67905 2.25 9.375V11.25ZM3.375 3.375C3.375 3.89418 3.52895 4.40169 3.81739 4.83337C4.10583 5.26505 4.5158 5.6015 4.99546 5.80018C5.47511 5.99886 6.00291 6.05085 6.51211 5.94956C7.02131 5.84828 7.48904 5.59827 7.85616 5.23116C8.22327 4.86404 8.47328 4.39631 8.57456 3.88711C8.67585 3.37791 8.62386 2.85011 8.42518 2.37046C8.2265 1.8908 7.89005 1.48083 7.45837 1.19239C7.02669 0.903954 6.51918 0.75 6 0.75C5.30381 0.75 4.63613 1.02656 4.14384 1.51884C3.65156 2.01113 3.375 2.67881 3.375 3.375Z"
                  fill="#828282"
                />
              </svg>
              所有人
            </span>
          </div>
        </div>
      </div>
      <div class="pointer">
        <img src="~/assets/img/svg/more_tool_icon.svg" alt="" />
      </div>
    </div>
    <!-- 內容 -->
    <div>
      <div class="mb-2">
        <span class="text-m text-dark pre-wrap">{{ item.content }}</span>
      </div>
      <div v-if="item.tags" class="mb-2 d-flex">
        <div
          v-for="(item, index) in item.tags.split(',')"
          :key="index"
          class="text-success text-xs mr-2"
        >
          #{{ item }}
        </div>
      </div>
      <div class="row">
        <div
          @click="
            () => {
              $refs.teamPostFile.openModal();
              slide = index;
            }
          "
          v-for="(item, index) in item.files.split(',')"
          :key="index"
          class="col-3 pointer"
        >
          <b-img-lazy
            height="132px"
            class="img-cover w-100"
            style="max-height: 132px"
            :src="item"
          ></b-img-lazy>
        </div>
      </div>
      <div
        class="text-xs d-flex justify-content-between align-items-center py-2"
      >
        <div class="d-flex align-items-center">
          <img
            v-if="item.clapCount"
            class="pr-2"
            src="~/assets/img/svg/social_clap_icon.svg"
            alt=""
          /><span v-if="item.clapCount" class="text-grey"
            >{{ item && item.clapCount }}人</span
          >
        </div>
        <div class="d-flex align-items-center">
          <img
            class="pr-2"
            src="~/assets/img/svg/social_comment_icon.svg"
            alt=""
          /><span class="text-grey">3則留言</span>
        </div>
      </div>
    </div>
    <!-- 內容end -->
    <LineBlock />
    <div class="d-flex">
      <div
        :class="[
          'teamPostCard--socialItem col-4 text-s d-flex align-items-center justify-content-center text-grey',
          { active: item.socialData && item.socialData.clap },
        ]"
        @click="addSocial"
      >
        <svg
          class="pr-2"
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="20"
          viewBox="0 0 19 20"
          fill="none"
        >
          <path
            d="M18.2633 10.6472C18.657 10.1269 18.875 9.48937 18.875 8.82609C18.875 7.77374 18.2867 6.77765 17.3398 6.22218C17.0961 6.0792 16.8185 6.00395 16.5359 6.00421H10.9156L11.0563 3.12375C11.0891 2.42765 10.843 1.76672 10.3648 1.26281C10.1302 1.01444 9.84712 0.816825 9.53308 0.682182C9.21905 0.547539 8.88074 0.478727 8.53906 0.479998C7.32031 0.479998 6.24219 1.30031 5.91875 2.47453L3.90547 9.76359H0.875C0.460156 9.76359 0.125 10.0987 0.125 10.5136V19.0448C0.125 19.4597 0.460156 19.7948 0.875 19.7948H14.968C15.1836 19.7948 15.3945 19.7526 15.5891 19.6683C16.7047 19.1925 17.4242 18.1026 17.4242 16.8933C17.4242 16.598 17.382 16.3073 17.2977 16.0261C17.6914 15.5058 17.9094 14.8683 17.9094 14.205C17.9094 13.9097 17.8672 13.6191 17.7828 13.3378C18.1766 12.8175 18.3945 12.18 18.3945 11.5167C18.3898 11.2214 18.3477 10.9284 18.2633 10.6472ZM1.8125 18.1073V11.4511H3.71094V18.1073H1.8125ZM16.7281 9.8339L16.2148 10.2792L16.5406 10.8745C16.648 11.0706 16.7036 11.2908 16.7023 11.5144C16.7023 11.9011 16.5336 12.2691 16.243 12.5222L15.7297 12.9675L16.0555 13.5628C16.1628 13.7589 16.2185 13.9791 16.2172 14.2026C16.2172 14.5894 16.0484 14.9573 15.7578 15.2105L15.2445 15.6558L15.5703 16.2511C15.6776 16.4472 15.7333 16.6674 15.732 16.8909C15.732 17.4159 15.4227 17.8894 14.9445 18.105H5.21094V11.3761L7.54297 2.92687C7.6031 2.71031 7.73219 2.51925 7.91066 2.38264C8.08914 2.24604 8.30728 2.17133 8.53203 2.16984C8.71016 2.16984 8.88594 2.2214 9.02656 2.32687C9.25859 2.50031 9.38281 2.76281 9.36875 3.04171L9.14375 7.69171H16.5125C16.9297 7.94718 17.1875 8.37843 17.1875 8.82609C17.1875 9.2128 17.0188 9.57843 16.7281 9.8339Z"
            fill="#4F4F4F"
          />
        </svg>
        <span>讚</span>
      </div>
      <div
        class="teamPostCard--socialItem col-4 text-s d-flex align-items-center justify-content-center text-grey"
      >
        <svg
          class="pr-2"
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
        >
          <path
            d="M20 2.13522H5C3.62109 2.13522 2.5 3.25632 2.5 4.63522V15.8852C2.5 17.2641 3.62109 18.3852 5 18.3852H8.75V21.6665C8.75 21.9438 8.97656 22.1352 9.21875 22.1352C9.3125 22.1352 9.41016 22.1079 9.49609 22.0415L14.375 18.3852H20C21.3789 18.3852 22.5 17.2641 22.5 15.8852V4.63522C22.5 3.25632 21.3789 2.13522 20 2.13522ZM20.625 15.8852C20.625 16.229 20.3438 16.5102 20 16.5102H13.75L13.25 16.8852L10.625 18.854V16.5102H5C4.65625 16.5102 4.375 16.229 4.375 15.8852V4.63522C4.375 4.29147 4.65625 4.01022 5 4.01022H20C20.3438 4.01022 20.625 4.29147 20.625 4.63522V15.8852Z"
            fill="#4F4F4F"
          />
        </svg>
        <span>留言</span>
      </div>
      <div
        class="teamPostCard--socialItem col-4 text-s d-flex align-items-center justify-content-center text-grey"
      >
        <svg
          class="pr-2"
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="22"
          viewBox="0 0 25 25"
          fill="none"
        >
          <path
            d="M2.16602 11.1352L9.16602 2.13522V7.13522C21.119 7.13522 22.498 16.8132 22.166 22.1352C21.664 19.4502 21.431 15.1352 9.16602 15.1352V20.1352L2.16602 11.1352Z"
            stroke="#4F4F4F"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>分享</span>
      </div>
    </div>
    <ModalBase
      bodyClass="p-10"
      dialogClass="slideWrap"
      titleClass="text-info"
      :footHidden="true"
      :headerHidden="true"
      :bodyCloseBtn="true"
      size="sm"
      ref="teamPostFile"
      contentClass="bg-transparent border-0"
    >
      <b-carousel
        id="carousel-1"
        v-model="slide"
        :interval="4000"
        controls
        indicators
        background="transparent"
        contentClass="border-0 bg-transparent p-10"
        label-indicators="tset"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
      >
        <!-- Slides with image only -->
        <b-carousel-slide
          v-for="(item, index) in item.files.split(',')"
          :key="index"
          ><template #img>
            <img
              class="d-block img-fluid w-100 img-contain"
              width="800"
              height="460"
              :src="item"
              alt="image slot"
            /> </template
        ></b-carousel-slide>
      </b-carousel>
    </ModalBase>
  </div>
</template>

<script>
import LineBlock from "~/components/common/LineBlock";
import ModalBase from "~/components/modal/ModalBase";

export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    LineBlock,
    ModalBase,
  },
  data() {
    return {
      slide: 0,
      sliding: null,
    };
  },
  methods: {
    dateFormat(date) {
      const event = new Date(date);
      return event.toLocaleString(undefined, {
        dateStyle: "short",
        timeStyle: "short",
      });
    },
    async addSocial() {
      const postID = this.item.pid;
      this.$emit("addSocial", postID);
    },
    onSlideStart(slide) {
      this.sliding = true;
    },
    onSlideEnd(slide) {
      this.sliding = false;
    },
  },
};
</script>

<style scoped lang="scss">
.teamPostCard {
  &--socialItem {
    cursor: pointer;
    padding-top: 4px;
    padding-bottom: 4px;
    &.active {
      color: $Success-500;
      path {
        fill: $Success-500;
      }
    }
    &:hover {
      background: $Dark-200;
    }
  }
}
</style>
