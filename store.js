
Vue.prototype.$eventHub = new Vue(); // Global event bus

const store = new Vuex.Store({

  state: {
    lights: [],
    groups: [],
    finishedLoading: false,
    isInactivity: false,
    infos: {}
  },
  //====================================================================================================================
  mutations: {
   
  },
  //====================================================================================================================
  actions: {
    
  },
  //====================================================================================================================
  getters: {
  }
});
