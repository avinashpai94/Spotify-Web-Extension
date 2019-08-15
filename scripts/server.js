var playing = true;
var shuffle = true;
var settings = false;
var repeat_val = {
    value: 1,
    properties: {
        1: { name: "Off", value: 1 },
        2: { name: "On", value: 2 },
        3: { name: "One", value: 3 }
    }
}

let express = require('express')
let request = require('request')
let querystring = require('querystring')


console.log("Required");

let app = express()

let redirect_uri =
    process.env.REDIRECT_URI ||
    'http://localhost:8888/callback'

app.get('/login', function (req, res) {
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: process.env.SPOTIFY_CLIENT_ID,
            scope: 'user-read-private user-read-email user-modify-playback-state',
            redirect_uri
        }))
})

app.get('/callback', function (req, res) {
    let code = req.query.code || null
    let authOptions = {
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
        var access_token = body.access_token
        let uri = process.env.FRONTEND_URI || 'http://localhost:5500/index.html'
        res.redirect(uri + '?access_token=' + access_token)
    })
})

function onPlay() {
    var play_icon = document.getElementById('play-button');
    if (playing) {
        play_icon.src = 'icons/pause.svg'
        play_icon.style.background = '#13ad49';
        console.log('play');
    } else {
        play_icon.src = 'icons/play.svg'
        play_icon.style.background = '#1DB954';
        console.log('pause');
    }
    playing = !playing;
}

function onShuffle() {
    var shuffle_icon = document.getElementById('shuffle-button');
    if (shuffle) {
        shuffle_icon.style.background = '#13ad49';
        console.log('shuffle-on');
    } else {
        shuffle_icon.style.background = '#1DB954';
        console.log('shuffle-off');
    }
    shuffle = !shuffle;
}

function onNext() {
    console.log('next');
}

function onPrev() {
    console.log('prev');
}

function onShare() {
    console.log('share');
}

function onSettings() {
    console.log('Settings');
}

function onRepeat() {
    var repeat_icon = document.getElementById('repeat-button');
    switch (repeat_val.value) {
        case 1:
            //case on
            repeat_icon.style.background = '#13ad49';
            repeat_val.value = 2;
            break;
        case 2:
            //case one
            repeat_val.value = 3;
            break;
        case 3:
            //case off
            repeat_icon.style.background = '#1DB954';
            repeat_val.value = 1;
            break;
    }
    console.log(repeat_val.properties[repeat_val.value].name);
}

let port = process.env.PORT || 8888
console.log(`Listening on port ${port}`)
app.listen(port)
