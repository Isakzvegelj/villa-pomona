// Opt-in ambience. No audio URL is assigned until the guest presses Play.
(function () {
  var button = document.getElementById('musicToggle');
  if (!button) return;
  var label = button.querySelector('[data-music-label]');
  var status = document.getElementById('musicStatus');
  var audio = null;
  var wanted = false;
  var revision = 0;
  function update(playing) {
    button.setAttribute('aria-pressed', String(playing));
    label.textContent = playing ? button.dataset.off : button.dataset.on;
    button.setAttribute('aria-label', playing ? button.dataset.stop : button.dataset.play);
  }
  function stop() {
    wanted = false;
    revision++;
    if (audio) audio.pause();
    update(false);
  }
  button.addEventListener('click', function () {
    status.textContent = '';
    if (wanted) { stop(); return; }
    if (!audio) {
      audio = new Audio();
      audio.preload = 'none';
      audio.loop = true;
      audio.volume = 0.5;
      audio.src = new URL(button.dataset.src, document.baseURI).href;
      audio.addEventListener('pause', function () { if (audio.paused) update(false); });
      audio.addEventListener('error', function () {
        stop(); status.textContent = button.dataset.error;
      });
    }
    wanted = true;
    var attempt = ++revision;
    update(true);
    audio.play().then(function () {
      if (attempt !== revision) return;
      if (!wanted || document.hidden) stop();
    }).catch(function () {
      if (!wanted || attempt !== revision) return;
      stop(); status.textContent = button.dataset.error;
    });
  });
  // Respect the guest's attention and stop decoding while the page is hidden.
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); });
  window.addEventListener('pagehide', stop);
  document.addEventListener('play', function (event) {
    if (event.target !== audio && (event.target.tagName === 'VIDEO' || event.target.tagName === 'AUDIO')) stop();
  }, true);
})();
