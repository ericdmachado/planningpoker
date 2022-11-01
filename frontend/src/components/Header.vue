<template>
  <header class="hero-head">
    <div class="container pt-5 is-fluid">
      <div class="columns is-gapless is-mobile">
        <div class="column">
          <h1 class="title is-4 has-text-weight-bold logo">
            <Logo />
            <span class="is-hidden-mobile mr-2">
              Planning Poker <GameName :name="gameName"/>
            </span>
            <b-tooltip
              label="Mudar nome da partida"
              position="is-right"
              type="is-black"
            >
              <b-button
                type="is-info is-light"
                inverted
                @click="changeSettings()"
                v-if="isAdmin"
              >
                <b-icon icon="cog" size="is-small" />
              </b-button>
            </b-tooltip>
          </h1>
        </div>
        <div
          v-if="userId"
          class="column is-narrow userarea has-text-weight-bold"
        >
          <b-tooltip
            label="Ficar invisível na sala"
            position="is-bottom"
            type="is-black"
          >
            <b-switch
              v-if="!isMaxUser"
              class="viewer"
              type="is-success"
              size="is-small"
              @input="changeSpectator"
              v-model="isSpectator"
            >
              Espectador
            </b-switch>
          </b-tooltip>
          <b-dropdown aria-role="list" position="is-bottom-left">
            <template #trigger="{ active }">
              <b-button
                type="is-primary is-outlined is-raised"
                :icon-right="active ? 'menu-up' : 'menu-down'"
                class="has-text-weight-bold is-small has-text-black"
              >
                {{ name }}
                <span class="has-text-info" v-if="isAdmin"> - Admin</span>
              </b-button>
            </template>

            <b-dropdown-item
              class="has-text-weight-normal"
              aria-role="listitem"
              @click="changeName"
              >Mudar meu nome</b-dropdown-item
            >
            <b-dropdown-item
              class="has-text-weight-normal"
              aria-role="listitem"
              @click="toggleDarkMode()">
                Alterar o tema
              </b-dropdown-item>
            <b-dropdown-item
              class="has-text-weight-normal"
              @click="exit()"
              aria-role="listitem"
              >Sair</b-dropdown-item
            >
          </b-dropdown>
        </div>

        <div class="column is-narrow" v-if="!userId">
          <b-tooltip
            label="Ativar modo escuro"
            position="is-left"
            type="is-black"
          >
            <b-button
              type="is-text"
              class="btn-darkmode is-inverted"
              @click="toggleDarkMode()"
            >
              <b-icon :icon="btnThemeClassName" />
            </b-button>
          </b-tooltip>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { Logo, GameName } from "@components";
import { EventBus } from "@services";

export default {
  name: "Header",
  components: {
    Logo,
    GameName,
  },
  data() {
    return {
      isSpectator: this.spectator,
      isMaxUser: this.maxUser,
      game: "",
      name: "",
      darkTheme: null,
      btnThemeClassName: "",
    };
  },
  props: {
    userName: {
      type: [String, Boolean],
      default: "",
      required: false,
      useDefaultForNull: true,
    },
    gameName: {
      type: [String, Boolean],
      default: "",
      required: false,
      useDefaultForNull: true,
    },
    userId: {
      type: [String, Boolean],
      default: false,
      required: false,
      useDefaultForNull: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: false,
      useDefaultForNull: true,
    },
    spectator: {
      type: Boolean,
      default: false,
      required: false,
      useDefaultForNull: true,
    },
    maxUser: {
      type: Boolean,
      default: false,
      required: false,
      useDefaultForNull: true,
    },
  },
  methods: {
    exit() {
      EventBus.$emit("change:exit");
    },
    changeSettings() {
      EventBus.$emit("change:settings");
    },
    changeName() {
      EventBus.$emit("change:name");
    },
    changeSpectator() {
      EventBus.$emit("change:spectator", this.isSpectator);
    },
    getGameName(value) {
      return String(value || "");
    },
    getUserName(value) {
      let name = String(value || "");
      return name.match(/\s/g)
        ? `${name.split(" ")[0]} ${name.split(" ")[1]}`
        : name;
    },
    toggleDarkMode() {
      EventBus.$emit("change:theme");
      setTimeout(this.hasDarkTheme, 10);
    },
    hasDarkTheme() {
      this.darkTheme = document.documentElement.classList.contains("dark");
    },
    loadUserName() {
      this.name = this.getUserName(this.userName);
    },
    loadGameName() {
      this.game = this.getGameName(this.gameName);
    },
    loadDarkTheme() {
      setTimeout(this.hasDarkTheme, 10);
    },
  },
  created() {
    this.loadUserName();
    this.loadGameName();
    this.loadDarkTheme();
  },
  watch: {
    spectator(value) {
      this.isSpectator = value;
    },
    maxUser(value) {
      this.isMaxUser = value;
    },
    gameName(value) {
      this.game = this.getGameName(value);
    },
    userName(value) {
      this.name = this.getUserName(value);
    },
    darkTheme(value) {
      this.btnThemeClassName = `brightness-${value ? 5 : 3}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.hero-head {
  color: var(--default-text-color);
  .logo {
    display: flex;
    align-items: center;

    svg {
      width: 40px;
      margin-right: 10px;
      fill: $primary;
    }
  }
  .userarea {
    display: flex;
    align-items: center;

    .button {
      margin-left: 20px;

      &:focus .has-text-info,
      &:hover .has-text-info {
        color: #fff !important;
        .dark & {
          color: var(--app-background) !important;
        }
      }
      &.has-text-black {
        color: var(--default-text-color) !important;
        .dark & {
          color: #fff !important;
        }
      }
    }
  }

  .btn-darkmode {
    color: inherit;
    opacity: 0.8;

    .icon {
      transform: rotate(130deg) !important;
    }

    &:hover,
    &:focus,
    &:active {
      opacity: 1;
      color: inherit;
    }
  }
}
</style>