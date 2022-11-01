<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Configuração do jogo</p>
      <b-button
        @click="$emit('close')"
        type="is-text"
        size="is-small"
        inverted
        icon-right="close"
      />
    </header>
    <section class="modal-card-body">
      <b-field label="Nome da partida">
        <b-input type="text" v-model="name"> </b-input>
      </b-field>
      <b-field>
        <b-switch type="is-success" class="mt-3" v-model="change">
          Alterar ao reiniciar a votação?
        </b-switch>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <b-button
        label="Salvar"
        expanded
        type="is-primary is-raised"
        @click="saveSettings"
      />
    </footer>
  </div>
</template>

<script>
export default {
  name: "ConfigModal",
  props: {
    gamename: [String, Object],
    changeOnRestart: [String, Boolean],
  },
  data() {
    return {
      name: this.gamename,
      change: false,
    };
  },
  methods: {
    saveSettings() {
      this.$emit("close", {
        name: this.name,
        changeOnRestart: this.change,
      });
    },
  },
  created() {
    this.change = this.changeOnRestart;
  },
};
</script>

<style lang="scss" />
