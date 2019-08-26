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

  <template v-for="(g, i) in grid">
    <rect ry="10" :x="g.x" :y="g.y" width="110" height="155" v-bind:style="{ fill: g.camp }" :data-index="i" data-drop-zone="camping" class="droppable"/>
    <text :x="g.x + 40" :y="g.y + 80" 
        font-family="VTC" 
        font-size="60"
        font-style="bold">
        {{g.state}}
    </text>
  </template>

  <Trash
    x="200" 
    y="400"
    class="droppable"
    data-index="0"
    data-drop-zone="trash"
  >
  </Trash>

  <!-- Joueur humain -->
  <PlayerIcon 
    x="20" 
    y="800"
    color="blue"
    class="droppable"
    data-index="0"
    data-drop-zone="bibine"
    ref="bibineBlue"
  >
  </PlayerIcon>

  <!-- Adversaire -->
  <PlayerIcon 
    x="1500" 
    y="800"
    color="red"
    class="droppable"
    data-index="0"
    data-drop-zone="adversaire"
    ref="bibineRed"
  >
  </PlayerIcon>

  <template v-for="(c, i) in cards"> 
    <Card v-bind:x="450+210*i"  v-bind:y="750" v-bind:id="i" v-bind:data-index="i" class="card" :data="c"></Card>
  </template>

</svg>

<CanvasLayer ref="canvasLayer"/>

<Power ref="powerPopup"></Power>
</div>
`;

const helpContents = /*template*/`
<h1>Comment jouer</h1>
<p>Vous disposez de 5 cartes de trois types : défense, attaque et bibine</p>
<p>Vous êtes le joueur Bleu et jouez en premier. A chaque tour, jouez une et une seule carte.</p>
<p>Une carte "défense" se joue sur un emplacement de Camping, libre ou déjà occupé par vous</p>
<p>Une carte "attaque" se joue sur un emplacement adverse ou directement sur le verre de Pastis adverse pour le faire diminuer.</p>
<p>Une care "bibine se joue sur votre verre de Pastis, pour en augmenter le niveau.</p>
<p>Enfin, une poubelle est à votre disposition pour vous défausser d'une carte en main.</p>

<h1>Condition de victoire</h1>
<p>Le gagnant est celui qui arrivera à occuper tous les emplacements du Camping.</p>
`;

const victoryContents = /*template*/`
<h1>Vous avez gagné !!</h1>
`;

const lostContents = /*template*/`
<h1>Vous avez perdu :( :(</h1>
`;

const powerTemplate =  /*template*/`
<div>
  <h1>Choisissez votre pouvoir spécial</h1>
  <select id="monselect" v-model="selected">
    <option value="0">Tempête sur le Camping : effacez des emplacements adverses</option> 
    <option value="1">Mal de tête : bloquez le joueur adverse pendant plusieurs tours</option>
    <option value="2">Pétanque Master : videz la Bibine adverse</option>
  </select>
</div>
`;

const MAX_POINTS = 5;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

Power = {
  name: 'power',
  template: powerTemplate,
  data() {
    return {
      popup: null,
      selected: 0
    }
  },
  methods: {
    show() {
      // open modal
      this.popup.open();
    },
    getPower() {
      return this.selected;
    }
  },
  mounted() {
    // instanciate new modal
    this.popup = new tingle.modal({
      footer: true,
      stickyFooter: true,
      closeMethods: ['button'],
      closeLabel: "Close"
    });

    this.popup.setContent(this.$el);

    // add a button
    this.popup.addFooterBtn('Close', 'tingle-btn tingle-btn--default tingle-btn--pull-right', () => {
      // here goes some logic
      this.popup.close();
    });
  }
};

GameView = {
  name: 'game-view',
  template: game_view_template,
  components: { MenuItem, PlayerIcon, Card, Trash, Power, CanvasLayer },
  //====================================================================================================================
  data: function () {
    return {
      loaded: false,
      initialized: false,
      images: [ 'images/background.svg', 'images/menu_1.svg', 'images/menu_2.svg' ],
      dragHandler: d3.drag(),
      cards: [],
      grid: [],
      popup: null,
      music: null,
      matrix: [],
      effects: null
    }
  },
  computed: {
      
  },
  //====================================================================================================================
  created() {
    this.loadEverything();

    // Create the grid
    for (let j = 0 ; j < 3; j++) {     
      for (let i = 0 ; i < 9; i++) {
        this.grid.push( {
          state: 0,
          camp: "transparent",
          x: 765 + i*123,
          y: 190 + j*175
        });
      }
    }

    // Create the matrix
    this.matrix = [];
    for(let i = 0; i < 5; i++) {
        this.matrix[i] = [];
        for(var j = 0; j < 11; j++) {
            this.matrix[i][j] = 'verboten';
        }
    }


    this.effects = new Map();
    this.effects.set('rain', { file: 'sounds/rain.webm', start: this.startRain, stop: this.stopRain });
    this.effects.set('power', { file: this.getRandomZap, start: this.startLightnings, stop: this.stopLightnings });
    this.effects.set('trash', { file: 'sounds/trash.ogg' });

    
    
  },
  //====================================================================================================================
  beforeDestroy() {
    this.$eventHub.$off('menuClicked');
    this.music.stop();
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
        let c = d3.select(this);
        c.attr("x", d3.event.x + deltaX)
          .attr("y", d3.event.y + deltaY);

        app.isSelected(d3.event.x, d3.event.y, parseInt(c.attr('data-index')));
    })
    .on("end", function () {
      let c = d3.select(this);
      
      let card_idx = parseInt(c.attr('data-index'));
      let dest = app.isSelected(d3.event.x, d3.event.y, card_idx);

      if (dest.accept_drop) {
        app.dropCard(dest, card_idx);
      }
      // back to bottom of screen
      c.attr("x", savedX)
      .attr("y", savedY);
      app.clearDrops();
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
        this.createPopup();

        this.music = new Howl({
          src: ['sounds/adventure.webm'],
          autoplay: true,
          loop: true,
          onload : () => {
            this.loaded = true;
          }
        });

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
              .attr('data-state', '')
              .attr('data-drop-zone', rect.attr('data-drop-zone')) // On copie le type de la zone droppable dans le carré constuit (pour réutilisation)
              .attr('data-index', rect.attr('data-index'));
          });

        //  this.$eventHub.$emit('menuClicked', 'power');
          this.$refs.powerPopup.show();
        });

    })
    .catch(function(error) {
      console.log("Promise get files error: " + error);
    });
  },
  //====================================================================================================================
  methods: {
    startLightnings() {
      this.$refs.canvasLayer.startLightnings();
    },
    stopLightnings() {
      this.$refs.canvasLayer.stopLightnings();
    },
    startRain() {
      this.$refs.canvasLayer.startRain();
    },
    stopRain() {
      this.$refs.canvasLayer.stopRain();
    },
    getRandomZap() {
      let zap = getRandomInt(5);
      return 'sounds/zap' + zap + '.ogg';
    },
    play_effect(effect_list) {

      let obj = this.effects.get(effect_list[0]);

      if (obj !== undefined) {
        let fileName = isFunction(obj.file) ? obj.file() : obj.file;

        let sound = new Howl({
            src: [fileName],
            volume: 0.7,
            onend: () => {
              if (obj.stop !== undefined) {
                obj.stop();
              }
              effect_list.shift();
              if (effect_list.length > 0) {
                  this.play_effect(effect_list);
              }
            }
        });
        if (obj.start !== undefined) {
          obj.start();
        }
        sound.play();
      } else {
        effect_list.shift();
        if (effect_list.length > 0) {
            this.play_effect(effect_list);
        }
      }
    },
    createDef: function(xml, id_name) {
      let g = d3.select('#mainsvg defs');
      let node = document.importNode(xml.documentElement, true);
      d3.select(node).attr("id", id_name);
      g.node().appendChild(node);
    },
    isGridEmpty: function(camp) {
      let empty = true;
      for (let j = 0 ; j < 27; j++) {
          if (this.grid[j].camp == camp) {
            empty = false;
          }
      }
      return empty;
    },
    isNextToCard: function(i, camp) {
      let nextTo = false;
      
      let y = Math.floor(i/9);
      let x = Math.floor(i - (9*y));

      x += 1;
      y += 1;

      if ((this.matrix[y][x+1] == camp) ||
          (this.matrix[y][x-1] == camp) ||
          (this.matrix[y+1][x] == camp)  ||
          (this.matrix[y-1][x] == camp) )
      {
        nextTo = true;
      }
      
      return nextTo;
    },
    isSelected: function(x, y, card_id) {

      let app = this;

      let destination = {
        accept_drop: false,
        index: 0,
        type: ''
      };

      d3.selectAll(".drop-area").each(function(d,i) {
        let rect = d3.select(this);
        let xmin = parseInt(rect.attr('x'));
        let ymin = parseInt(rect.attr('y'));
        let xmax = xmin + parseInt(rect.attr('width'));
        let ymax = ymin + parseInt(rect.attr('height'));
       
        let accept_drop = false;
        let drop_zone = rect.attr('data-drop-zone');
        let index = parseInt(rect.attr('data-index'));

        if ((x >= xmin) && (x < xmax) && (y >= ymin) && (y < ymax)) {

          // On vérifie si la carte peut être jouée ici:
          if (drop_zone == 'trash') {
            // Le plus facile
            accept_drop = true;

          // ==========  ZONE CAMPING, LA GRILLE ==========
          } else if (drop_zone == 'camping') {
            // On va tester si l'emplacement est valide selon la carte
            if (app.cards[card_id].category == 'attack') {
              if (app.grid[index].camp == 'red') {
                accept_drop = true;
              }
            }
            
            if (app.cards[card_id].category == 'defense') {
              if ((app.grid[index].camp == 'blue') && (app.grid[index].state < MAX_POINTS)) {
                accept_drop = true;
              } else if (app.grid[index].camp == 'transparent') {
                  if (app.isGridEmpty('blue')) {
                    accept_drop = true;
                  } else {
                    // On n'autorise que les cartes adjacentes à une autre
                    accept_drop = app.isNextToCard(index, 'blue');
                  }
              }
            }

          // ==========  ZONE JOUEUR HUMAIN, LA BIBINE ==========
          } else if (drop_zone == 'bibine') {
            if (app.cards[card_id].category == 'bibine') {
                accept_drop = true;
            }
          
          // ==========  ZONE JOUEUR ADVERSE ==========
          } else if (drop_zone == 'adversaire') {
            if (app.cards[card_id].category == 'attack') {
              accept_drop = true;
            }
          }
        }

        if (accept_drop) {
          rect.attr('data-state', 'ok');
          destination.accept_drop = true;
          destination.type = drop_zone;
          destination.index = index;
          return;
        } else {
          rect.attr('data-state', '');
          // Continue scanning other drop areas
        }

      });

      return destination;
    },
    dropCard(dest, card_idx) {
      let power = this.$refs.powerPopup.getPower();

      // On envoie au serveur notre carte jouée, en retour on reçoit la conséquence et le jeu de l'adversaire
      Api.sendCard({card_idx: card_idx, dest: dest, power: power }).then((action) => {
          console.log("Received: " + JSON.stringify(action));

          // Update the grid
          for (let i = 0 ; i < 9*3; i++) {
            this.grid[i].camp = action.grid[i].camp;
            this.grid[i].state = action.grid[i].state;

            // update the matrix
            let y = Math.floor(i/9);
            let x = Math.floor(i - (9*y));
            this.matrix[y+1][x+1] = action.grid[i].camp;
          }

          if (action.result == 'victory') {
            this.cards = [];
            this.$nextTick(() => {
              this.$eventHub.$emit('menuClicked', 'victory');
            });
          } else if (action.result == 'lost') {
            this.cards = [];
            this.$nextTick(() => {
              this.$eventHub.$emit('menuClicked', 'lost');
            });
          } else {

            this.$refs.bibineBlue.updatePastisLevel(action.bibine);
            this.$refs.bibineRed.updatePastisLevel(action.opponent);

            // Update the player's cards
            this.cards = action.cards;

            // Chain effects
            this.play_effect(action.effects);
          }
        });

    },
    clearDrops() {
      d3.selectAll(".drop-area").each(function(d,i) {
        d3.select(this).attr('data-state', '');
      });
    },
    async loadEverything() {
      // Api.fetchCards();
       this.cards = await Api.fetchPlayerCards();
       this.$nextTick(() => {
        this.dragHandler(d3.selectAll(".card"));
       });
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
        if (id == 'menu_2') {
          // set content
          this.popup.setContent(helpContents);
          this.popup.open();
        } else if (id == 'victory') {
          this.popup.setContent(victoryContents);
          this.popup.open();
        } else if (id == 'lost') {
          this.popup.setContent(lostContents);
          this.popup.open();
        } else if (id == 'power') {
          this.popup.setContent(choosePowerContents);
          this.popup.open();
        }
      });

    }

    

  }
};
