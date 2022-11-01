<template>
  <div id="app">
    <router-view />
    <Version />
  </div>
</template>

<script>
import { Version } from "@components";
import { EventBus, DisplayAlwaysOn } from "@services";
import { Device, CSS } from '@helpers';

export default {
  name: "App",
  components: {
    Version,
  },
  data() {
    return { darkTheme: false };
  },
  created() {
    //Always on display
    EventBus.$on("alwaysOn:enable", () => DisplayAlwaysOn.enable());
    //EventBus.$on("alwaysOn:disable", () => DisplayAlwaysOn.disable());
    EventBus.$on("change:theme", this.toggleTheme);
    
    //Set mobile device
    Device.isMobile();

    //Add events to application
    this.bindEvents();
  },
  methods: {
    bindEvents() {
      //Toggle always visible
      document.body.addEventListener('click', ()=>DisplayAlwaysOn.enable());
      
      //Resize
      //window.addEventListener('resize', ()=>this.resize());

      //Toggle always visible
      if(window.matchMedia){
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
          this.setDarkTheme(!!event.matches);
        });
      }
      
      //Load theme
      this.getTheme();
    },
    toggleTheme() {
      this.setDarkTheme(!this.darkTheme);
    },
    getTheme() {
      if(window.localStorage.getItem("user.dark")){
        this.darkTheme = window.localStorage.getItem("user.dark") == "true";
      }else{
        if(window.matchMedia){
          this.darkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }else{
          this.darkTheme = false;
        }
      }
    },
    setDarkTheme(value) {
      this.darkTheme = value;
    },
    resize(){
      let aspectWidth = document.documentElement.clientWidth / document.documentElement.clientHeight;
      let aspect = aspectWidth < 1 ? 1 : ( aspectWidth > 2 ? 2 : aspectWidth );
      CSS.setVariable('--aspect-ratio', aspect);
    }
  },
  watch: {
    darkTheme(value) {
      const htmlElement = document.documentElement;
      htmlElement.classList[value ? "add" : "remove"]("dark");
      
      const color = CSS.getVariable('--app-background-theme-color');
      CSS.setMetaThemeColor(color);

      window.localStorage.setItem("user.dark", value);
    },
  },
};
</script>
<style lang="scss">
/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  - CSS VARIABLES
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/
:root {
  --user-color: #167df0;
  --default-color: #167df0;
  --default-text-color: #252838;
  --app-background: rgba(249, 249, 249, 0.80);
  --app-background-theme-color: var(--app-background);
  --app-background-dark: #a5acbf;
  --app-modal-background: rgba(0, 0, 0, 0.2);
  --app-input-background: #FFF;
  --app-switch-background: #d9dde1;
  --shadow-primary-raised: #96bde9;
  --shadow-success-raised: #93e5c0;
  --default-border-radius: 8px;

  &.dark{
    --app-input-background: rgba(0, 0, 0, 0.2);
    --default-text-color: #9299bb;
    --app-background: rgba(19, 21, 37, 0.8);
    --app-background-theme-color: #1d1e2f;
    --app-background-dark: #181a25;
    --app-modal-background: rgba(0, 0, 0, 0.5);
    --shadow-primary-raised: #164d8d;
    --shadow-success-raised: #0d7044;
    --app-switch-background: rgba(0, 0, 0, 0.3);
  }
}

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  - DEFAULT
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/
html, body{
  color: var(--default-text-color);
}
html{
  background: var(--app-background) !important;
}
body {
  overflow-x: hidden;
  touch-action: manipulation;
  transition: background 290ms ease 0ms;  
  background: linear-gradient(-10deg, var(--app-background-dark) 0%, var(--app-background) 60%) !important;

  .is-mobile & {
    background: var(--app-background) !important;
  }
}

input {
  touch-action: auto !important;
}
*:not(input) {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.hero {
  min-height: 100vh;
}

.title,
.modal-card-title,
.label {
  color: var(--default-text-color) !important;
}
.select select,
.taginput .taginput-container.is-focusable,
.textarea,
.input {
  background-color: var(--app-input-background) !important;
  color: var(--default-text-color) !important;
  box-shadow: none;

  .dark & {
    color: #fff !important;
  }
  border: 0 none;
}

.container.is-fluid {
  padding-left: 22px !important;
  padding-right: 22px !important;
}

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  - BUTTON
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/
.button{
  border-radius: var(--default-border-radius) !important;

  &.is-rounded{
    border-radius: 99999px !important;
  }
}
.button.is-primary.is-raised {
  transition: all 200ms ease 0ms;

  &,
  &:focus:not(:active) {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2),
      0 3px 8px 0 var(--shadow-primary-raised);
  }

  &:hover,
  &:focus {
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.5),
      0 10px 20px 0 var(--shadow-primary-raised) !important;
    transform: translateY(-1px);
  }
}
.button.is-success.is-raised {
  transition: all 200ms ease 0ms;

  &,
  &:focus:not(:active) {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5),
      0 3px 8px 0 var(--shadow-success-raised);
  }
  &:hover,
  &:focus {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5),
      0 10px 20px 0 var(--shadow-success-raised) !important;
  }
}
.button.is-inverted {
  background-color: transparent !important;
}

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  - SWITCH
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/
.switch {
  & input[type="checkbox"]:focus + .check,
  & input[type="checkbox"]:active + .check,
  & input[type="checkbox"]:focus:checked + .check,
  & input[type="checkbox"]:active:checked + .check {
    box-shadow: none !important;
  }
  & input[type="checkbox"] + .check,
  &:hover input[type="checkbox"] + .check,
  .dark & input[type="checkbox"] + .check {
    background-color: var(--app-switch-background);
  }
  .dark &:hover input[type="checkbox"] + .check {
    background-color: rgba(0, 0, 0, 0.4);
  }
}

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  - DROPDOWN
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/
.dropdown{
  .background {
    @extend %modalBackground;
    @extend %backdrop;
  }
  &-menu{
    @extend %defaultShadow;
    border-radius: var(--default-border-radius);
    background-color: #fff !important;

    .dark & {
      background-color: var(--app-background) !important;
    }
  }
  &-content{
    box-shadow: none;
    background: transparent;

    .dark & a{
      color: var(--default-text-color);

      &:hover {
        background-color: rgba(0, 0, 0, 0.2) !important;
        color: #fff;
      }
    }
  }
}

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  - MODAL
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/
%modalBackground{
  background: var(--app-modal-background) !important;
  background: linear-gradient(0deg, var(--app-modal-background) 0%,rgba(0,0,0,0) 100%) !important;
}
%backdrop{
  -webkit-backdrop-filter: blur(10px) !important;
  backdrop-filter: blur(10px) !important;
}
%defaultShadow{
  box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.1), 0 3px 5px -2px rgba(0, 0, 0, 0.2);
}
.modal {
  &-card {
    background: transparent !important;
    border-radius: var(--default-border-radius);
    
    &-title {
      @media (max-width: 768px) {
        font-size: 1.2rem;
      }
    }
  }
  &-content,
  &-background {
    @extend %backdrop;
  }
  &-content {
    background-color: var(--app-background) !important;
    border-radius: var(--default-border-radius);
  }
  &-background {
    @extend %modalBackground;
  }
  &-card-head {
    font-weight: bold;

    .button {
      transform: translate(8px, 0);
      padding: 0.6rem;
      font-size: 1rem;

      .dark & {
        color: var(--default-text-color) !important;
      }

      .dark &:hover,
      &:active {
        color: #fff !important;
      }
    }
  }
  &-card-head,
  &-card-body,
  &-card-foot {
    background: transparent !important;
    padding-left: 3rem !important;
    padding-right: 3rem !important;

    @media (max-width: 768px) {
      padding-left: 2rem !important;
      padding-right: 2rem !important;
    }
  }
  &-card-body {
    background: transparent;
    padding-top: 0rem !important;
    padding-bottom: 1rem !important;
    border: 0 none;
  }
  &-card-head,
  &-card-foot {
    background-color: transparent !important;
    border: 0 none !important;
    padding-top: 3rem !important;
    padding-bottom: 3rem !important;

    @media (max-width: 768px) {
      padding-top: 2rem !important;
      padding-bottom: 2rem !important;
    }
  }
  &-card-foot {
    padding-top: 2.4rem !important;

    @media (max-width: 768px) {
      padding-top: 1rem !important;
    }
  }
  &-close {
    display: none;
  }
  &-content {
    @extend %defaultShadow;
    width: auto !important;
  }
}

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  - LOADING
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/
.loading-overlay{
  .loading-background{
    @extend %modalBackground;
    @extend %backdrop;
  }
  .loading-icon:after{
    border-bottom-color: var(--app-background);
    border-left-color: var(--app-background);
    filter: saturate(4) brightness(3);
    box-shadow: 0 4px 5px 0 rgb(19 81 153), 4px 0 5px 0 rgb(209 0 88);
    font-size: 0.5em;
  }
}

</style>
