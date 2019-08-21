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

function initializeGame()
{
  let filename = path.join(process.cwd(), '/engine/cards.json');
  let rawdata = fs.readFileSync(filename);
  cards = JSON.parse(rawdata);

  console.log("=======================================");
  console.log(" Init game engine: " + cards.length + " cards found");
  console.log("=======================================");
}

function manageRest(req, res, uri)
{
	let status = false;
  
  if (uri == "/api/playercards")
  {
    initializeGame();

    console.log("=======================================");
    console.log(" API: fetch player cards");
    console.log("=======================================");

    let p_cards = [];
    for (let i = 0; i < 5; i++) {
      p_cards.push(cards[getRandomInt(cards.length)]);
    }

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(p_cards));
    status = true;

  }
	
	return status;
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
          if (!manageRest(req, res, uri)) {
            console.log("not exists: " + filename);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('404 Not Found\n');
      
          }
			    return;
        }
        let ext = path.extname(filename).split(".")[1];
        console.log("Ext: " + ext + " "+ filename);
        let mimeType = mimeTypes[ext];

        if (mimeType === undefined) {
          console.log("Not found: " + ext);
        }

        res.writeHead(200, {'Content-Type': mimeType});

        let fileStream = fs.createReadStream(filename);
        fileStream.pipe(res);

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
  win.loadFile('index.html');
 // win.loadFile('blank.html');
}

app.on('ready', createWindow);
