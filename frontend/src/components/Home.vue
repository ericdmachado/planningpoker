<template>
  <div class="hero home">
    <Header />
    <div class="hero-body is-flex">
      <div class="container has-text-left">
        <div
          class="is-flex
            is-justify-content-center
            is-align-content-center
            is-flex-wrap-wrap">
          <div class="columns is-multiline is-centered is-vcentered">
            <div class="column is-narrow mb-6 pr-6 title-column">
              <h2 class="title is-1 has-text-weight-bold">
                Planning Poker
              </h2>
              <h3 class="subtitle is-4">
                Sem limites de partidas. <br class="is-hidden-desktop"/>
                Até 16 membros.
              </h3>

              <div class="column p-0 perspective">
                <div class="action-start mt-2 mb-2">
                  <b-button
                    type="is-primary is-medium is-raised"
                    class="btn-new-room"
                    @click="createRoom"
                    >Iniciar nova partida</b-button
                  >
                  <button class="button btn-goto-room" @click="goToRoom()">
                    <b-icon icon="exit-run" size="is-small" /> Sala
                  </button>
                </div>
                <p class="paragraph">É só clicar. Clica logo vai! 😊</p>
              </div>
            </div>
            <div class="column is-narrow welcome-column">
              <div class="welcome">
                <Card3d />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Header, Card3d, GoRoomModal } from "@components"
import { GoogleAnalytics, EventBus } from "@services"
import { Console } from "@helpers"
import axios from 'axios'

export default {
  name: "Home",
  components: {
    Header,
    Card3d
  },
  data: () => {
    return {
      channelID: "",
      loading: false,
      socket: null
    };
  },
  created() {
    this.cleanOldSession();
  },
  methods: {
    cleanOldSession() {
      //
      document.body.classList.remove("votes-reveal");
      //
      localStorage.removeItem("user.admin");
      //
      //localStorage.removeItem('user.spectator');
      //
      localStorage.removeItem("user.color");
      //
      localStorage.removeItem("game.name");
      //
      localStorage.removeItem("game.changeOnRestart");
    },
    createRoom() {
      //
      const channel = Math.random().toString(8).slice(2, 8);

      GoogleAnalytics.register("create", { channel });
      //
      this.markMeAsAdmin(channel);
      //
      this.gotoToPath(channel);
      //Enable Always on
      EventBus.$emit("alwaysOn:enable");
    },
    markMeAsAdmin(channel) {
      localStorage.setItem("user.admin", btoa(channel));
    },
    roomExists: ( channel ) => {
      return axios.get(`${window.location.origin}/channel/${channel}`);
    },
    goToRoom(){
      this.$buefy.modal.open({
        component: GoRoomModal,
        autoFocus: true,
        trapFocus: true,
        props: { 
          roomnumber: '',
          max: '',
          min: ''
        },
        events: {
          close: (channel) =>{
            Console.info("Channel::close", channel);
            
            if( !channel || !String(channel).trim().length ) return;

            if( String(channel).trim().length >= 1 && String(channel).trim().length < 6 ){
              this.$buefy.notification.open({
                duration: 5000,
                message: `O código da sala é inválido.`,
                position: "is-top",
                type: "is-danger",
              });
              return;
            }

            this.loading = this.$buefy.loading.open({
              container: null
            });

            this.roomExists(channel).then(()=>{
              this.gotoToPath(channel);
              this.loading.close();
            }, ()=>{
              this.markMeAsAdmin(channel);
              this.gotoToPath(channel);
              this.loading.close();
            });

          }
        },
      });
    },
    gotoToPath(channel){
      this.$router.push({
        name: "room",
        params: { channel },
        query: {
          debug: this.$route.query.debug
        },
      });
    }
  },
  computed:{
    rand(){
      return (Math.random() * 1) > 0.5;
    }
  }
};
</script>

<style scoped lang="scss">
.home{
  overflow: hidden;

  .title-column{
    position: relative;
    perspective: 1000px;
    z-index: 4;
    
    .subtitle{
      opacity: 0.8;
    }

    @media (min-width: 620px) and (max-width: 820px){
      text-align: center;
      width: 100%;
    }
    @media (max-width: 620px){
      min-width: 80vw;
    }
  }
  .paragraph {
    font-size: 11px;
    padding-top: 1rem;
    padding-bottom: 2rem;
  }
  .welcome-column{
    position: relative;
    z-index: 1;
    min-width: 200px;
  }
  .perspective{
    perspective: 1000px;
    mix-blend-mode: normal;

    .action-start{
      box-shadow: 0 0 0 1px rgba(0,0,0,0.1) inset;
      border-radius: var(--default-border-radius);
      display: inline-flex;
      justify-content: space-around;
      align-items: center;
      transform: translateZ(-2px);
      transform-style: preserve-3d;

      &:hover{
        box-shadow: 0 0 0 1px rgba(0,0,0,0.2) inset;
      }

      .dark &{
        box-shadow: 0 0 0 1px rgba(255,255,255,0.1) inset;

        &:hover{
          box-shadow: 0 0 0 1px rgba(255,255,255,0.2) inset;
        }
      }

      .btn-new-room{
        transform: translateZ(2px);
        font-size: 1rem;
        font-weight: bold;
        padding: 1.4rem;
      }
      .btn-goto-room{
        border: 0 none;
        background: transparent;
        margin: 0.3rem 0.8rem;
        color: var(--default-text-color);
        font-weight: bold;
        font-size: 0.9rem;

        &:hover{
          opacity: 0.9;
        }

        .dark &:hover{
          color: #FFF;
        }

        .icon{
          font-size: 18px;
          margin-right: 2px;
          margin-top: 1px;
        }
      }
      
      @media (max-width: 640px){
        width: 100%;
      }
    }
  }
  .is-flex {
    width: 100%;
    height: 100%;

    .columns {
      width: 100%;
    }
  }
}

</style>