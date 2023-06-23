// let's select all required tags or elements

const wrapper = document.querySelector('.wrapper');
const musicImg = wrapper.querySelector('.img-area img');
const musicName = wrapper.querySelector('.song-details .name');
const musicArtist = wrapper.querySelector('.song-details .artist');
const mainAudio = wrapper.querySelector('#main-audio');
const playPauseBtn = wrapper.querySelector('.play-pause');
const prevBtn = wrapper.querySelector('#prev');
const nextBtn = wrapper.querySelector('#next');
const progressArea = wrapper.querySelector('.progress-area');
const progressBar = wrapper.querySelector('.progress-bar');
const musicList = wrapper.querySelector('.music-list');
const showMoreBtn = wrapper.querySelector('#more-music');
const hideMusicBtn = wrapper.querySelector('#close');

// load random music on page refresh
let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener('load', () => {
  loadMusic(musicIndex); // calling load music function once window loaded
  playingNow();
})

// load music function
function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name
  musicArtist.innerText = allMusic[indexNumb - 1].artist
  musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`
}

// play music function
function playMusic() {
  wrapper.classList.add('paused');
  playPauseBtn.querySelector('i').innerText = 'pause'
  mainAudio.play()
}

// pause music function
function pauseMusic() {
  wrapper.classList.remove('paused');
  playPauseBtn.querySelector('i').innerText = 'play_arrow'
  mainAudio.pause()
}

// next music function
function nextMusic() {
  // here we'll just increment of index by 1
  musicIndex++;
  // if musicIndex is greater than array length then musicIndex will be 1 so the first song will play
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

// next music function
function prevMusic() {
  // here we'll just decrement of index by 1
  musicIndex--;
  // if musicIndex is less than 1 then musicIndex will be array length so the last song will play
  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

// play or music button event
playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains('paused')
  // If isMusicPaused is true then call pauseMusic else call playMusic
  isMusicPaused ? pauseMusic() : playMusic();
  playingNow();
})

// next music btn event
nextBtn.addEventListener('click', () => {
  nextMusic(); // calling next music function
})

// prev music btn event
prevBtn.addEventListener('click', () => {
  prevMusic(); // calling prev music function
})

// update progress bar width according to music current time
mainAudio.addEventListener('timeupdate', (e) => {
  const currentTime = e.target.currentTime; // getting current time og song
  const duration = e.target.duration; // getting total duration of song
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`

  let musicCurrentTime = wrapper.querySelector('.current'),
    musicDuration = wrapper.querySelector('.duration');

  mainAudio.addEventListener("loadeddata", () => {

    // update sog total duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) totalSec = `0${totalMin}` // adding 0 if sec is less than 10

    musicDuration.innerText = `${totalMin}:${totalSec}`;

  })
  // update playning total duration
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) currentSec = `0${currentSec}` // adding 0 if sec is less than 10

  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
})

// let's update playing song current time according to the progress bar width
progressArea.addEventListener('click', (e) => {
  let progressWidthVal = progressArea.clientWidth; // getting width of progress bar
  let clickedOffSetX = e.offsetX; // getting offset x value
  let songDuration = mainAudio.duration; // getting song total duration

  mainAudio.currentTime = (clickedOffSetX / progressWidthVal) * songDuration;
  playMusic();
})

// let's work on repeat, shuffle song according to the icon
const repeatBtn = wrapper.querySelector('#repeat-plist');
repeatBtn.addEventListener('click', () => {
  // first we get the innerText of the icon then we'll change accordingly
  let getText = repeatBtn.innerText; // getting innerText of icon
  // let's do different changes of different icon click using switch
  switch (getText) {
    case 'repeat': // if this icon is repeat
      repeatBtn.innerText = 'repeat_one'
      repeatBtn.setAttribute('title', 'Song looped')
      break;
    case 'repeat_one': // if icon icon is repeat_one then change it to shuffle
      repeatBtn.innerText = 'shuffle';
      repeatBtn.setAttribute('title', 'Playback shuffle')
      break;
    case 'shuffle': // if icon icon is shuffle then change it to repeat
      repeatBtn.innerText = 'repeat';
      repeatBtn.setAttribute('title', 'Playlist looped')
      break;
  }
})

// above we just changed the icon, now let's work on what to do
// after the song ended

mainAudio.addEventListener('ended', () => {
  // we'll do according to the icon means if user has set icon to loop song then we'll repeat
  // the current song and will do further accordingly

  let getText = repeatBtn.innerText; // getting innerText of icon
  // let's do different changes of different icon click using switch
  switch (getText) {
    case 'repeat': // if this icon is repeat then simply we call the nextMusic function so the next song will play
      nextMusic();
      break;
    case 'repeat_one': // if icon icon is repeat_one then we'll change the current playing song current time to 9 so song will play from beginning
      mainAudio.currentTime = 0;
      loadMusic(indexNumb);
      playMusic(); // calling playMusic function
      break;
    case 'shuffle': // if icon icon is shuffle then change it to repeat
      // getting random index between the max range of array length
      let randIndex = Math.floor((Math.random() * allMusic.length) + 1)
      do {
        randIndex = Math.floor((Math.random() * allMusic.length) + 1)
      } while (musicIndex = randIndex); // this loop run until the next random number won't be the same of current music index
      musicIndex = randIndex; // passing randomIndex to musicIndex so the random song will play
      loadMusic(musicIndex); // calling loadMusic function
      playMusic(); // calling playMusic function
      playingNow();
      break;
  }
})

showMoreBtn.addEventListener('click', () => {
  musicList.classList.toggle('show');
})

hideMusicBtn.addEventListener('click', () => {
  showMoreBtn.click();
})

const ulTag = wrapper.querySelector('ul');

// let's create li according to the array length
for (let i = 0; i < allMusic.length; i++) {
  // let's pass the song name, artist from the array to li
  let liTag = ` <li li-index="${i + 1}>
                  <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                  </div>
                  <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                  <span id="${allMusic[i].src}" class="audio-duration ">3:40</span>
                </li > `;
  ulTag.insertAdjacentHTML('beforeend', liTag);

  let liAudioTagDuration = ulTag.querySelector(`#${allMusic[i].src}`)
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`)

  liAudioTag.addEventListener('loadeddata', () => {
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) totalSec = `0${totalMin}` // adding 0 if sec is less than 10
    liAudioTagDuration.innerText = `${totalMin}:${totalSec}`;
    // adding t duration attribute which we'll use below
    liAudioTagDuration.setAttribute('t-duration', `${totalMin}:${totalSec}`);
  })
}

// let's work on play particular song on click
const allLiTags = ulTag.querySelectorAll('li');
function playingNow() {
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector('.audio-duration')
    // let's remove playing class from all other li expect the last one which is clicked
    if (allLiTags[j].classList.contains('playing')) {
      allLiTags[j].classList.remove('playing')
      // let's get that audio duration value and pass to .audio-duration innerText
      let adDuration = audioTag.getAttribute('t-duration');
      adDuration.innerText = adDuration; // passing t-duration value to audio duration innerText
    }

    // if there is an li tag which li-index is equal to musicIndex
    // then this music is playing now and we'll style it

    if (allLiTags[j].getAttribute('li-index') == musicIndex) {
      allLiTags[j].classList.add('playing');
      audioTag.innerText = "Playing";
    }

    // adding onclick attribute in all li tags
    allLiTags[j].setAttribute('onclick', 'clicked(this)')
  }
}

// let's play song on li click
function clicked(e) {
  // getting li index of particular clicked li tag
  let getLiIndex = e.getAttribute("li-index");
  musicIndex = getLiIndex; // passing that li index to musicIndex
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}