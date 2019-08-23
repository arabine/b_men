const { app, BrowserWindow } = require('electron');

let http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');
	
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
    "webm": "audio/webm"
};

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

let cards = [];
let grid = [];
let player_cards = [];
let opponent_cards = [];

// Bibine : de 0 à 10 (max)
let player_bibine = 0;
let opponent_bibine = 0;

function initializeGame()
{
  let filename = path.join(process.cwd(), '/engine/cards.json');
  let rawdata = fs.readFileSync(filename);
  cards = JSON.parse(rawdata);

  console.log(" Init game engine: " + cards.length + " cards found");

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

  // Init player cards
  player_cards = [];
  for (let i = 0; i < 5; i++) {
    player_cards.push(cards[getRandomInt(cards.length)]);
  }

  // Init opponent cards
  opponent_cards = [];
  for (let i = 0; i < 5; i++) {
    opponent_cards.push(cards[getRandomInt(cards.length)]);
  }

  player_bibine = 0;
  opponent_bibine = 0;
}

function removeCard(index, camp) {
  // on vire cette carte et on en tire une autre
  if (camp == 'blue') {
    player_cards.splice(index, 1);
    player_cards.push(cards[getRandomInt(cards.length)]);
  } else {
    opponent_cards.splice(index, 1);
    opponent_cards.push(cards[getRandomInt(cards.length)]);
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
        grid[action.dest.index].state += c.value;
        grid[action.dest.index].camp = camp;
        can_play = true;
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
          // TODO: check pouvoir spécial
          player_bibine = 10;
        }
        
      } else {
        opponent_bibine += c.value;
        if (opponent_bibine > 10) {
          // TODO: check pouvoir spécial
          opponent_bibine = 10;
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

function hasEmplacement(camp)
{
  let index = -1;
  for (let i = 0 ; i < (9*3); i++) {
    if (grid[i].camp == camp) {
      return i;
    }
  }
  return index;
}


function playComputerIA()
{
  let action = {
    card_idx: 0,
    dest: {
      type: 'trash',
      index: 0,
      accept_drop: true
    }
  };
  let camp = 'red';

  for (let i = 0; i < opponent_cards.length; i++) {
    action.card_idx = i;
    let c = opponent_cards[i];
    let emplacement = hasEmplacement('blue');

    if (c.category == 'attack') {
      if (player_bibine > 0) {
        action.dest.type = 'adversaire';
        break;
      } else if (emplacement >= 0) {
        action.dest.type = 'camping';
        action.dest.index = emplacement;
        break;
      }
    }

    // Pas de else car on essaie d'autres stratégies
    if (c.category == 'bibine') {
      action.dest.type = 'bibine';
      break;
    }

    if (c.category == 'defense') {
      let freeEmpl = hasEmplacement('transparent');

      if (freeEmpl >= 0) {
        action.dest.type = 'camping';
        action.dest.index = freeEmpl;
        break;
      } else {
        let myEmpl = hasEmplacement('red');
        if (myEmpl >= 0) {
          action.dest.type = 'camping';
          action.dest.index = myEmpl;
          break;
        }
      }

    }

  }

  playCard(action, camp);
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
          playCard(action, 'blue');
          // On fait jouer l'ordinateur
          playComputerIA();

          // On renvoit un objet contectant tout le statut du jeu que le front-end mettra à jour graphiquement
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({ grid: grid, cards: player_cards, bibine: player_bibine, opponent: opponent_bibine }));

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

    let filename = path.join(process.cwd(), uri);

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
 // win.removeMenu();
  win.setAspectRatio(16/9);
  // and load the index.html of the app.
 // win.loadFile('index.html');
  win.loadFile('blank.html');
}

app.on('ready', createWindow);
