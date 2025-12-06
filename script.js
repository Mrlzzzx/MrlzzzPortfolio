/* ---------- THEME FIX ---------- */
const themeBtn = document.getElementById("theme-toggle");

function updateThemeIcon() {
  themeBtn.innerHTML = document.body.classList.contains("dark")
    ? `<img src="Images/Sun.png" width="27">`
    : `<img src="Images/Moon.png" width="27">`;
}

themeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  updateThemeIcon();
};

window.onload = () => {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") document.body.classList.add("dark");
  updateThemeIcon();
};


/* ---------- PLAYER (FUNCIONA EM QUALQUER HOST) ---------- */

const trackName = document.getElementById("track-name");
const playBtn   = document.getElementById("playpause");
const nextBtn   = document.getElementById("next");
const prevBtn   = document.getElementById("prev");

const player = {
  list: [
    "Sons/Musicas/Lena Raine - First Steps (Celeste).mp3",
    "Sons/Musicas/sk4le - Sweden (MInecraft Lofi Hip Hop).mp3",
    "Sons/Musicas/Toby Fox - Fallen-Down (Undertale).mp3"
  ],
  index: 0,
  audio: new Audio()
};

// Limpar o nome bonito
function cleanName(path) {
  return path
    .split("/").pop()
    .replace(".mp3", "")
    .replace(/%20/g, " ");
}

function loadTrack(i){
  player.audio.src = player.list[i];
  trackName.textContent = cleanName(player.list[i]);
}

/* Botões */
playBtn.onclick = () => {
  if (player.audio.paused){ 
    player.audio.play(); 
    playBtn.textContent="⏸"; 
  }
  else{ 
    player.audio.pause(); 
    playBtn.textContent="▶"; 
  }
};

nextBtn.onclick = () => {
  player.index = (player.index+1) % player.list.length;
  loadTrack(player.index);
  player.audio.play();
  playBtn.textContent="⏸";
};

prevBtn.onclick = () => {
  player.index = (player.index-1+player.list.length) % player.list.length;
  loadTrack(player.index);
  player.audio.play();
  playBtn.textContent="⏸";
};

loadTrack(0);