<template>
   <div class="gamename" v-if="name">
    <span v-if="!isLink">- {{ name }}</span>
    <a :href="name" v-if="isLink" target="_blank"
      ><span class="has-text-black">-</span> {{ name }}</a
    >
  </div>
</template>
<script>
export default {
  name: "GameName",
  props: {
    name: [String, Boolean],
  },
  computed: {
    isLink() {
      return !!this.name.match(/http/gi);
    },
  },
};
</script>
<style lang="scss" scoped>
.gamename {
  display: inline-block;

  a:hover {
    @extend .has-text-info;
    font-weight: inherit;
  }
  .has-text-black {
    color: var(--default-text-color) !important;
  }
}
</style>