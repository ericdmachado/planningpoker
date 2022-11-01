<template>
  <div class="spinner">
    <b-icon class="has-text-info" :size="tamanho" icon="loading" />
    <b-icon class="has-text-warning" :size="tamanho" icon="loading" />
    <b-icon class="has-text-danger" :size="tamanho" icon="loading" />
    <b-icon class="has-text-success" :size="tamanho" icon="loading" />
    <b-icon class="transparent" :size="tamanho" icon="loading" />
  </div>
</template>

<script>
export default {
  name: "Spinner",
  data() {
    return {
      tamanho: this.size,
    };
  },
  props: {
    size: {
      type: [String],
      default: "",
      required: false,
      useDefaultForNull: true,
    },
  },
  watch: {
    size(value) {
      this.tamanho = value;
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  display: inline-block;
  position: relative;
  vertical-align: middle;
  margin: 0.4rem;

  span {
    &:not(.transparent) {
      animation-name: spin;
      animation-name: spin;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
      position: absolute;
      left: 0;
      top: 0;
    }

    &.transparent {
      position: static;
      opacity: 0;
    }
  }
  .has-text-success {
    animation-duration: 1.2s;
  }
  .has-text-danger {
    animation-duration: 1s;
  }
  .has-text-warning {
    animation-duration: 0.8s;
  }
  .has-text-info {
    animation-duration: 0.6s;
  }
}
</style>
