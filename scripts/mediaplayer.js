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


