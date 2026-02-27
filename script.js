const btn = document.getElementById("surpriseBtn");
const playPause = document.getElementById("playPause");
const audio = document.getElementById("audio");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");
const circle = document.querySelector(".circle-container");
const SIZE=600;
canvas.width = SIZE;
canvas.height = SIZE;


let audioCtx, analyser, dataArray, source;
let isPlaying = false;

/* SHOW CIRCLE ON SURPRISE CLICK */
btn.addEventListener("click", () => {
  document.getElementById("surprise").classList.remove("hidden");
  circle.style.display = "block";
  playPause.classList.remove("hidden");

  if (!audioCtx) {
    initAudio();
    audio.play();
    draw();
    isPlaying = true;
    playPause.textContent = "⏸️";
  }
});


/* PLAY / PAUSE */
playPause.addEventListener("click", () => {
  if (!audioCtx) initAudio();

  if (isPlaying) {
    audio.pause();
    playPause.textContent = "▶️";
  } else {
    audio.play();
    draw();
    playPause.textContent = "⏸️";
  }
  isPlaying = !isPlaying;
});

/* AUDIO SETUP */
function initAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
 analyser.fftSize =256;
 dataArray = new Uint8Array(analyser.fftSize);
}
const BAR_COUNT = 180;
const barValues = new Array(BAR_COUNT).fill(0);

// ... (rest of your JavaScript up to the draw function remains unchanged)

function draw() {
  requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  const innerRadius =240;     // photo radius
  const baseHeight = 8;        // 🔑 ALWAYS visible
  const maxHeight = 60;

  const angleStep = (Math.PI * 2) / BAR_COUNT;

  for (let i = 0; i < BAR_COUNT; i++) {

    /* map spectrum smoothly */
    const index = Math.floor((i / BAR_COUNT) * dataArray.length);
    const level = dataArray[index] / 255;

    /* smooth movement */
    barValues[i] += (level - barValues[i]) * 0.2;

    /* 🔥 NEVER ZERO HEIGHT */
    const barHeight = baseHeight + barValues[i] * maxHeight;
    const angle = i * angleStep;

    const x1 = cx + Math.cos(angle) * innerRadius;
    const y1 = cy + Math.sin(angle) * innerRadius;

    const x2 = cx + Math.cos(angle) * (innerRadius + barHeight);
    const y2 = cy + Math.sin(angle) * (innerRadius + barHeight);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.strokeStyle = "#66ffff";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#66ffff";
    ctx.stroke();
  }
}


