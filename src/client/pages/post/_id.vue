<template>
  <div class="container">
    <div v-for="item in postData.list" :key="item.pid">
      <TeamPostCard
        @openTeamPostFormModal="openTeamPostFormModal"
        @handleEvent="handleEvent"
        :item="item"
      />
    </div>
    <ModalBase
      titleClass="text-info"
      modalTitle="新增貼文"
      :footHidden="true"
      :headerHidden="false"
      :bodyCloseBtn="false"
      size="sm"
      ref="teamPostForm"
    >
      <TeamPostForm @editPostApi="editPostApi" :editPost="editPost" />
    </ModalBase>
  </div>
</template>

<script>
import TeamPostCard from "~/components/team/TeamPostCard";
import ModalBase from "~/components/modal/ModalBase";
import TeamPostForm from "~/components/team/TeamPostForm";
import Vue from "vue";
export default {
  components: {
    ModalBase,
    TeamPostForm,
    TeamPostCard,
  },
  async mounted() {
    const postID = this.$route.params.id;
    try {
      let res = await this.$api.getPostSingle({ postID });
      res = res.filter(item => item.isDelete === 0)
      this.postData.list = res;
    } catch (err) {
      console.log(err);
    }
  },
  data() {
    return {
      postData: {
        isLoading: false,
        list: [],
      },
      editPost: { data: "" },
    };
  },
  methods: {
    openTeamPostFormModal(item) {
      this.editPost.data = item;
      this.$refs.teamPostForm.openModal();
    },
    async editPostApi(postInfo) {
      try {
        const { content, files, tags, postID } = postInfo;
        let filesArr = [];
        filesArr = await Promise.all(
          files.map(async (file) => {
            if (file && file.type && file.type === "new") {
              const { url } = await this.$api.uploadFile(file.data);
              return url;
            } else {
              return file.preview;
            }
          })
        );
        const res = await this.$api.editPost({
          postID,
          content,
          files: filesArr,
          tags,
        });
        const index = this.postData.list.findIndex(
          (item) => item.pid === postID
        );
        this.postData.list.splice(index, 1, res[0]);
        this.$showToast({
          content: "修改成功！",
          title: "訊息",
          variant: "success",
        });
        this.$refs.teamPostForm.hideModal();
      } catch (err) {
        console.log(err);
      }
    },
    async handleEvent(event, postID) {
      try {
        if (event === "clap") {
          await this.$api.addSocial({ postID });
          const index = this.postData.list.findIndex(
            (item) => item.pid === postID
          );
          const find = this.postData.list[index];
          Vue.set(find.socialData, "clap", !find.socialData.clap);
          Vue.set(
            find,
            "clapCount",
            find.socialData.clap ? find.clapCount + 1 : find.clapCount - 1
          );
        }
        if (event === "delete") {
          await this.$api.deletePost({ postID });
          const index = this.postData.list.findIndex(
            (item) => item.pid === postID
          );
          const find = this.postData.list[index];
          Vue.set(find, "isDelete", 1);
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style></style>
