<template>
  <b-tooltip
    :label="label"
    position="is-left"
    type="is-black"
  >
    <b-button
      rounded
      :class="isSpectator?'is-success':''" 
      @click="toggleSpectator">
        <b-icon icon="eye-off" />
      </b-button>
  </b-tooltip>
</template>

<script>
export default {
  name: "Spectator",
  components: {},
  props: {
    value: [Boolean],
    maxUser: [Boolean],
    change: [Function]
  },
  data() {
    return {
      isMaxUser: false,
      isSpectator: false
    };
  },
  created(){
    this.isSpectator = this.value;
  },
  methods: {
    toggleSpectator(){
      this.isSpectator = !this.isSpectator;
      this.$emit('change', this.isSpectator);
    }
  },
  computed:{
    label(){
      if(!this.isSpectator) return `Invisibilidade desativada`;
      return `Agora você está invisível na sala.`;
    },
    text(){
      return this.isSpectator?'Ativo': 'Inativo';
    }
  }
};
</script>

<style lang="scss" scoped>
.button {
  color: inherit;
  opacity: 0.8;
  padding: 0;
  width: 40px;
  height: 40px;
  overflow: hidden;
  border-color: transparent;

  .icon {
    position: relative;
    top: 1px;
  }

  &:not(.is-success){
    background-color: transparent;
  }

  &:hover,
  &:focus,
  &:active {
    opacity: 1;
    color: inherit;
  }

  .dark &{
    border-color: transparent;

    &:hover,
    &:focus,
    &:active {
      opacity: 1;
    }
  }
}
</style>