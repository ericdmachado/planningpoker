<template>
  <div class="version is-hidden-mobile">
    Version: {{ version }}
  </div>
</template>
<script>
import Project from "../../package.json"

export default {
  name: "Version",
  data() {
    return {
      version: "",
    };
  },
  created() {
    this.version = Project.version;
  },
};
</script>
<style lang="scss" scoped>
.version {
  color: var(--default-text-color);
  font-size: 11px;
  padding: 2px 6px;
  height: 20px;
  position: fixed;
  left: 10px;
  bottom: 20px;
  width: auto;
  z-index: 30;

  @media (max-height: 680px){
    display: none;
  }
}
</style>