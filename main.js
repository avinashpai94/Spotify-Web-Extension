// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron');
const path = require('path');
const Buffer = require('buffer').Buffer;
let express = require('express');
let request = require('request');
let querystring = require('querystring');
let express_app = express();
let cors = require('cors')
var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);


let playing, repeating, shuffling, name;

// var auth_token = 'BQCcO_8DxEPzAFeUPX9F5HISQUbIxXaCyn0VIB5fY5UtbSpwK6OEHV7CMx8eolzbVSGU2jAAr5bp1ZTKTwMbyBa0AJtDR-bAtSfkwPLKsquNkv3t8B3Fk6vLFm9o82h1kyyBcBLiS_a98Q2h1fiq6G57VRBX_nrj1QseaGkVmY7QsYqCQgQCbHr5IVHn'

let auth_token;

// var whitelist = ['http://localhost:3000', 'http://localhost:8888']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

express_app.use(cors());

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
// let mainWindow;

// function createWindow () {
//   // Create the browser window.
//   mainWindow = new BrowserWindow({
//     width: 320,
//     height: 100,
//     frame: false,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js')
//     }
//   })

//   mainWindow.loadURL(`http://localhost:8888/login`)

//   mainWindow.setMenuBarVisibility(false);

//   // and load the index.html of the app.
//   // mainWindow.loadFile('index.html')

//   // Open the DevTools.
//   // mainWindow.webContents.openDevTools()

//   // Emitted when the window is closed.
//   mainWindow.on('closed', function () {
//     // Dereference the window object, usually you would store windows
//     // in an array if your app supports multi windows, this is the time
//     // when you should delete the corresponding element.
//     mainWindow = null
//   })
// }

// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.on('ready', createWindow)

// // Quit when all windows are closed.
// app.on('window-all-closed', function () {
//   // On macOS it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   if (process.platform !== 'darwin') app.quit()
// })

// app.on('activate', function () {
//   // On macOS it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (mainWindow === null) createWindow()
// })

// // In this file you can include the rest of your app's specific main process
// // code. You can also put them in separate files and require them here.




let authOptions;

let redirect_uri =
  process.env.REDIRECT_URI ||
  'http://localhost:8888/callback'

express_app.get('/login', function (req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email user-read-playback-state user-modify-playback-state',
      redirect_uri
    }))
})

express_app.get('/player_state', function (req, res) {
  var inp_url = 'https://api.spotify.com/v1/me/player';
  let code = req.query.code || null
  authOptions = {
    url: inp_url,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' +
        auth_token
    },
    json: true
  }
  request.get(authOptions, function (error, response, body) {    
    if (error) {
      res.sendStatus(error);
    }
    name = response.body['item']['name']
    playing = response.body['is_playing']
    repeating = response.body['repeat_state'];
    shuffling = response.body['shuffle_state'];
    console.log(name)
    res.send({ name : name, is_playing : playing, repeat_state : repeating, shuffle_state : shuffling});
  })
})


express_app.get('/play', function(req, res){
  var inp_url = playing ? 'https://api.spotify.com/v1/me/player/pause' : 'https://api.spotify.com/v1/me/player/play';
  playing = !playing;
  let code = req.query.code || null
  authOptions = {
    url: inp_url,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + 
        auth_token
    },
    json: true
  } 
  request.put(authOptions, function (error, response, body) {
    if(error){
      res.sendStatus(error);
    }
    res.sendStatus(200);
  })
})


express_app.get('/prev', function (req, res) {
  var inp_url = 'https://api.spotify.com/v1/me/player/previous' ;
  playing = !playing;
  let code = req.query.code || null
  authOptions = {
    url: inp_url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' +
        auth_token
    },
    json: true
  }
  request.post(authOptions, function (error, response, body) {
    if (error) {
      res.sendStatus(error);
    }
    res.sendStatus(200);
  })
})

express_app.get('/next', function (req, res) {
  var inp_url = 'https://api.spotify.com/v1/me/player/next';
  playing = !playing;
  let code = req.query.code || null
  authOptions = {
    url: inp_url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' +
        auth_token
    },
    json: true
  }
  request.post(authOptions, function (error, response, body) {
    if (error) {
      res.sendStatus(error);
    }
    res.sendStatus(200);
  })
})


express_app.get('/callback', function (req, res) {
  let code = req.query.code || null
  authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function (error, response, body) {
    auth_token = body.access_token
    let uri = process.env.FRONTEND_URI || 'http://localhost:3000'
    // res.redirect(uri + '?access_token=' + access_token)
    res.redirect(uri);
  })
})

let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
express_app.listen(port)

