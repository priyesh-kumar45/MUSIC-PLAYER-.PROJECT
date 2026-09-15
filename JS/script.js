const wrapper = document.querySelector(".wrapper");

const musicImg = wrapper.querySelector(".img-area img");
const musicName = wrapper.querySelector(".song-details .name");
const musicArtist = wrapper.querySelector(".song-details .artist");

const playPauseBtn = wrapper.querySelector(".play-pause");

const prevBtn = wrapper.querySelector("#prev");
const nextBtn = wrapper.querySelector("#next");

const mainAudio = wrapper.querySelector("#main-audio");

const progressArea = wrapper.querySelector(".progress-area");
const progressBar = wrapper.querySelector(".progress-bar");

const musicList = wrapper.querySelector(".music-list");

const moreMusicBtn = wrapper.querySelector("#more-music");
const closeMoreMusic = wrapper.querySelector("#close");

const repeatBtn = wrapper.querySelector("#repeat-plist");

const ulTag = wrapper.querySelector("ul");


// ==========================================
// CURRENT SONG
// ==========================================

let musicIndex =
    Math.floor(Math.random() * allMusic.length) + 1;


// ==========================================
// PAGE LOAD
// ==========================================

window.addEventListener("load", () => {

    loadMusic(musicIndex);

    createMusicList();

    playingSong();

});


// ==========================================
// LOAD MUSIC
// ==========================================

function loadMusic(indexNumb) {

    const song = allMusic[indexNumb - 1];

    if (!song) {

        console.error("Song not found!");

        return;

    }


    musicName.innerText = song.name;

    musicArtist.innerText = song.artist;


    // IMAGE

    musicImg.src =
        `images/${song.img}.jpg`;


    // AUDIO

    mainAudio.src =
        `songs/${song.src}.mp3`;


    mainAudio.load();


    console.log("Loaded song:", song.name);

    console.log("Audio path:",
        `songs/${song.src}.mp3`);

}


// ==========================================
// PLAY MUSIC
// ==========================================

function playMusic() {

    wrapper.classList.add("paused");

    playPauseBtn.querySelector("i").innerText =
        "pause";


    const playPromise =
        mainAudio.play();


    if (playPromise !== undefined) {

        playPromise.catch((error) => {

            console.error(
                "Audio playback error:",
                error
            );

        });

    }

}


// ==========================================
// PAUSE MUSIC
// ==========================================

function pauseMusic() {

    wrapper.classList.remove("paused");

    playPauseBtn.querySelector("i").innerText =
        "play_arrow";

    mainAudio.pause();

}


// ==========================================
// PREVIOUS SONG
// ==========================================

function prevMusic() {

    musicIndex--;


    if (musicIndex < 1) {

        musicIndex =
            allMusic.length;

    }


    loadMusic(musicIndex);

    playMusic();

    playingSong();

}


// ==========================================
// NEXT SONG
// ==========================================

function nextMusic() {

    musicIndex++;


    if (musicIndex > allMusic.length) {

        musicIndex = 1;

    }


    loadMusic(musicIndex);

    playMusic();

    playingSong();

}


// ==========================================
// PLAY / PAUSE
// ==========================================

playPauseBtn.addEventListener(
    "click",
    () => {

        if (mainAudio.paused) {

            playMusic();

        } else {

            pauseMusic();

        }

        playingSong();

    }
);


// ==========================================
// PREVIOUS BUTTON
// ==========================================

prevBtn.addEventListener(
    "click",
    () => {

        prevMusic();

    }
);


// ==========================================
// NEXT BUTTON
// ==========================================

nextBtn.addEventListener(
    "click",
    () => {

        nextMusic();

    }
);


// ==========================================
// AUDIO LOADED
// ==========================================

mainAudio.addEventListener(
    "loadeddata",
    () => {

        const duration =
            mainAudio.duration;


        if (!isNaN(duration)) {

            let totalMin =
                Math.floor(duration / 60);


            let totalSec =
                Math.floor(duration % 60);


            if (totalSec < 10) {

                totalSec =
                    `0${totalSec}`;

            }


            wrapper.querySelector(
                ".max-duration"
            ).innerText =
                `${totalMin}:${totalSec}`;

        }

    }
);


// ==========================================
// UPDATE PROGRESS
// ==========================================

mainAudio.addEventListener(
    "timeupdate",
    (e) => {

        const currentTime =
            e.target.currentTime;


        const duration =
            e.target.duration;


        if (
            !isNaN(duration) &&
            duration > 0
        ) {

            const progressWidth =
                (currentTime / duration) * 100;


            progressBar.style.width =
                `${progressWidth}%`;

        }


        let currentMin =
            Math.floor(currentTime / 60);


        let currentSec =
            Math.floor(currentTime % 60);


        if (currentSec < 10) {

            currentSec =
                `0${currentSec}`;

        }


        wrapper.querySelector(
            ".current-time"
        ).innerText =
            `${currentMin}:${currentSec}`;

    }
);


// ==========================================
// CLICK PROGRESS BAR
// ==========================================

progressArea.addEventListener(
    "click",
    (e) => {

        const progressWidth =
            progressArea.clientWidth;


        const clickedOffsetX =
            e.offsetX;


        const songDuration =
            mainAudio.duration;


        if (
            !isNaN(songDuration) &&
            songDuration > 0
        ) {

            mainAudio.currentTime =
                (clickedOffsetX / progressWidth)
                * songDuration;


            playMusic();

        }

    }
);


// ==========================================
// REPEAT / SHUFFLE
// ==========================================

repeatBtn.addEventListener(
    "click",
    () => {

        const currentMode =
            repeatBtn.innerText;


        switch (currentMode) {

            case "repeat":

                repeatBtn.innerText =
                    "repeat_one";


                repeatBtn.setAttribute(
                    "title",
                    "Song looped"
                );

                break;


            case "repeat_one":

                repeatBtn.innerText =
                    "shuffle";


                repeatBtn.setAttribute(
                    "title",
                    "Playback shuffled"
                );

                break;


            case "shuffle":

                repeatBtn.innerText =
                    "repeat";


                repeatBtn.setAttribute(
                    "title",
                    "Playlist looped"
                );

                break;

        }

    }
);


// ==========================================
// SONG ENDED
// ==========================================

mainAudio.addEventListener(
    "ended",
    () => {

        const currentMode =
            repeatBtn.innerText;


        switch (currentMode) {


            // PLAY NEXT

            case "repeat":

                nextMusic();

                break;


            // REPEAT SAME SONG

            case "repeat_one":

                mainAudio.currentTime = 0;

                playMusic();

                break;


            // SHUFFLE

            case "shuffle":

                let randomIndex;


                do {

                    randomIndex =
                        Math.floor(
                            Math.random()
                            * allMusic.length
                        ) + 1;

                }
                while (
                    randomIndex === musicIndex
                );


                musicIndex =
                    randomIndex;


                loadMusic(musicIndex);

                playMusic();

                playingSong();

                break;

        }

    }
);


// ==========================================
// OPEN MUSIC LIST
// ==========================================

moreMusicBtn.addEventListener(
    "click",
    () => {

        musicList.classList.toggle(
            "show"
        );

    }
);


// ==========================================
// CLOSE MUSIC LIST
// ==========================================

closeMoreMusic.addEventListener(
    "click",
    () => {

        musicList.classList.remove(
            "show"
        );

    }
);


// ==========================================
// CREATE MUSIC LIST
// ==========================================

function createMusicList() {

    ulTag.innerHTML = "";


    for (
        let i = 0;
        i < allMusic.length;
        i++
    ) {

        const song =
            allMusic[i];


        const liTag = `

            <li li-index="${i + 1}">

                <div class="row">

                    <span>
                        ${song.name}
                    </span>

                    <p>
                        ${song.artist}
                    </p>

                </div>


                <span
                    id="${song.src}"
                    class="audio-duration">
                    0:00
                </span>


                <audio
                    class="${song.src}"
                    src="songs/${song.src}.mp3">
                </audio>

            </li>

        `;


        ulTag.insertAdjacentHTML(
            "beforeend",
            liTag
        );


        const liAudioDurationTag =
            ulTag.querySelector(
                `#${song.src}`
            );


        const liAudioTag =
            ulTag.querySelector(
                `.${song.src}`
            );


        liAudioTag.addEventListener(
            "loadeddata",
            () => {

                const duration =
                    liAudioTag.duration;


                if (!isNaN(duration)) {

                    let totalMin =
                        Math.floor(
                            duration / 60
                        );


                    let totalSec =
                        Math.floor(
                            duration % 60
                        );


                    if (totalSec < 10) {

                        totalSec =
                            `0${totalSec}`;

                    }


                    liAudioDurationTag.innerText =
                        `${totalMin}:${totalSec}`;


                    liAudioDurationTag.setAttribute(
                        "t-duration",
                        `${totalMin}:${totalSec}`
                    );

                }

            }
        );

    }


    playingSong();

}


// ==========================================
// SHOW CURRENT SONG
// ==========================================

function playingSong() {

    const allLiTag =
        ulTag.querySelectorAll("li");


    allLiTag.forEach(
        (li) => {

            const audioDuration =
                li.querySelector(
                    ".audio-duration"
                );


            li.classList.remove(
                "playing"
            );


            const originalDuration =
                audioDuration.getAttribute(
                    "t-duration"
                );


            if (originalDuration) {

                audioDuration.innerText =
                    originalDuration;

            }


            if (
                Number(
                    li.getAttribute(
                        "li-index"
                    )
                ) ===
                Number(musicIndex)
            ) {

                li.classList.add(
                    "playing"
                );


                audioDuration.innerText =
                    "Playing";

            }


            li.onclick = () => {

                clicked(li);

            };

        }
    );

}


// ==========================================
// CLICK SONG FROM LIST
// ==========================================

function clicked(element) {

    const getLiIndex =
        element.getAttribute(
            "li-index"
        );


    musicIndex =
        Number(getLiIndex);


    loadMusic(musicIndex);

    playMusic();

    playingSong();

}