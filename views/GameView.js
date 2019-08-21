var game_view_template = /*template*/`
<div>
<div v-show="!loaded" class="loader"></div>

<svg v-show="loaded" id="mainsvg"  viewBox="0 0 1920 1080">
  <defs>
  </defs>

  <rect x="0" y="0" width="1920" height="1080"  style="fill: transparent; stroke: black; stroke-width: 3"/>
  
  <MenuItem 
        title="Quitter"
        v-bind:x="10" 
        v-bind:y="10" 
        id="menu_1">
  </MenuItem>

  <MenuItem 
        title="Aide"
        v-bind:x="10" 
        v-bind:y="120" 
        id="menu_2">
  </MenuItem>

  <use href="#background" x="700" y="20" />
  <Trash
    x="200" 
    y="400"
    class="droppable"
  >
  </Trash>

  <PlayerIcon 
    x="20" 
    y="800"
    color="blue"
    class="droppable"
  >
  </PlayerIcon>

  <PlayerIcon 
    x="1500" 
    y="800"
    color="red"
    class="droppable"
  >
  </PlayerIcon>

    <template v-for="(c, i) in cards"> 
      <Card v-bind:x="450+210*i"  v-bind:y="750" v-bind:id="i" class="card" :data="c"></Card>
    </template>

</svg>
</div>
`
/*
< Card v-bind:x="450+0" v-bind:y="750" v-bind:id="0" class="card"></Card>
      <Card v-bind:x="450+210"  v-bind:y="750" v-bind:id="1" class="card"></Card>
      <Card v-bind:x="450+420"  v-bind:y="750" v-bind:id="2" class="card"></Card>
      <Card v-bind:x="450+630"  v-bind:y="750" v-bind:id="3" class="card"></Card>
      <Card v-bind:x="450+840"  v-bind:y="750" v-bind:id="4" class="card"></Card>
*/

GameView = {
  name: 'game-view',
  template: game_view_template,
  components: { MenuItem, PlayerIcon, Card, Trash },
  //====================================================================================================================
  data: function () {
    return {
      loaded: false,
      initialized: false,
      images: [ 'images/background.svg', 'images/menu_1.svg', 'images/menu_2.svg' ],
      dragHandler: d3.drag(),
      cards: []
    }
  },
  computed: {
    
  },
  //====================================================================================================================
  created() {
    this.loadEverything();
  },
  //====================================================================================================================
  beforeDestroy() {
    this.$eventHub.$off('menuClicked');
  },
  //====================================================================================================================
  mounted: function() {

    console.log('Mounted view GameView');

    this.$eventHub.$on('menuClicked', id => {
      if (id == 'menu_1') {
        this.$router.push({ name: 'menu' });
      }
    });

    let app = this;

    let savedX, savedY;
    let deltaX, deltaY;
    
    this.dragHandler.on("start", function () {
      let current = d3.select(this);
      savedX = current.attr("x");
      savedY = current.attr("y");

      deltaX = current.attr("x") - d3.event.x;
      deltaY = current.attr("y") - d3.event.y;

      current.raise();
    })
    .on("drag", function () {
        d3.select(this)
            .attr("x", d3.event.x + deltaX)
            .attr("y", d3.event.y + deltaY);
        app.isSelected(d3.event.x, d3.event.y);
    })
    .on("end", function () {
      d3.select(this)
          .attr("x", savedX)
          .attr("y", savedY);
    });

    let imageFiles = [ ];

    for (let i = 0; i < this.images.length; i++) {
      imageFiles.push(d3.xml(this.images[i]));
    }
    
    // We must wait for all data to be fetched before compute various sizes
    Promise.all(imageFiles).then((list) =>
    {
        for (let i = 0; i < list.length; i++) {

          let filenameFull =  this.images[i].replace(/^.*[\\\/]/, '');
          let filenameOnly = filenameFull.replace(/\.[^/.]+$/, "");

        //  console.log('filenameFull ' + filenameFull + ' filenameOnly ' + filenameOnly);
          this.createDef(list[i], filenameOnly);
        }
        this.loaded = true;
        this.$nextTick(() => {
          d3.selectAll(".droppable").each(function(d,i) {
            let rect = d3.select(this);
            d3.select('#mainsvg')
              .append('rect')
              .attr('x', rect.attr('x'))
              .attr('y', rect.attr('y'))
              .attr('width', rect.attr('width'))
              .attr('height', rect.attr('height'))
              .attr('class', 'drop-area')
              .attr('data-state', '');
          });
        });

    })
    .catch(function(error) {
      console.log("Promise get files error: " + error);
    });
  },
  //====================================================================================================================
  methods: {
    createDef: function(xml, id_name) {
      let g = d3.select('#mainsvg defs');
      let node = document.importNode(xml.documentElement, true);
      d3.select(node).attr("id", id_name);
      g.node().appendChild(node);
    },
    isSelected: function(x, y) {

      d3.selectAll(".drop-area").each(function(d,i) {
        let rect = d3.select(this);
        let xmin = parseInt(rect.attr('x'));
        let ymin = parseInt(rect.attr('y'));
        let xmax = xmin + parseInt(rect.attr('width'));
        let ymax = ymin + parseInt(rect.attr('height'));
       
        if ((x >= xmin) && (x < xmax) && (y >= ymin) && (y < ymax)) {
          d3.select(this).attr('data-state', 'ok');
        } else {
          d3.select(this).attr('data-state', '');
        } 

      });
    },
    async loadEverything() {
      // Api.fetchCards();
       this.cards = await Api.fetchPlayerCards();
       this.$nextTick(() => {
        this.dragHandler(d3.selectAll(".card"));
       });
     }

    

  }
};
