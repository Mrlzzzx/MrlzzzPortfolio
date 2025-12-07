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

/* ---------- PLAYER ---------- */
const trackName = document.getElementById("track-name");
const playBtn   = document.getElementById("playpause");
const nextBtn   = document.getElementById("next");
const prevBtn   = document.getElementById("prev");

const player = {
  list: [
    "Sons/Musicas/Lena Raine - First Steps (Celeste).mp3",
    "Sons/Musicas/sk4le - Sweden (Minecraft Lofi Hip Hop).mp3",
    "Sons/Musicas/Toby Fox - Fallen-Down (Undertale).mp3"
  ],
  index: 0,
  audio: new Audio(),
  volume: 0.5
};

// Restaurar volume do localStorage
player.audio.volume = localStorage.getItem("VolumeSlide") 
  ? parseFloat(localStorage.getItem("VolumeSlide")) 
  : player.volume;

function cleanName(path) {
  return path.split("/").pop().replace(".mp3", "").replace(/%20/g, " ");
}

function loadTrack(i){
  player.index = i;
  player.audio.src = player.list[i];
  trackName.textContent = cleanName(player.list[i]);
  localStorage.setItem("musicIndex", i);
}

/* PLAYER BUTTONS */
playBtn.onclick = () => {
  if(player.audio.paused){ 
    player.audio.play(); 
    playBtn.textContent = "⏸"; 
  } else { 
    player.audio.pause(); 
    playBtn.textContent = "▶"; 
  }
};

nextBtn.onclick = () => {
  player.index = (player.index + 1) % player.list.length;
  loadTrack(player.index);
  player.audio.play();
  playBtn.textContent = "⏸";
};

prevBtn.onclick = () => {
  player.index = (player.index - 1 + player.list.length) % player.list.length;
  loadTrack(player.index);
  player.audio.play();
  playBtn.textContent = "⏸";
};

/* VOLUME SLIDER */
const volumeSlider = document.createElement("input");
volumeSlider.type = "range";
volumeSlider.min = 0;
volumeSlider.max = 1;
volumeSlider.step = 0.01;
volumeSlider.value = player.audio.volume;
volumeSlider.style.cssText = "width:100px; cursor:pointer;";
document.getElementById("player").appendChild(volumeSlider);

// Atualizar volume ao mover slider
volumeSlider.oninput = () => {
  player.audio.volume = volumeSlider.value;
  localStorage.setItem("VolumeSlide", player.audio.volume);
};

/* ---------- RESTAURAR ESTADO ---------- */
window.onload = () => {
  // Tema
  const savedTheme = localStorage.getItem("theme");
  if(savedTheme === "dark") document.body.classList.add("dark");
  updateThemeIcon();

  // Música
  const savedIndex = localStorage.getItem("musicIndex");
  const savedTime  = localStorage.getItem("musicTime");

  if(savedIndex !== null) loadTrack(parseInt(savedIndex));
  else loadTrack(0);

  if(savedTime !== null) player.audio.currentTime = parseFloat(savedTime);

  // Tentar autoplay
  player.audio.play().catch(()=>{});
};

/* SALVAR TEMPO ATUAL */
setInterval(() => {
  localStorage.setItem("musicTime", player.audio.currentTime);
}, 1000);

/* ---------- MODAL ---------- */
const modal = document.createElement("div");
modal.id = "modal";
modal.style.cssText = `
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.85);
  display:none;
  justify-content:center;
  align-items:center;
  flex-direction:column;
  z-index:1000;
`;

const modalContent = document.createElement("div");
modalContent.style.position = "relative";

const modalImg = document.createElement("img");
modalImg.style.cssText = "max-width:90%; max-height:80%; border-radius:12px; display:none;";

const modalVideo = document.createElement("video");
modalVideo.style.cssText = "max-width:90%; max-height:80%; border-radius:12px; display:none;";
modalVideo.controls = true;

const closeBtn = document.createElement("button");
closeBtn.className = "close-btn";
closeBtn.textContent = "✖";
closeBtn.style.cssText = `
  position:absolute;
  top:10px;
  right:10px;
  font-size:28px;
  background:none;
  border:none;
  color:#fff;
  cursor:pointer;
`;

modalContent.appendChild(modalImg);
modalContent.appendChild(modalVideo);
modalContent.appendChild(closeBtn);
modal.appendChild(modalContent);
document.body.appendChild(modal);

function closeModal() {
  modal.style.display = "none";
  modalImg.style.display = "none";
  modalVideo.style.display = "none";
  modalVideo.pause();
}

closeBtn.onclick = closeModal;
modal.onclick = (e) => { if(e.target === modal) closeModal(); };

/* ---------- THUMBNAILS ---------- */
document.querySelectorAll(".thumb-container").forEach(t => {
  t.onclick = () => {
    modalImg.src = t.querySelector("img").src;
    modalImg.style.display = "block";
    modalVideo.style.display = "none";
    modal.style.display = "flex";
  };
});

/* ---------- THUMBNAILS TOGGLE ---------- */
const thumbToggle = document.querySelector(".thumb-toggle");
const thumbWrapper = document.querySelector(".thumb-grid-wrapper");
const thumbItems = document.querySelectorAll(".thumb-item");

thumbToggle.onclick = () => {
  if(thumbWrapper.style.height && thumbWrapper.style.height !== "0px"){
    thumbWrapper.style.height = "0px";
    thumbItems.forEach(item => item.classList.remove("show"));
    thumbToggle.textContent = "Thumbnails ▼";
  } else {
    const scrollHeight = thumbWrapper.scrollHeight;
    thumbWrapper.style.height = scrollHeight + "px";
    thumbItems.forEach((item,i) => setTimeout(()=>item.classList.add("show"), i*50));
    thumbToggle.textContent = "Thumbnails ▲";
  }
};

/* ---------- VIDEOS ---------- */
const videoToggle = document.querySelector(".video-toggle");
const videoWrapper = document.querySelector(".video-grid-wrapper");
const videoItems = document.querySelectorAll(".video-item");

videoToggle.onclick = () => {
  if(videoWrapper.style.height && videoWrapper.style.height !== "0px"){
    videoWrapper.style.height = "0px";
    videoItems.forEach(item => item.classList.remove("show"));
    videoToggle.textContent = "Vídeos ▼";
  } else {
    const scrollHeight = videoWrapper.scrollHeight;
    videoWrapper.style.height = scrollHeight + "px";
    videoItems.forEach((item,i) => setTimeout(()=>item.classList.add("show"), i*50));
    videoToggle.textContent = "Vídeos ▲";
  }
};

// Abrir modal de vídeo
document.querySelectorAll(".video-item").forEach(v => {
  v.onclick = () => {
    modalVideo.src = v.querySelector("video").src;
    modalVideo.style.display = "block";
    modalImg.style.display = "none";
    modal.style.display = "flex";
    modalVideo.play();
  };
});
