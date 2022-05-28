<template>
  <div class="teamPostAreaBlock text-info">
    <div
      class="panel pointer normal-border-radius p-2"
      @click="
        () => {
          $emit('openTeamPostFormModal');
        }
      "
    >
      <div class="teamPostAreaBlock--postBtn text-success">
        <b-icon icon="plus"></b-icon> <span>新增貼文</span>
      </div>
    </div>
    <LineBlock
      class="py-6 text-s w-100"
      textPos="left"
      textBg="bg-light-300"
      text="2022年"
    />
    <div class="mb-4" v-for="(item, index) in postData.list" :key="index">
      <TeamPostCard
        @addSocial="
          (postID) => {
            $emit('addSocial', postID);
          }
        "
        :item="item"
      />
    </div>
  </div>
</template>

<script>
import TeamPostCard from "~/components/team/TeamPostCard";
import LineBlock from "~/components/common/LineBlock";
import ModalBase from "~/components/modal/ModalBase";

export default {
  props: {
    teamID: {
      type: String,
      default: "",
    },
    postData: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    TeamPostCard,
    LineBlock,
    ModalBase,
  },
};
</script>

<style scoped lang="scss">
.teamPostAreaBlock {
  max-width: 600px;
  margin: 0 auto;
  &--postBtn {
    border: 2px dashed $Success-500;
    padding: 10px;
    background: $Light-100;
    text-align: center;
    font-weight: bold;
    border-radius: 8px;
  }
}
</style>
