/* Аудиоплеер: play/pause, перемотка, громкость, повтор. */
(() => {
  const audio = document.getElementById("audio");
  const playBtn = document.getElementById("play");
  const restartBtn = document.getElementById("restart");
  const forwardBtn = document.getElementById("forward");
  const repeatBtn = document.getElementById("repeat");
  const muteBtn = document.getElementById("mute");
  const seek = document.getElementById("seek");
  const volume = document.getElementById("volume");
  const currentEl = document.getElementById("current");
  const durationEl = document.getElementById("duration");
  const volValue = document.getElementById("vol-value");

  if (!audio || !playBtn) return;

  let seeking = false;
  let lastVolume = 70;
  let autoDone = false;

  function fmt(seconds) {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return minutes + ":" + String(secs).padStart(2, "0");
  }

  function updatePlay() {
    playBtn.textContent = audio.paused ? "▶" : "❚❚";
    playBtn.setAttribute("aria-label", audio.paused ? "Включить музыку" : "Пауза");
  }

  function stopAuto() {
    if (autoDone) return;
    autoDone = true;
    document.removeEventListener("pointerdown", autoStart);
    document.removeEventListener("keydown", autoStart);
  }

  async function toggle() {
    stopAuto();
    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      console.warn("не удалось включить звук", error);
    }
  }

  function applyVolume() {
    const value = Number(volume.value);
    audio.volume = value / 100;
    audio.muted = value === 0;
    volValue.textContent = value + "%";
    muteBtn.textContent = value === 0 ? "🔇" : "🔊";
    volume.style.setProperty("--fill", value + "%");
    if (value > 0) lastVolume = value;
  }

  playBtn.addEventListener("click", toggle);

  restartBtn.addEventListener("click", () => {
    audio.currentTime = 0;
  });

  forwardBtn.addEventListener("click", () => {
    if (isFinite(audio.duration)) {
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
    }
  });

  repeatBtn.addEventListener("click", () => {
    audio.loop = !audio.loop;
    repeatBtn.classList.toggle("on", audio.loop);
  });

  muteBtn.addEventListener("click", () => {
    if (audio.muted || Number(volume.value) === 0) {
      volume.value = lastVolume || 70;
    } else {
      lastVolume = Number(volume.value);
      volume.value = 0;
    }
    applyVolume();
  });

  volume.addEventListener("input", applyVolume);

  seek.addEventListener("input", () => {
    seeking = true;
    const part = Number(seek.value) / 1000;
    seek.style.setProperty("--fill", part * 100 + "%");
    if (isFinite(audio.duration)) {
      currentEl.textContent = fmt(part * audio.duration);
    }
  });

  seek.addEventListener("change", () => {
    if (isFinite(audio.duration)) {
      audio.currentTime = (Number(seek.value) / 1000) * audio.duration;
    }
    seeking = false;
  });

  audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = fmt(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    currentEl.textContent = fmt(audio.currentTime);
    if (!seeking && isFinite(audio.duration) && audio.duration > 0) {
      const part = audio.currentTime / audio.duration;
      seek.value = Math.round(part * 1000);
      seek.style.setProperty("--fill", part * 100 + "%");
    }
  });

  audio.addEventListener("play", updatePlay);
  audio.addEventListener("pause", updatePlay);
  audio.addEventListener("ended", updatePlay);

  function autoStart(event) {
    if (autoDone) return;
    if (event.target && event.target.closest && event.target.closest(".player")) return;
    toggle();
  }

  document.addEventListener("pointerdown", autoStart);
  document.addEventListener("keydown", autoStart);

  audio.loop = true;
  volume.value = 70;
  applyVolume();
  updatePlay();
})();
