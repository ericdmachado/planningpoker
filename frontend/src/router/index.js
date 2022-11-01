import Vue from 'vue'
import VueRouter from 'vue-router'
import { Home, Room } from '@components'
import { Device } from '@helpers'

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/:channel', name: 'room', component: Room }
]

const router = new VueRouter({
  mode: !Device.isMobile() ? 'history' : 'hash',
  routes
});

router.beforeEach((to, from, next) => {
  if(Device.isMobile()){
    let path = location.href.replace(new RegExp(location.origin, 'gi'), '');

    if(path.match(/[A-z]+#\/$/gi)){
      window.location.href = `/#${path.slice(0, path.indexOf('#'))}`;
      return false;
    }
  }
  next();
});

export default router
