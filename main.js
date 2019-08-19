const { app, BrowserWindow } = require('electron');
const http = require('http');

const server = http.createServer();

const cards = [
    {
        "title": "Tente",
        "category": "defense",
        "picture": "tente",
        "text": "Planter sa tente marque le territoire du Campeur. You shall not pass, comme dirait l'autre.",
        "power": "1",
        "duration": "0", // 0 means until destroyed

    }


];




server.on('request', (req, res) => {
  if (req.url === '/cards') {

    res.writeHead(200);
    // res.writeHead(200, {"Content-Type": "text/html"});
    res.end('Salut tout le monde !');
  
  } else {
    res.end('Route not found');
  }
});

server.listen(3000);

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

  win.setAspectRatio(16/9);
  // and load the index.html of the app.
  win.loadFile('index.html');
}

app.on('ready', createWindow);
