<template>
  <div class="wrapper">
    <div class="hero">
      <Header
        :userName="user.name"
        :gameName="game.title"
        :userId="user.id"
        :isAdmin="user.admin"
        :spectator="user.spectator"
        :maxUser="user.maxUser"
      />
      <div class="hero-body p-0">
        <div class="container has-text-centered">
          <div
            class="columns is-mobile is-centered is-multiline is-vcentered"
          >
            <div class="column">
              <div class="waiting">
                <span v-if="!game.hasUsers"
                  ><Spinner size="is-small" />Aguardando jogadores</span
                >
              </div>
              <div
                class="
                  columns
                  is-mobile is-centered is-multiline is-vcentered
                  card-box
                "
              >
                <div
                  class="column is-narrow"
                  v-for="(_user, key) in getRegisteredUsers()"
                  :key="key"
                >
                  <Card
                    :color="_user.color"
                    :flip="game.reveal"
                    :value="_user.value"
                    :data-card-id="_user.id"
                    :label="get(_user, 'name') || _user.id"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="actions has-text-centered">
            <div v-if="game.hasUsers && user.admin">
              <button
                @click="revealVotes()"
                class="button is-success btn-reveal is-raised"
                :class="{ 'is-loading': ui.loader.reveal }"
                key="reveal"
              >
                Revelar
              </button>
              <button
                @click="startVoting()"
                class="button is-success btn-start is-raised"
                :class="{ 'is-loading': ui.loader.start }"
                key="start"
              >
                Iniciar nova votação
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-foot">
        <div class="container is-fluid">
          <div class="cards">
            <h6 class="title is-6 has-text-centered mb-0">
              Selecione sua carta 👇
            </h6>

            <div class="cards-mask">
              <button
                v-for="v in settings.system.fibonacci"
                :key="v"
                class="btn-vote"
                @click="vote(v)"
                :class="{ active: user.card == v }"
              >
                <span :style="{ backgroundColor: user.color }" class="card">{{
                  v
                }}</span>
              </button>

              <button
                class="btn-vote"
                @click="vote('?')"
                :class="{ active: user.card == '?' }"
              >
                <span :style="{ backgroundColor: user.color }" class="card"
                  >?</span
                >
              </button>

              <button
                class="btn-vote"
                @click="vote('☕')"
                :class="{ active: user.card == '☕' }"
              >
                <span :style="{ backgroundColor: user.color }" class="card"
                  >☕</span
                >
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from "lodash"
import { Header, Card, Spinner, UsernameModal, ConfigModal } from "@components"
import { EventBus, GoogleAnalytics } from "@services"
import { Color, Console, System } from "@helpers"
import { io } from "socket.io-client"
import BSON from "bson"

export default {
  name: "Room",
  components: {
    Header,
    Card,
    UsernameModal,
    ConfigModal,
    Spinner,
  },
  data: () => ({
    noop: 0,
    channel: {
      session: {
        id: false,
      },
    },
    user: {
      id: false,
      socketId: false,
      admin: false,
      color: false,
      card: -1,
      name: "",
      spectator: false,
      maxUser: false,
    },
    game: {
      name: "",
      title: "",
      destroyed: false,
      changeOnRestart: false,
      timeout: false,
      hasVotes: false,
      reveal: false,
      hasUsers: false,
      players:{}
    },
    settings: {
      socket: false,
      debug: false,
      system: {
        fibonacci: [],
      },
    },
    ui: {
      loader: {
        start: false,
        reveal: false,
        application: false,
      },
    },
  }),
  created() {
    this.setDebugMode();
    this.setSystem();
    this.start();
  },
  beforeDestroy() {
    this.unbindInterfaceEvents();
  },
  methods: {
    get,
    setDebugMode() {
      this.settings.debug = this.$route.query.debug == "ui";
    },
    loading(value) {
      this.ui.loader.application = value;
    },
    start() {
      this.loading(true);

      this.socketRegister().then(() => {
        this.createChannelsIds();
        this.setInitialConfig();
        this.bindInterfaceEvents();
        this.bindUsersEvents();
        this.loading(false);

        GoogleAnalytics.register("register", {
          user: this.user,
          session: this.channel.session.id,
        });
      });
    },
    setInitialConfig() {
      this.game.title = this.getGameTitle();
      this.game.changeOnRestart = this.getChangeOnRestart();
      this.user.id = this.getUserID();
      this.user.name = this.getUserName();
      this.user.admin = this.checkIAmAdmin();
      this.user.spectator = this.getUserSpectator();
    },
    setSystem() {
      this.settings.system.fibonacci = System.fibonacci(8);
      console.info(this.settings.system.fibonacci);
    },
    goToHome() {
      GoogleAnalytics.register("logout", {
        user: this.user,
        session: this.channel.session.id,
      });

      this.dismissAllModals();

      this.$router
        .push({ name: "home", query: { debug: this.$route.query.debug } })
        .catch(() => {});
    },
    createChannelsIds() {
      this.channel.session.id = `public-poker-room-${this.$route.params.channel}`;
    },
    bindUsersEvents() {
      this.settings.socket.on("backend::data", (binary) => {
        const data = BSON.deserialize(binary);

        this.$set(this.game, "players",   this.get(data, "room.players", {}));
        this.$set(this.game, "title",     this.get(data, "room.title", ""));
        this.$set(this.game, "reveal",    this.get(data, "room.reveal"));
        this.$set(this.game, "destroyed", this.get(data, "room.destroyed"));

        this.logEvents(data);

        /*switch (data.action) {
          case "max-users-limit":
            this.maxUsersLimit(data.user);
            break;
        }*/
      });
    },
    logEvents: function(data) {
      //remove player value from log
      let result = {
        ...data, 
        room: { 
          ...data.room, 
          players: { 
            ...Object.values(data.room.players).map(({value, ...player})=>player)
          }
        }
      };
      
      Console.warn(data.action, JSON.stringify(result, null, 4));
    },
    getRegisteredUsers() {
      return Object.values(this.game.players).filter(
        (user) => !user.spectator && user.name != ""
      );
    },
    checkIAmAdmin() {
      return !!this.channel.session.id.match(
        new RegExp(atob(localStorage.getItem("user.admin")), "g")
      );
    },
    socketRegister() {

      Console.warn('SOCKET REGISTER');

      return new Promise((resolve) => {
        const ioOptions = {
          forceNew: false,
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 60000,
          reconnectionAttempts: "Infinity",
          timeout: 10000,
          pingTimeout: 1000,
          pingInterval: 1000
        };
        this.settings.socket = io(window.location.origin, ioOptions);
        this.settings.socket.on('connect', () => {
          this.user.socketId = this.settings.socket.id;
          this.settings.socket.emit('register', { game: this.$route.params.channel });
        });
        this.settings.socket.on('registered', (binary) =>{
          const data = BSON.deserialize(binary);
          this.$set(this.game, "players", { ...data.players });
          resolve();
        });
        this.settings.socket.on("connect_error", this.handleErrors);
        this.settings.socket.on("connect_failed", this.handleErrors);
        this.settings.socket.on("disconnect", this.handleErrorDisconnect);
      });
    },
    getUserName() {
      if (!localStorage.getItem("user.name")) {
        this.changeNameModal();
      }

      return localStorage.getItem("user.name");
    },
    getGameTitle() {
      Console.warn("is admin: ", this.checkIAmAdmin());
      return localStorage.getItem("game.title") || "";
    },
    getChangeOnRestart() {
      return localStorage.getItem("game.changeOnRestart") || false;
    },
    getUserSpectator() {
      return localStorage.getItem("user.spectator") === "true";
    },
    handleErrors(err, ...args) {
      this.$buefy.notification.open({
        duration: 10000,
        message: `Ocorreu um erro ao se conectar com o servidor.`,
        position: "is-top",
        type: "is-danger",
      });

      this.settings.socket.disconnect();
      this.goToHome();

      Console.info(err, args);
    },
    handleErrorDisconnect(){
      this.settings.socket.disconnect();
      this.goToHome();
    },
    maxUsersLimit(user) {
      if (user == this.user.id) {
        this.$buefy.dialog.confirm({
          title: "Limite alcançado",
          message:
            "O limite de usuários foi atingido. Deseja continuar como espectador?",
          cancelText: "Não. Eu vou sair",
          confirmText: "Sim. Eu quero continuar",
          onConfirm: () => {
            this.setUserColor("#9d9d9d");
            this.user.spectator = true;
            this.user.maxUser = true;
            this.$buefy.toast.open("Usuário espectador");

            GoogleAnalytics.register("max-users-limit", {
              user: this.user,
              session: this.channel.session.id,
            });
          },
          onCancel: () => {
            this.goToHome();
          },
        });
      }
    },
    bindInterfaceEvents() {
      EventBus.$on("change:name", this.changeNameModal);
      EventBus.$on("change:settings", this.changeSettingsModal);
      EventBus.$on("change:exit", this.stopVoting);
      EventBus.$on("change:spectator", this.changeSpectator);
    },
    unbindInterfaceEvents() {
      //Disable Always on
      EventBus.$emit("alwaysOn:disable");

      //Remove interface events
      EventBus.$off("change:name", this.changeNameModal);
      EventBus.$off("change:settings", this.changeSettingsModal);
      EventBus.$off("change:exit", this.stopVoting);
      EventBus.$off("change:spectator", this.changeSpectator);

      //Close all modals
      this.dismissAllModals();
    },
    dismissAllModals() {
      document.querySelectorAll(".modal").forEach((modal) => {
        modal.__vue__?.$vnode?.context?.close();
      });
    },
    changeNameModal() {
      this.$buefy.modal.open({
        component: UsernameModal,
        autoFocus: true,
        trapFocus: true,
        props: { username: this.user.name },
        events: {
          close: (name) =>{
            Console.info("Name::close", name);
            if(name && String(name).trim().length){
              this.$set(this.user, "name", name);
            }
          }
        },
      });
    },
    changeSettingsModal() {
      this.$buefy.modal.open({
        component: ConfigModal,
        autoFocus: true,
        trapFocus: true,
        props: {
          gamename: this.game.title,
          changeOnRestart: this.game.changeOnRestart
        },
        events: {
          close: (data)=>{
            Console.info(data);
            if (data) {
              this.$set(this.game, "title", this.get(data, "name", ""));
              this.$set(
                this.game,
                "changeOnRestart",
                this.get(data, "changeOnRestart", false)
              );
            }
          },
        },
      });
    },
    changeSpectator(spectator) {
      this.user.card = -1;
      this.$set(this.user, "spectator", spectator);
    },
    setUsersColor() {
      Object.keys(this.game.players).forEach((user) => {
        if (this.user.id == user)
          this.setUserColor(this.game.players[user].color);
      });
    },
    setUserColor(color) {
      this.$set(this.user, "color", color);
    },
    resetVoting() {
      document.body.classList.remove("votes-reveal");
      this.ui.loader.start = false;
      this.user.card = -1;

      GoogleAnalytics.register("start", {
        user: this.user,
        session: this.channel.session.id,
      });
    },
    getUserID() {
      localStorage.setItem("user", this.settings.socket.id );
      return localStorage.getItem("user");
    },
    sendData(data) {
      let item = {
        channel_name: this.channel.session.id,
        user: this.user.id,
        ...(data || {}),
      };
      this.settings.socket.emit("interface::data", BSON.serialize(item));
      Console.info("senddata::", item.action);
    },
    finish() {
      GoogleAnalytics.register("finish", {
        user: this.user,
        session: this.channel.session.id,
      });

      document.body.classList.remove("votes-reveal");
      localStorage.removeItem("user.admin");
      localStorage.removeItem("user.color");
      localStorage.removeItem("game.title");
      localStorage.removeItem("game.changeOnRestart");

      this.goToHome();
    },
    vote(value) {
      this.user.card = this.user.card != value ? value : -1;

      this.sendData({
        action: "vote",
        value: this.user.card == -1 ? "" : this.user.card,
      });
    },
    revealVotes() {
      this.ui.loader.reveal = true;

      this.sendData({
        action: "reveal",
      });
    },
    reveal() {
      this.ui.loader.reveal = false;
      this.ui.loader.start = false;
      //this.game.reveal = true;

      document.body.classList.add("votes-reveal");

      [].slice
        .call(document.querySelectorAll(".card.active"))
        .forEach((card) => {
          card.classList.remove("active");
        });

      GoogleAnalytics.register("reveal", {
        user: this.user,
        session: this.channel.session.id,
      });
    },
    startVoting() {
      this.ui.loader.start = true;

      if (this.game.changeOnRestart && this.checkIAmAdmin()) {
        this.changeSettingsModal();
      }

      this.sendData({
        action: "start",
      });
    },
    stopVoting() {
      this.sendData({ action: "stop", admin: this.user.admin });
      setTimeout(this.finish, 10);
    },
  },
  watch: {
    "game.players": {
      handler() {
        this.game.hasVotes = true;
        this.game.hasUsers = !!Object.values(this.game.players).filter(
          (user) => !user.spectator && user.name != ""
        ).length;
        this.setUsersColor();
      },
      deep: true
    },
    "game.reveal"(value){
      this[ value ? 'reveal' : 'resetVoting' ]();
    },
    "game.destroyed"(value){
      if(value){
        this.finish();
      }
    },
    "user.name"(name) {
      if (name) {
        localStorage.setItem("user.name", name);
        this.sendData({ action: "user.name", name });
      }
    },
    "game.title"(value) {
      if(this.checkIAmAdmin()){
        localStorage.setItem("game.title", value);
        this.sendData({ action: "game.title", value });
      }
    },
    "game.changeOnRestart"(value) {
      localStorage.setItem("game.changeOnRestart", value);
      this.sendData({ action: "changeOnRestart", value });
    },
    "user.spectator"(spectator) {
      localStorage.setItem("user.spectator", spectator);
      document.body.classList[spectator ? "add" : "remove"]("spectator");
      this.sendData({ action: "spectator", spectator });

      GoogleAnalytics.register("spectator", {
        user: this.user,
        session: this.channel.session.id,
      });
    },
    "user.color"(value){
      const contrast = Color.lightOrDark(value);
      document.documentElement.classList[contrast ? 'add' : 'remove']('has-user-text-contrast');
      if(value) {
        document.documentElement.classList.add('visible');
      }
      Console.info('contrast', contrast, value)
    }
  },
};
</script>

<style lang="scss" scoped>
.btn-start {
  display: none;
}
.wrapper {
  display: flex;

  @media (max-width: 768px) {
    display: block;
  }

  & > .hero {
    flex: 1 1 auto;
  }

  & > .debug {
    width: 60%;
    background-color: #333;
    overflow-x: hidden;
    overflow-y: auto;
    flex: none;
    color: #fff;
    font-size: 12px;
    padding: 2rem;
  }
}

.hero {
  .hero-head {
    .logo {
      display: flex;
      align-items: center;
    }
    .logo svg {
      width: 40px;
      margin-right: 10px;
      fill: #167df0;
    }
  }

  .hero-body {
    display: flex;
    justify-content: center;
    align-items: center;

    .card-box {
      background-color: rgba(214,235,255,0.6);
      border-radius: 20px;
      min-height: 288px;
      max-width: calc(100% - 40px);
      margin: 2rem auto;
      background-blend-mode: multiply;
      mix-blend-mode: multiply;

      .dark & {
        background-color: rgba(0, 0, 0, 0.2);
        mix-blend-mode: normal;
      }

      &:empty:before {
        content: "Escolha suas cartas!";
        display: block;
      }
    }
    .actions {
      height: 60px;
    }

    .waiting {
      height: 20px;
      font-size: 0.8rem;
    }
  }

  .hero-foot {
    min-height: 130px;
    transition: opacity 200ms ease 0ms;
    overflow: hidden;
    .cards {
      text-align: center;
      overflow: hidden;
      transition: all 200ms ease 0ms;

      .title {
        transform: translateY(0%);
        transition: all 200ms ease 0ms;
        opacity: 1;
        padding-bottom: 1rem;
      }

      .cards-mask {
        overflow-x: auto;
        overflow-y: hidden;
        width: auto;
        display: inline-flex;
        margin: 0 auto 10px auto;
        height: 110px;
        transition: all 400ms ease 0ms;
        opacity: 1;
        will-change: auto;
        touch-action: pan-x;

        @media (max-width: 768px) {
          width: 100%;
        }
      }
    }

    .btn-vote {
      display: block;
      padding: 0 6px;
      margin: 0;
      border: 0;
      background: transparent;
      cursor: pointer;
      height: 90px;

      @media (max-width: 768px) {
        width: 100%;
      }

      .card {
        display: block;
        min-width: 54px;
        padding: 1.5rem 0.6rem !important;
        text-align: center;
        font-size: 1.1rem;
        font-weight: bold;
        width: auto;
        transform: translateY(0);
        transition: all 200ms ease 0ms;
        pointer-events: none;
        background-color: var(--default-color);
        color: black;
        box-shadow: 0 4px 6px -2px rgba(0, 0, 0, 0.4), 0 0 0 0.3rem rgba(255, 255, 255, 0.3) inset;
        position: relative;
        border-radius: 9px;

        .has-user-text-contrast &{
          color: white;
        }

        &:before {
          content: "";
          position: absolute;
          display: block;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background-size: cover;
          background-repeat: no-repeat;
          pointer-events: none;
          z-index: -1;
          border-radius: 6px;
        }
      }

      &.active .card,
      &:hover .card {
        transform: translateY(-8px);

        &:before {
          background-color: rgba(0, 0, 0, 0.4);
        }
      }
      &.active .card {
        color: white;
      }
    }
  }

  .spectator &,
  .visible &,
  .votes-reveal & {
    .cards {
      overflow: hidden;
      transform: translateY(0px);
    }
  }
  .spectator &,
  .votes-reveal & {
    .cards {
      pointer-events: none;
      opacity: 0.5;
      pointer-events: none;
    }
  }
  .spectator & .cards{
    transform: translateY(200px);
    opacity: 0;
    pointer-events: none;
  }
  .spectator.dark & .cards,
  .votes-reveal.dark & .cards {
    opacity: 0.3;
  }

  .votes-reveal & {
    .btn-reveal {
      display: none;
    }
    .btn-start {
      display: inline-block;
    }
  }
}
</style>
