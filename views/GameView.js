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

  <use href="#background" x="500" y="50" />
  <use href="#trash" x="50" y="300" />

  <PlayerIcon 
    x="100" 
    y="800"
    color="blue">
  </PlayerIcon>

  <PlayerIcon 
    x="1400" 
    y="800"
    color="red">
  </PlayerIcon>

  
    <Card v-bind:x="550+0" v-bind:y="800" v-bind:id="0" class="card"></Card>
    <Card v-bind:x="550+150"  v-bind:y="800" v-bind:id="1" class="card"></Card>
    <Card v-bind:x="550+300"  v-bind:y="800" v-bind:id="2" class="card"></Card>
    <Card v-bind:x="550+450"  v-bind:y="800" v-bind:id="3" class="card"></Card>
    <Card v-bind:x="550+600"  v-bind:y="800" v-bind:id="4" class="card"></Card>

</svg>
</div>
`

GameView = {
  name: 'game-view',
  template: game_view_template,
  components: { MenuItem, PlayerIcon, Card },
  //====================================================================================================================
  data: function () {
    return {
      loaded: false,
      images: [ 'images/background.svg', 'images/trash.svg', 'images/menu_1.svg' ]
    }
  },
  computed: {
    
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

    let deltaX, deltaY;
    let dragHandler = d3.drag()
    .on("start", function () {
      let current = d3.select(this);
      deltaX = current.attr("x") - d3.event.x;
      deltaY = current.attr("y") - d3.event.y;
    })
    .on("drag", function () {
        d3.select(this)
            .attr("x", d3.event.x + deltaX)
            .attr("y", d3.event.y + deltaY);
    });

    dragHandler(d3.selectAll(".card"));


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
        
    })
    .catch(function(error) {
      console.log("Promise get files error: " + error);
    });
  },
  //====================================================================================================================
  methods: {
    createDef: function(xml, id_name)
    {
      var g = d3.select('#mainsvg defs');
      var node = document.importNode(xml.documentElement, true);
      d3.select(node).attr("id", id_name);
      g.node().appendChild(node);
    },
    

  }
};
