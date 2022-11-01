<template>
  <div class="card3d has-text-white mt-6 mb-6">
    <div class="perspective">
      <div :class="`card-group ${style}`" :style="cardGroupStyle" v-for="style in ['front', 'background']" :key="style">
        <div v-for="(card, index) in cards" :key="card.value" :style="cardStyle[index]" :data-depth="index" class="card-wrapper">
          <div :class="`card card-${card.color}`" :data-value="card.value"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Device } from '@helpers'
import { shuffle } from 'lodash'

export default {
  name: "Card3d",
  data(){
    return {
      pos: {x: -8.675, y: 14.475, pX: -72.29166666666667, pY: -96.661101836394},
      cards: [],
      cardStyle:{ 
        0: "z-index: 0; transform: translateX(0px) translateY(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px)",
        1: "z-index: 1; transform: translateX(72.29166666666667px) translateY(-9.666110183639399px) rotateX(-0.48330550918196996deg) rotateY(-0.3614583333333334deg) rotateZ(7.229166666666668deg) translateZ(-130px)",
        2: "z-index: 2; transform: translateX(144.58333333333334px) translateY(-19.332220367278797px) rotateX(-0.9666110183639399deg) rotateY(-0.7229166666666668deg) rotateZ(14.458333333333336deg) translateZ(-260px)",
        3: "z-index: 3; transform: translateX(216.875px) translateY(-28.998330550918197px) rotateX(-1.4499165275459098deg) rotateY(-1.084375deg) rotateZ(21.687500000000004deg) translateZ(-390px)"
      }
    }
  },
  created() {
    this.sortCards();
    
    if(Device.isMobile()) return;

    this.bindMouseEvent();
  },
  methods:{
    bindMouseEvent(){
      document.body.addEventListener('pointermove', this.setPosition);
    },
    sortCards(){
      this.cards = shuffle([
        {value: 5, color: 'blue'},
        {value: 8, color: 'green'},
        {value: 3, color: 'red'},
        {value: '☕', color: 'yellow'}
      ]);
    },
    setPosition(evt){
      evt.preventDefault();

      var x = -(window.innerWidth / 2 - evt.pageX) / 80,
          y = (window.innerHeight / 2 - evt.pageY) / 20,
          pX = ((evt.pageX - window.innerWidth / 2) * 100) / (window.innerWidth / 2),
          pY = ((evt.pageY - window.innerHeight / 2) * 100) / (window.innerHeight / 2);
          
      this.pos = { x, y, pX, pY };

      Object.keys(this.cards).forEach((c, i)=>{
        const props = {
          translateX: `${i * ((pX / 100) * 100) * -1}px`,
          translateY: `${i * ((pY / 100) * 10)}px`,
          rotateX: `${ i * ((pY / 100) * 0.5) }deg`,
          rotateY: `${ i * ((pX / 100) * 0.5) }deg`,
          rotateZ: `${-(i * ((pX / 100) * 10))}deg`,
          translateZ: `${ -(i * 130) }px`
        };

        this.cardStyle[i] = `z-index: ${i}; transform: ${Object.keys(props).map((key) => `${key}(${props[key]})`).join(" ")}`
      });
    }
  },
  computed:{
    cardGroupStyle(){
      return `transform: rotateY(${this.pos.x}deg) rotateX(${this.pos.y}deg)`;
    }
  }
};
</script>

<style lang="scss" scoped>
.card3d {
  user-select: none;
  pointer-events: none;
  position: relative;

  @media (max-width: 620px){
    left: -10px;
    top: 40px;
  }
  .perspective {
    width: 100%;
    perspective: 1000px;
    background: transparent;
    transform: scale(0.7) translate(-30px, -60px);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .card-group {
    position: relative;
    width: 20vw;
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
    transform-style: preserve-3d;
    z-index: 3;
    will-change: auto;
  }
  .card-wrapper {
    width: 360px;
    height: 520px;
    position: absolute;
    perspective: 1000px;
    transform-style: preserve-3d;
    will-change: auto;
    letter-spacing: -1.6rem;
  }
  .card {
    width: 360px;
    height: 520px;
    border-radius: calc(var(--default-border-radius) * 2);
    box-shadow: -20px 70px 63px -10px rgba(0, 0, 0, 0.15);
    font-size: 16rem;
    font-weight: bold;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    transform-style: preserve-3d;
    background-color: transparent;
    backface-visibility: hidden;
    
    &:before,
    &:after{
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: block;
      z-index: 1;
      backface-visibility: hidden;
      border-radius: calc(var(--default-border-radius) * 2);
      display: flex;
    }

    &:before{
      -webkit-backdrop-filter: blur(6px);
      backdrop-filter: blur(6px);
    }

    &:after{
      content: attr(data-value);
      z-index: 2;
      justify-content: center;
      align-items: center;
      line-height: 1;
      -webkit-backdrop-filter: blur(0px);
      backdrop-filter: blur(0px);
      transform: translateZ(1px);
      box-shadow: 0 0 0 24px rgba(255, 255, 255, 0.3) inset;
      z-index: 99;
      text-indent: -2rem;
    }

    &-blue:before {
      background-color: rgba(37, 50, 175, 0.8);
    }
    &-green:before {
      background-color: rgba(48, 175, 37, 0.8);
    }
    &-red:before {
      background-color: rgba(225,17,17, 0.8);
    }
    &-yellow:before {
      background-color: rgba(223,193,17, 0.8);
    }
  }
  .background {
    position: absolute;
    z-index: 1;
    left: -80px;
    top: 80px;
    filter: blur(55px) saturate(3);
    opacity: 0.6;
    z-index: -1;

    @media (max-width: 620px){
      left: -0px;
      top: 0px;
    }

    .card{
      box-shadow: initial !important;

      &:before{
        opacity: 0.3;
        -webkit-backdrop-filter: blur(6px);
        backdrop-filter: blur(6px);
      }

      &:after{
        display: none;
      }
    }

    .dark &{
      opacity: 0.3;
      
      .card:before{
        opacity: 0.4 !important;
      }
    }
  }
}
</style>