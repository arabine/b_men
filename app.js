
const router = new VueRouter({
  mode: 'hash',
  routes: [
    { path: '/', name: 'menu', meta: { }, component: MenuView   },
    { path: '*', redirect: '/'}
  ]
});

var app_template = /*template*/`
<transition>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</transition>
`

async function loadEverything() {

}


// Start main Vue.js App when config is loaded
const app = new Vue({
    router: router,
    el: '#app',
    store,
    template: app_template,
    computed: {
      hasLoadedData() {
        // Or whatever criteria you decide on to represent that the
        // app state has finished loading.
        return this.$store.state.finishedLoading;
      }
    },
    created: function()
    {
      localStorage.setItem('log', 'debug');
      loadEverything();
    },
    beforeMount: function() {

    },
    mounted: function() {
        console.log('Game initialized');
    }
});


