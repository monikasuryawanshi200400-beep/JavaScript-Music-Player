
const songs = [
    {
        title: "Dreams",
        artist: "Artist One",
        file: "song1.mp3"
    },
    {
        title: "Feel The Music",
        artist: "Artist Two",
        file: "song2.mp3"
    },
    {
        title: "Beautiful Life",
        artist: "Artist Three",
        file: "song3.mp3"
    },
    {
        title: "My Love",
        artist: "Artist Four",
        file: "song4.mp3"
    },
    {
        title: "Melody",
        artist: "Artist Five",
        file: "song5.mp3"
    }
];

// ==================================
// PLAYER ELEMENTS
// ==================================

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");

const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const progress = document.getElementById("progress");
const volume = document.getElementById("volume");

const currentTime = document.getElementById("current-time");
const duration = document.getElementById("duration");

const playlist = document.getElementById("playlist");
const songCount = document.getElementById("song-count");

let songIndex = 0;

// ==================================
// FORMAT TIME
// ==================================

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// ==================================
// LOAD SONG
// ==================================

function loadSong(index) {
    if (songs.length === 0) {
        title.textContent = "No Songs Available";
        artist.textContent = "Add MP3 files to your library";
        return;
    }

    songIndex = index;

    const song = songs[songIndex];

    title.textContent = song.title;
    artist.textContent = song.artist;

    // Load permanent file from songs folder
    audio.src = encodeURI("songs/" + song.file);

    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    displayPlaylist();
}

// ==================================
// PLAY SONG
// ==================================

function playSong() {
    if (songs.length === 0) {
        alert("No songs in playlist!");
        return;
    }

    audio.play()
        .then(() => {
            playBtn.textContent = "⏸";
        })
        .catch(error => {
            console.error("Song playback error:", error);
            alert("Song not found or could not play. Check the MP3 file name and path.");
        });
}

// ==================================
// PAUSE SONG
// ==================================

function pauseSong() {
    audio.pause();
    playBtn.textContent = "▶";
}

// ==================================
// PLAY / PAUSE BUTTON
// ==================================

playBtn.addEventListener("click", () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

// ==================================
// NEXT SONG
// ==================================

function nextSong() {
    if (songs.length === 0) return;

    songIndex = (songIndex + 1) % songs.length;

    loadSong(songIndex);
    playSong();
}

// ==================================
// PREVIOUS SONG
// ==================================

function previousSong() {
    if (songs.length === 0) return;

    songIndex = (songIndex - 1 + songs.length) % songs.length;

    loadSong(songIndex);
    playSong();
}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", previousSong);

// ==================================
// UPDATE PROGRESS BAR
// ==================================

audio.addEventListener("timeupdate", () => {
    if (audio.duration && Number.isFinite(audio.duration)) {
        progress.value =
            (audio.currentTime / audio.duration) * 100;

        currentTime.textContent =
            formatTime(audio.currentTime);
    }
});

// ==================================
// SHOW SONG DURATION
// ==================================

audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
});

// ==================================
// SEEK SONG
// ==================================

progress.addEventListener("input", () => {
    if (audio.duration && Number.isFinite(audio.duration)) {
        audio.currentTime =
            (progress.value / 100) * audio.duration;
    }
});

// ==================================
// VOLUME CONTROL
// ==================================

audio.volume = 0.7;

volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
});

// ==================================
// AUTOPLAY NEXT SONG
// ==================================

audio.addEventListener("ended", () => {
    nextSong();
});

// ==================================
// PLAYLIST DISPLAY
// ==================================

function displayPlaylist() {
    playlist.innerHTML = "";

    songCount.textContent = `${songs.length} Songs`;

    songs.forEach((song, index) => {
        const item = document.createElement("div");

        item.className =
            "song" + (index === songIndex ? " active" : "");

        const info = document.createElement("div");

        const songTitle = document.createElement("strong");
        songTitle.textContent = song.title;

        const songArtist = document.createElement("small");
        songArtist.textContent = song.artist;

        const number = document.createElement("span");
        number.className = "number";
        number.textContent = index + 1;

        info.appendChild(songTitle);
        info.appendChild(songArtist);

        item.appendChild(info);
        item.appendChild(number);

        item.addEventListener("click", () => {
            loadSong(index);
            playSong();
        });

        playlist.appendChild(item);
    });
}

// ==================================
// AUDIO ERROR HANDLING
// ==================================

audio.addEventListener("error", () => {
    console.error(
        "Unable to load audio file:",
        audio.currentSrc
    );
});

// ==================================
// INITIALIZE PLAYER
// ==================================

if (songs.length > 0) {
    loadSong(0);
} else {
    displayPlaylist();
}
