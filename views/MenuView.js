var menu_view_template = /*template*/`
<div>
<div v-show="!loaded" class="loader"></div>

<svg v-show="loaded" id="mainsvg"  viewBox="0 0 1920 1080">
  <defs>
  </defs>

  <rect x="0" y="0" width="1920" height="1080"  style="fill: transparent; stroke: black; stroke-width: 3"/>
  <!-- Title -->
  <text x="660" y="150"
        font-family="Badaboom"
        font-size="150">
        The B-Men
  </text>

  <text x="700" y="250"
        font-size="60">
        Le commencement
  </text>

  <!-- L'image de couverture -->
  <svg x="50" y="400">       
    <image xlink:href="images/cover.png" width="1000" height="603"  draggable="false" onmousedown="if (event.preventDefault) event.preventDefault()"/>
  </svg>
  
  <!-- Menu -->
  <svg id="svgroot" x="1200" y="400">
    <template v-for="item in menuItems">
      <MenuItem 
        :title="item.title"
        :x="item.x" 
        :y="item.y" 
        :id="item.id">
      </MenuItem>
   </template>
  </svg>


</svg>
</div>
`

const historyContents = /*template*/`
<h1>Histoire du Jeu</h1>
<p>Vous incarnez une personne extraordinaire disposant d'un gène mutant appelé la mutation B.E.A.U.F 
(pour Bête Entêté Abruti Unique Forme de vie) qui vous donne un et un seul pouvoir spécial.</p>
<p>L'histoire se déroule au Camping Municipal des Trois Pins. Une lutte acharnée oppose des B-Men de différentes régions de france
dans le but d'obetenir le meilleur emplacement : celui à l'ombre près des WC.</p>
`

const aboutContents = /*template*/`
<h1>A propos du Jeu</h1>
<p>Ce jeu a été réalisé dans le cadre de la GameJam Canard PC de 2019 : Make Something Horrible.</p>
<p>Contact : Anthony (anthony@rabine.fr)</p>
`

MenuView = {
  name: 'menu-view',
  template: menu_view_template,
  components: { MenuItem },
  //====================================================================================================================
  data: function () {
    return {
      loaded: false,
      music: null,
      popup: null,
      menuItems: [
        { title: 'Jouer', id:'play', file:'images/menu_1.svg', x: 0, y: 0 },
        { title: 'Histoire', id: 'history', file:'images/menu_2.svg', x: 0, y: 120 },
        { title: 'A propos', id: 'about', file:'images/menu_3.svg', x: 0, y: 240 }
      //  { title: 'Quitter', file:'menu_4.svg', link:'' }
      ]
    }
  },
  //====================================================================================================================
  computed: {
    
  },
  //====================================================================================================================
  beforeDestroy() {
    this.$eventHub.$off('menuClicked');
    this.music.stop();
  },
  //====================================================================================================================
  mounted: function() {

    console.log('Mounted view MenuView');
    this.createPopup();  

    let imageFiles = [];

    for (let i = 0; i < this.menuItems.length; i++) {
      imageFiles.push(d3.xml(this.menuItems[i].file));
    }

    // We must wait for all data to be fetched before compute various sizes
    Promise.all(imageFiles).then((list) =>
    {
        for (let i = 0; i < list.length; i++) {
          this.createDef(list[i], this.menuItems[i].id);
        }

        this.music = new Howl({
          src: ['sounds/holy.webm'],
          autoplay: true,
          loop: true,
        });
        
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
    createPopup() {

      // instanciate new modal
      this.popup = new tingle.modal({
        footer: true,
        stickyFooter: true,
        closeMethods: ['button'],
        closeLabel: "Close"
      });

      // add a button
      this.popup.addFooterBtn('Close', 'tingle-btn tingle-btn--default tingle-btn--pull-right', () => {
        // here goes some logic
        this.popup.close();
      });

      this.$eventHub.$on('menuClicked', id => {
        if (id == 'history') {
          // set content
          this.popup.setContent(historyContents);
          this.popup.open();
        } else if (id == 'about') {
          this.popup.setContent(aboutContents);
          this.popup.open();
        } else if (id == 'play') {
          this.$router.push({ name: 'game' });
        }
      });

    }

   }
};
