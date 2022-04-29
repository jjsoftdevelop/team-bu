<template>
  <b-modal
    ref="modal"
    centered
    :no-close-on-backdrop="noBackdropClose"
    scrollable
    :modal-class="modalClass"
    :dialog-class="dialogClass"
    header-class="border-0"
    footer-class="d-flex border-0 justify-content-center"
    @hidden="onHidden"
    :hide-footer="footHidden"
    :hide-header="headerHidden"
  >
    <template v-slot:modal-header>
      <h4 :class="['header-text w-100', titleClass]">{{ modalTitle }}</h4>
      <i
        class="btn-close jb_icon_delete pointer"
        @click.prevent="hideModal"
      ></i>
    </template>
    <template><slot /></template>
    <template v-slot:modal-footer>
      <button
        v-if="!hideCancelBtn"
        class="btn btn-outline--primary"
        @click="hideModal"
      >
        {{ cancelButton }}
      </button>
      <button
        class="btn btn--primary"
        :data-gtm-btn="submitGtm"
        @click="okClick"
      >
        {{ submitButton }}
      </button>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: "ModalBase",
  props: {
    modalClass: { type: String, default: "" },
    dialogClass: { type: String, default: "" },
    modalTitle: { type: String, default: "" },
    cancelButton: { type: String, default: "取消" },
    submitButton: { type: String, default: "送出" },
    hideCancelBtn: { type: Boolean, default: false },
    submitGtm: { type: String, default: "" },
    titleClass: { type: String, default: "" },
    footHidden: { type: Boolean, default: false },
    headerHidden: { type: Boolean, default: false },
    noBackdropClose: { type: Boolean, default: false },
  },
  data() {
    return {
      resovle: undefined,
      value: false,
    };
  },
  methods: {
    openModal() {
      this.value = false;
      const _this = this;
      if (this.$refs.modal) {
        this.$refs.modal.show();
      }
      // eslint-disable-next-line promise/param-names
      return new Promise((resovle) => {
        _this.resovle = resovle;
      });
    },
    hideModal() {
      if (this.$refs.modal) {
        this.value = false;
        this.$refs.modal.hide();
      }
    },
    okClick() {
      if (this.$refs.modal) {
        this.value = true;
        this.$refs.modal.hide();
      }
    },
    onHidden(e) {
      if (this.resovle) {
        this.resovle(this.value);
        this.resovle = undefined;
      }
    },
  },
};
</script>

<style scoped></style>
