<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Mudar nome de exibição</p>
      <b-button
        @click="$emit('close')"
        type="is-text"
        size="is-small"
        inverted
        icon-right="close"
      />
    </header>
    <section class="modal-card-body">
      <b-field label="Seu nome">
        <b-input type="text" v-model="name"> </b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <b-button
        label="Salvar"
        expanded
        type="is-primary is-raised"
        @click="saveUsername"
      />
    </footer>
  </div>
</template>

<script>
export default {
  name: "UsernameModal",
  props: {
    username: [String, Object],
  },
  data() {
    return {
      name: this.username,
    };
  },
  methods: {
    saveUsername() {
      this.$emit("close", this.name);
    },
  },
};
</script>

<style lang="scss" />
