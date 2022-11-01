<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Acesse uma partida</p>
      <b-button
        @click="$emit('close')"
        type="is-text"
        size="is-small"
        inverted
        icon-right="close"
      />
    </header>
    <section class="modal-card-body">
      <b-field label="Código da sala">
        <input
          class="input"
          v-model="room"
          :min="0"
          :max="999999"
          maxlength="6"
          @input="onValueChanged"
        />
        <p class="has-text-danger" v-if="errorDescription">{{errorDescription}}</p>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <b-button
        label="Acessar"
        expanded
        type="is-primary is-raised"
        :disabled="isValidChannel"
        @click="gotoRoomNumber"
      />
    </footer>
  </div>
</template>

<script>
import { get } from 'lodash'

export default {
  name: "GoRoomModal",
  props: {
    roomnumber: [Number, String, Object],
    max: [Number, String, Object],
    min: [Number, String, Object]
  },
  data() {
    return {
      room: this.roomnumber,
      errorDescription: '',
      isValidChannel: true
    };
  },
  methods: {
    gotoRoomNumber() {
      this.$emit("close", this.room);
    },
    onValueChanged( evt ) {
      this.room = evt.target.value.replace(/[^0-9]/g, '');
      this.errorDescription = this.room.length < 6 ? 'Necessário 6 dígitos numéricos' : '';
      this.isValidChannel = get(this, 'room.length', 0) < 6;
      this.$forceUpdate();
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-card {
  max-width: 350px;

  input{
    text-align: center;
    border: 0 none;
    letter-spacing: 1rem;
    font-weight: bold;
  }

  p.has-text-danger{
    font-size: 0.7rem;
    margin-top: 4px;
    margin-left: 4px;
    font-weight: bold;
  }
}
</style>
