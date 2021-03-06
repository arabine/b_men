
const router = new VueRouter({
  mode: 'hash',
  routes: [
    { path: '/', name: 'menu', meta: { }, component: MenuView   },
    { path: '/game', name: 'game', meta: { }, component: GameView   },
    { path: '*', redirect: '/'}
  ]
});

var app_template = /*template*/`
<router-view></router-view>
`

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
    },
    beforeMount: function() {

    },
    mounted: function() {
        console.log('Game initialized');
    }
});


