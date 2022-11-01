<template>
  <div :class="getCardClass" :id="dataCardId">
    <div class="card-wrapper">
      <div class="card-inner" :style="{ backgroundColor: color }">
        <span class="face"></span>
        <span class="vote">{{ value }}</span>
      </div>
    </div>

    <div class="username">
      {{ name }}
    </div>
  </div>
</template>

<script>
import { gsap } from "gsap"
import { Color, CSS } from '@helpers'

export default {
  name: "Card",
  props: {
    value: [String, Number],
    label: [String, Number],
    flip: Boolean,
    color: String,
    dataCardId: [String, Number]
  },
  data() {
    return {
      duration: 0.4,
      active: false,
      userColor: false,
      whiteText: false
    };
  },
  created(){
    this.getUserColor();
  },
  mounted() {
    setTimeout(this.setInitialPerspective, 100);
  },
  methods:{
    setInitialPerspective(){
      gsap.set(this.$el.querySelector(".card-inner"), {
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      });
    },
    getUserColor(){
      this.userColor = CSS.getVariable('--user-color');
    }
  },
  watch: {
    flip() {
      gsap.to(this.$el.querySelector(".card-inner"), {
        duration: this.duration,
        rotateY: this.flip ? -180 : 0,
      });
    },
    value(valor){
      this.active = !!String(valor).trim().length;
    },
    userColor(){
      this.whiteText = Color.lightOrDark(this.color);
    }
  },
  computed: {
    name() {
      let name = String(this.label);
      return name.match(/\s/g)
        ? `${name.split(" ")[0]} ${name.split(" ")[1]}`
        : name;
    },
    getCardClass(){
      return `card ${ this.active ? 'active' : '' } ${ this.whiteText ? 'has-text-contrast' : '' }`;
    }
  },
};
</script>

<style lang="scss" scoped>
.debug * {
  outline: 1px solid red;
}
.card {
  width: 100px;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  user-select: none;
  position: relative;
  box-shadow: none !important;
  background: transparent !important;
  height: 166px;

  &-wrapper {
    opacity: 0.3;
    transform: scale(0.8);
    transition: all 400ms ease 0ms;
    will-change: auto;

    .votes-reveal &,
    .active & {
      opacity: 1;
      transform: scale(1);
    }
  }

  .username {
    font-size: 12px;
    font-weight: bold;
    color: var(--default-text-color);
    text-overflow: ellipsis;
    width: 90%;
    overflow: hidden;
    text-align: inherit;
    padding: 0;
    display: inline-block;
    height: 20px;
    white-space: nowrap;
  }
  &-inner {
    display: inline-block;
    width: 5.4rem;
    height: 8rem;
    position: relative;
    box-shadow: 0 20px 30px 0 rgba(0, 0, 0, 0.2),
      0 4px 4px -1px rgba(0, 0, 0, 0.1);
    border-radius: var(--default-border-radius);
    background-color: var(--user-color);
    will-change: transform;
  }
  span.face,
  span.vote {
    border-radius: var(--default-border-radius);
    display: flex;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    backface-visibility: hidden;
    justify-content: center;
    align-items: center;
    background-repeat: no-repeat;
    box-shadow: 0 0 0 8px rgba(255, 255, 255, 0.3) inset;

    &:before {
      content: "";
      background: linear-gradient(
        122deg,
        rgba(0, 0, 0, 0) 34%,
        rgba(0, 0, 0, 0.1) 84%
      );
      pointer-events: none;
      position: absolute;
      border-radius: var(--default-border-radius);
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
    }
  }
  span.vote {
    transform: rotateY(180deg);
    color: black;

    &:after {
      content: "🤐";
      transition: all 0ms linear 220ms;
      opacity: 0;
      position: absolute;
    }

    &:empty {
      background-color: $danger;
      transition: background 0ms linear 220ms;

      &:after {
        opacity: 1;
      }
    }
  }

  &.has-text-contrast span.vote{
    color: #FFF;
  }
}
</style>