<template>
  <b-modal
    ref="cp-modal-form"
    :title="title"
    no-close-on-backdrop
    no-close-on-esc
    hide-header-close
    @cancel="discardChanges"
    @ok="confirm"
    :scrollable="scrollable"
    :size="size"
  >
    <slot />
  </b-modal>
</template>

<script>
export default {
  props: {
    ok: {
      type: Function,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    $v: {
      required: true
    },
    size: {
      type: String,
      default: null
    },
    scrollable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  methods: {
    async discardChanges(bvModalEvt) {
      if (this.discardLock) {
        return;
      }
      if (this.$v.$anyDirty) {
        bvModalEvt.preventDefault();
        this.discardLock = true;
        const confirm = await this.$bvModal.msgBoxConfirm(
          `Descartar alterações?`,
          {
            id: "confirmDialog",
            noCloseOnBackdrop: true,
            noCloseOnEsc: true,
            okVariant: "danger",
            okTitle: "Sim",
            cancelTitle: "Não"
          }
        );
        this.discardLock = false;
        if (!confirm) {
          return;
        }
        this.$v.$reset();
        this.$refs["cp-modal-form"].hide();
      }
    },
    async confirm(bvModalEvt) {
      try {
        this.$v.$touch();
        if (!this.$v.$invalid) {
          await this.ok();
          this.$v.$reset();
        } else {
          bvModalEvt.preventDefault();
        }
      } catch (error) {
        this.$bvToast.toast(
          error.data ? error.data.message || error.data : error.statusText,
          {
            title: "Erro",
            variant: "danger",
            solid: true
          }
        );
      }
    },
    show() {
      this.$refs["cp-modal-form"].show();
    }
  }
};
</script>