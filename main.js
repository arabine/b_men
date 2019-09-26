const { app, BrowserWindow } = require('electron');

let http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');

let appDir = path.dirname(require.main.filename);

let mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "json": "application/json",
    "css": "text/css",
    "svg": "image/svg+xml",
    "ico": "image/x-icon",
    "woff2": "application/font-woff2",
    "ttf": "application/octet-stream",
    "webm": "audio/webm",
    "ogg": "audio/ogg"
};

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const MAX_POINTS = 5; // poins max par emplacement

// Elements communs du jeu
let grid = [];
let cards = [];
let game_result = '';
let effects = [];
let matrix = [];

// joueur humain
let player_cards = [];
let player_bibine = 0; // Bibine : de 0 à 10 (max)
let player_blocked = 0;

// joueur ordinateur (IA)
let opponent_cards = [];
let opponent_bibine = 0; // Bibine : de 0 à 10 (max)
let opponent_power = 0;
let opponent_blocked = 0;

function initializeGame()
{
  let filename = path.join(appDir, '/engine/cards.json');
  let rawdata = fs.readFileSync(filename);
  cards = JSON.parse(rawdata);

  console.log("Init game engine");

  // Create the grid
  grid = [];
  for (let j = 0 ; j < 3; j++) {
    for (let i = 0 ; i < 9; i++) {
      grid.push( {
        state: 0,
        camp: "transparent"
      });
    }
  }

  function piocheNewCard()
  {
    // pourcentage de piocher des cartes :
    // 0-49 : carte commune
    // 50-89 : carte super
    // 90-99 : carte mega
    
    let category = getRandomInt(100);

    if (category < 50) {
      return cards['common'][getRandomInt(cards['common'].length)];
    } else if (category >= 90) {
      return cards['mega'][getRandomInt(cards['mega'].length)];
    } else {
      return cards['super'][getRandomInt(cards['super'].length)];
    }

  }

  // Create the matrix
  matrix = [];
  for(let i = 0; i < 5; i++) {
      matrix[i] = [];
      for(var j = 0; j < 11; j++) {
          matrix[i][j] = 'verboten';
      }
  }

  // Init player cards
  player_cards = [];
  for (let i = 0; i < 5; i++) {
    player_cards.push(piocheNewCard());
  }

  // Init opponent cards
  opponent_cards = [];
  for (let i = 0; i < 5; i++) {
    opponent_cards.push(piocheNewCard());
  }

  player_bibine = 0;
  player_blocked = 0;

  opponent_bibine = 0;
  opponent_power = getRandomInt(3);
  opponent_blocked = 0;

  game_result = '';
}

function removeCard(index, camp) {
  // on vire cette carte et on en tire une autre
  if (camp == 'blue') {
    player_cards.splice(index, 1);
    player_cards.push(piocheNewCard());
  } else {
    opponent_cards.splice(index, 1);
    opponent_cards.push(piocheNewCard());
  }
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}

function clearEmplacements(list, max)
{
  let loops = (list.length > max) ? max : list.length;

  for (let i = 0; i < loops; i++) {
    grid[list[i]].state = 0;
    grid[list[i]].camp = 'transparent';
  }
}

function triggerPower(power, camp)
{
  // 0 : efface emplacements ennemis
  // 1 : bloquez l'adversaire
  // 2 : vide la bibine

  console.log(">>>>>>>>>   TRIGGER POWER: " + power + " for camp: " + camp);

  effects.push('power');

  if (camp == 'blue') {
    if (power == 0) {
      let e_list = getEmplacements('red');
      clearEmplacements(shuffle(e_list), 3 + getRandomInt(3));
      effects.push('rain');

    }  else if (power == 1) {
      opponent_blocked = 3;
    } else if (power == 2) {
      opponent_bibine = 0;
    }
  } else {
    if (power == 0) {
      let e_list = getEmplacements('blue');
      clearEmplacements(shuffle(e_list), 3 + getRandomInt(3));
      effects.push('rain');

    } else if (power == 1) {
      player_blocked = 3;
    } else if (power == 2) {
      player_bibine = 0;
    }
  }
}


function isNextToCard(i, camp) {
  let nextTo = false;
  
  let y = Math.floor(i/9);
  let x = Math.floor(i - (9*y));

  x += 1;
  y += 1;

  if ((matrix[y][x+1] == camp) ||
      (matrix[y][x-1] == camp) ||
      (matrix[y+1][x] == camp)  ||
      (matrix[y-1][x] == camp) )
  {
    nextTo = true;
  }
  
  return nextTo;
}


function isGridEmpty(camp) {
  let empty = true;
  for (let j = 0 ; j < 27; j++) {
      if (grid[j].camp == camp) {
        empty = false;
      }
  }
  return empty;
}

function playCard(action, camp)
{
  console.log(" Played card: " + action.card_idx + " in " + action.dest.type + " for player: " + camp);

  let c;
  
  if (camp == 'blue') {
    c = player_cards[action.card_idx];
  } else {
    c = opponent_cards[action.card_idx];
  }

  // ===============  CARTE JOUEE SUR LA POUBELLE  ===============
  if (action.dest.type == 'trash') {
    removeCard(action.card_idx, camp);

  // ===============  CARTE JOUEE SUR LE CAMPING  ===============
  } else if (action.dest.type == 'camping') {
    
    let can_play = false;

    if (c.category == 'defense') {
      if ((grid[action.dest.index].camp == 'transparent') || (grid[action.dest.index].camp == camp)) {

        if (grid[action.dest.index].state < MAX_POINTS) {
          grid[action.dest.index].state += c.value;
          if (grid[action.dest.index].state > MAX_POINTS) {
            grid[action.dest.index].state = MAX_POINTS; // Saturation
          }
          grid[action.dest.index].camp = camp;

          // Update the matrix
          let y = Math.floor(action.dest.index/9);
          let x = Math.floor(action.dest.index - (9*y));
          matrix[y+1][x+1] = camp;

          can_play = true;
        }
      }
    }

    if (c.category == 'attack') {
      if (isOpponent(grid[action.dest.index].camp, camp)) {
        grid[action.dest.index].state -= c.value;

        if (grid[action.dest.index].state <= 0) {
          grid[action.dest.index].state = 0;
          grid[action.dest.index].camp = 'transparent';
        }
        can_play = true;
      }
    }

    if (can_play) {
      removeCard(action.card_idx, camp);
    }


  // ===============  CARTE JOUEE SUR LA BIBINE  ===============
  } else if (action.dest.type == 'bibine') {

    if (c.category == 'bibine') {
      if (camp == 'blue') {
        player_bibine += c.value;
        if (player_bibine > 10) {
          player_bibine = 0;
          triggerPower(action.power, 'blue');
        }
        
      } else {
        opponent_bibine += c.value;
        if (opponent_bibine > 10) {
          opponent_bibine = 0;
          triggerPower(opponent_power, 'red');
        }
      }

      removeCard(action.card_idx, camp);
    }

  // ===============  CARTE JOUEE SUR LA BIBINE ADVERSE  ===============
  } else if (action.dest.type == 'adversaire') {
    if (c.category == 'attack') {
      if (camp == 'blue') {
        opponent_bibine -= c.value;
        if (opponent_bibine < 0) {
          opponent_bibine = 0;
        }
      } else {
        player_bibine -= c.value;
        if (player_bibine < 0) {
          player_bibine = 0;
        }
      }

      removeCard(action.card_idx, camp);
    }
  }

}

function isOpponent(camp1, camp2) {
  let opp = false;
  if ((camp1 != 'transparent') && (camp2 != 'transparent')) {
    if (camp1 != camp2) {
      opp = true;
    }
  }

  return opp;
}

function hasWon(camp) {
  let won = false;

  let count = getEmplacements(camp).length;

  if (count >= (9*3)) {
    won = true;
  }

  return won;
}

function getEmplacements(camp)
{
  let e_list = [];

  for (let i = 0 ; i < (9*3); i++) {
    if (grid[i].camp == camp) {
      e_list.push(i);
    }
  }

  return e_list;
}

function hasEmplacement(camp)
{
  let index = -1;
  let e_list = getEmplacements(camp);

  if (e_list.length >= 2) {
    // On choisit un emplacement au hasard
    index = e_list[getRandomInt(e_list.length)];
  }

  return index;
}

function strategyBibine(action, c)
{
  if (c.category == 'bibine') {
    action.dest.type = 'bibine';
    action.valid = true;
  }
  return action;
}

function conquer(e_list)
{
  let index = -1;
  e_list = shuffle(e_list);
  if (e_list.length >= 1) {
    // On choisit le premier emplacement valide
    for (let i = 0; i < e_list.length; i++) {
      if (isNextToCard(e_list[i], 'red')) {
        index = e_list[i];
        break;
      }
    }
  }

  return index;
}


function strategyAttack(action, c)
{
  let emplacement = hasEmplacement('blue');
  // Attaque
  if (c.category == 'attack') {
    if (player_bibine > 0) {
      action.dest.type = 'adversaire';
      action.valid = true;
    } else if (emplacement >= 0) {
      action.dest.type = 'camping';
      action.dest.index = emplacement;
      action.valid = true;
    }
  }
  return action;
}


function strategyEmplacement(action, c)
{
  if (c.category == 'defense') {
    
    if (isGridEmpty('red')) {
      // Grille vide, on place où l'on veut
      let freeEmpl = hasEmplacement('transparent');
      if (freeEmpl >= 0) {
        action.dest.type = 'camping';
        action.dest.index = freeEmpl;
        action.valid = true;
      }
    }

    if (!action.valid) {


      let e_list = getEmplacements('transparent');
      let index = conquer(e_list);

      if (index >= 0) {
        action.dest.type = 'camping';
        action.dest.index = index;
        action.valid = true;
      } else {
        let red_list = shuffle(getEmplacements('red'));

        if (red_list.length >= 1) {

          let i_found = -1;
          let min_points = MAX_POINTS;
          // On choisit l'emplacement avec les plus faibles points
          for (let i = 0; i < red_list.length; i++) {
            if (grid[red_list[i]].state < min_points) {
              min_points = grid[red_list[i]].state;
              i_found = red_list[i];
            }
          }

          if (i_found >= 0) {
            action.dest.type = 'camping';
            action.dest.index = i_found;
            action.valid = true;
          }
        }
      }
      
    }
  
  }
  return action;
}

function playComputerIA()
{
  let action = {
    card_idx: 0,
    dest: {
      type: 'trash',
      index: 0,
      accept_drop: true
    },
    power: 0,
    valid: false
  };
  let camp = 'red';

  let strategies = [0, 1, 2];

  for (let i = 0; (i < opponent_cards.length) && !action.valid; i++) {
    action.card_idx = i;
    let c = opponent_cards[i];
    
    strategies = shuffle(strategies);

    for (let s = 0; s < strategies.length; s++) {
      if (strategies[s] == 0) {
        action = strategyAttack(action, c);
      } else  if (strategies[s] == 1) {
        action = strategyEmplacement(action, c);
      } else  if (strategies[s] == 2) {
        action = strategyBibine(action, c);
      }

      if (action.valid) {
        break;
      }
    } 
  }

  playCard(action, camp);

  if (player_blocked > 0) {
    player_blocked--;
  }
}


function manageRest(req, res, uri)
{
  
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {

      if (uri == "/api/playcard") {
        console.log("=========================================================");
        console.log('Req: ' + body);

        try {
          let action = JSON.parse(body);

          effects = []; // empty effects list

          playCard(action, 'blue');

          if (opponent_blocked > 0) {
            opponent_blocked--;
          }

          if (hasWon('blue')) {
            game_result = 'victory';
          } else {
            if (opponent_blocked == 0) {
              // On fait jouer l'ordinateur tant que l'adversaire est bloqué
              do {
                playComputerIA();
              } while (player_blocked > 0);
            }
          }

          if (hasWon('red')) {
            game_result = 'lost';
          }

        //  effects.push('trash');
        //  effects.push('rain');
        //  effects.push('power');

          // On renvoit un objet contectant tout le statut du jeu que le front-end mettra à jour graphiquement
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({ grid: grid, cards: player_cards, bibine: player_bibine, opponent: opponent_bibine, result: game_result, effects: effects }));

        } catch(e) {

        }
      }
        
    });
  } else {
    if (uri == "/api/playercards")
    {
      initializeGame();

      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(player_cards));
    }
  }
}



http.createServer(function(req, res) {
    let uri = url.parse(req.url).pathname;
    
    console.log("Uri: " + uri);

    if (uri == "/") {
      uri = "/index.html";
    }

    let filename = path.join(appDir, uri);

    fs.exists(filename, function(exists) {
        if(!exists) {
          manageRest(req, res, uri);
        } else {
          let ext = path.extname(filename).split(".")[1];
      //   console.log("Ext: " + ext + " "+ filename);
          let mimeType = mimeTypes[ext];

          if (mimeType === undefined) {
            console.log("Not found: " + ext);
          }

          res.writeHead(200, {'Content-Type': mimeType});

          let fileStream = fs.createReadStream(filename);
          fileStream.pipe(res);
        }
    }); //end path.exists
}).listen(3000);

let debug = process.env.NODE_ENV !== "production";

function createWindow () {
  // Cree la fenetre du navigateur.
  let win = new BrowserWindow({
    width: 1280,
    height: 720,
    title: 'B-Men',
    center: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  if (debug) {
    win.loadFile('blank.html');
  } else {
    win.removeMenu();
    win.loadFile('index.html');
  }
}

app.on('ready', createWindow);
