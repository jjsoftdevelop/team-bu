<template>
  <div class="teamPostFormBlock">
    <label
      for="uploadFiles"
      class="pointer teamPostFormBlock--uploadArea position-relative"
    >
      <img
        class="position-absolute position-Y-center position-X-center"
        src="~/assets/img/svg/upload_img_icon.svg"
        alt=""
      />
      <input
        ref="uploadFiles"
        class="d-none"
        id="uploadFiles"
        type="file"
        @change="uploadFiles"
        name="uploadBox"
        multiple
        accept="image/png, image/jpeg"
      />
    </label>
    <div class="row">
      <div class="col-3" v-for="item in this.postInfo.files" :key="item.key">
        <div @click="removeFile(item.key)">
          <b-img
            height="100"
            class="img-cover w-100"
            :src="item.preview"
          ></b-img>
        </div>
      </div>
    </div>
    <div class="mt-3">
      <b-form-textarea
        class="teamPostFormBlock--textarea"
        id="textarea"
        v-model="postInfo.content"
        placeholder="加上解說..."
      ></b-form-textarea>
    </div>
    <LineBlock class="my-3" />
    <div class="teamPostFormBlock--tagInput">
      <b-form-tags
        placeholder="# 標註"
        tag-pills
        tag-variant="secondary"
        input-id="tags-basic"
        v-model="postInfo.tags"
      ></b-form-tags>
    </div>
    <div class="d-flex justify-content-center mt-3">
      <b-button
        :disabled="
          postInfo.files.length === 0 ||
          postInfo.content === '' ||
          postInfo.tags.length === 0
        "
        class="btn-l"
        variant="success"
        pill
        @click="addPost"
        >送出</b-button
      >
    </div>
  </div>
</template>

<script>
import LineBlock from "~/components/common/LineBlock";

export default {
  components: { LineBlock },
  props: {
    teamID: {
      type: String,
      default: "",
    },
  },
  mounted() {},
  data() {
    return {
      postInfo: {
        files: [],
        content: "",
        tags: [],
      },
    };
  },
  methods: {
    addPost() {
      this.$emit("addPost", this.postInfo);
    },
    uploadFiles(event) {
      const files = event.target.files;
      if (files.length > 4) {
        this.$showToast({ content: "最多上傳四個檔案唷！" });
        return;
      }
      const fileArr = [];
      Array.from(files, async (file, index) => {
        fileArr.push({
          key: index,
          data: file,
          preview: URL.createObjectURL(file),
        });
      });
      this.postInfo.files = fileArr;
    },
    removeFile(key) {
      this.postInfo.files.splice(key, 1);
    },
  },
};
</script>

<style scoped lang="scss">
.teamPostFormBlock {
  &--uploadArea {
    background: $Success-200;
    height: 160px;
    width: 100%;
  }
  &--textarea {
    border: 0px;
  }
  &--tagInput {
    ::v-deep .form-control {
      padding: 4px 10px;
      border: 0px;
    }
  }
}
</style>
