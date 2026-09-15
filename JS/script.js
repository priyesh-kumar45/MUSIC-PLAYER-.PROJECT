const wrapper = document.querySelector(".wrapper"),
    musicImg = wrapper.querySelector(".img-area img"),
    musicName = wrapper.querySelector(".song-details .name"),
    musicArtist = wrapper.querySelector(".song-details .artist"),
    mainAudio = wrapper.querySelector("#main-audio"),
    playPauseBtn = wrapper.querySelector(".play-pause"),
    prevBtn = wrapper.querySelector("#prev"),
    nextBtn = wrapper.querySelector("#next"),
    progressArea = wrapper.querySelector(".progress-area"),
    progressBar = wrapper.querySelector(".progress-bar"),
    musicList = wrapper.querySelector(".music-list"),
    showMoreBtn = wrapper.querySelector("#more-music"),
    closemoreBtn = musicList.querySelector("#close"),
    repeatBtn = wrapper.querySelector("#repeat-plist"),
    shuffleBtn = wrapper.querySelector("#shuffle");

let musicIndex = 1;
let isPlaying = false;
let isShuffle = false;

// Load first song
window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingNow();
});

// Load music
function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;

    // IMPORTANT: GitHub Pages paths
    musicImg.src = `IMAGES/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `SONGS/${allMusic[indexNumb - 1].src}.mp3`;
}

// Play music
function playMusic() {
    isPlaying = true;
    playPauseBtn.querySelector("i").innerText = "pause";

    mainAudio.play();
}

// Pause music
function pauseMusic() {
    isPlaying = false;
    playPauseBtn.querySelector("i").innerText = "play_arrow";

    mainAudio.pause();
}

// Play / Pause button
playPauseBtn.addEventListener("click", () => {
    isPlaying ? pauseMusic() : playMusic();
});

// Previous song
prevBtn.addEventListener("click", () => {
    musicIndex--;

    if (musicIndex < 1) {
        musicIndex = allMusic.length;
    }

    loadMusic(musicIndex);

    if (isPlaying) {
        playMusic();
    }

    playingNow();
});

// Next song
nextBtn.addEventListener("click", () => {
    musicIndex++;

    if (musicIndex > allMusic.length) {
        musicIndex = 1;
    }

    loadMusic(musicIndex);

    if (isPlaying) {
        playMusic();
    }

    playingNow();
});

// Update progress bar
mainAudio.addEventListener("timeupdate", (e) => {
    if (mainAudio.duration) {
        let currentTime = e.target.currentTime;
        let duration = e.target.duration;

        let progressWidth = (currentTime / duration) * 100;
        progressBar.style.width = `${progressWidth}%`;

        let musicCurrentTime = wrapper.querySelector(".current");
        let musicDuration = wrapper.querySelector(".duration");

        mainAudio.addEventListener("loadeddata", () => {
            let audioDuration = mainAudio.duration;

            let totalMin = Math.floor(audioDuration / 60);
            let totalSec = Math.floor(audioDuration % 60);

            if (totalSec < 10) {
                totalSec = `0${totalSec}`;
            }

            musicDuration.innerText = `${totalMin}:${totalSec}`;
        });

        let currentMin = Math.floor(currentTime / 60);
        let currentSec = Math.floor(currentTime % 60);

        if (currentSec < 10) {
            currentSec = `0${currentSec}`;
        }

        musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
    }
});

// Click progress bar
progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth;
    let clickedOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime =
        (clickedOffsetX / progressWidth) * songDuration;

    playMusic();
});

// Song ended
mainAudio.addEventListener("ended", () => {
    nextBtn.click();
});

// Show music list
showMoreBtn.addEventListener("click", () => {
    musicList.classList.add("show");
});

// Close music list
closemoreBtn.addEventListener("click", () => {
    musicList.classList.remove("show");
});

// Repeat button
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;

    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;

        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffled");
            isShuffle = true;
            break;

        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            isShuffle = false;
            break;
    }
});

// Shuffle
shuffleBtn.addEventListener("click", () => {
    let randomIndex;

    do {
        randomIndex = Math.floor(Math.random() * allMusic.length) + 1;
    } while (randomIndex === musicIndex);

    musicIndex = randomIndex;

    loadMusic(musicIndex);

    if (isPlaying) {
        playMusic();
    }

    playingNow();
});

// Create music list
const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `
        <li li-index="${i + 1}">
            <div class="row">
                <span>${allMusic[i].name}</span>
                <p>${allMusic[i].artist}</p>
            </div>
            <audio class="${allMusic[i].src}" src="SONGS/${allMusic[i].src}.mp3"></audio>
            <span id="${allMusic[i].src}" class="audio-duration">--:--</span>
        </li>
    `;

    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`.${allMusic[i].src}`);
    
    liAudioDuration.addEventListener("loadeddata", () => {
        let duration = liAudioDuration.duration;

        let totalMin = Math.floor(duration / 60);
        let totalSec = Math.floor(duration % 60);

        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }

        let durationTag = ulTag.querySelector(`#${allMusic[i].src}`);
        durationTag.innerText = `${totalMin}:${totalSec}`;
        durationTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

// Select song from list
function playingNow() {
    const allLiTag = ulTag.querySelectorAll("li");

    allLiTag.forEach((li) => {
        let liIndex = li.getAttribute("li-index");

        if (liIndex == musicIndex) {
            li.classList.add("playing");
        } else {
            li.classList.remove("playing");
        }

        li.setAttribute("onclick", "clicked(this)");
    });
}

// Click playlist song
function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");

    musicIndex = getLiIndex;

    loadMusic(musicIndex);

    playMusic();

    playingNow();
}