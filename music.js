// Quiet ambience: try autoplay where permitted, with a clear manual fallback.
(function () {
  var button = document.getElementById('musicToggle');
  if (!button) return;
  var label = button.querySelector('[data-music-label]');
  var status = document.getElementById('musicStatus');
  var audio = null;
  var wanted = false;
  var revision = 0;
  var preferenceKey = 'pomona-music-muted-v1';
  function isMuted() { try { return localStorage.getItem(preferenceKey) === 'true'; } catch (_) { return false; } }
  function rememberMuted(value) { try { localStorage.setItem(preferenceKey, String(value)); } catch (_) {} }
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
  function start(automatic) {
    status.textContent = '';
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
    }).catch(function (error) {
      if (!wanted || attempt !== revision) return;
      stop();
      if (automatic && error.name === 'NotAllowedError') { label.textContent = button.dataset.tap; }
      else { status.textContent = button.dataset.error; }
    });
  }
  button.addEventListener('click', function () {
    if (wanted) { rememberMuted(true); stop(); return; }
    rememberMuted(false); start(false);
  });
  // Respect the guest's attention and stop decoding while the page is hidden.
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); });
  window.addEventListener('pagehide', stop);
  document.addEventListener('play', function (event) {
    if (event.target !== audio && (event.target.tagName === 'VIDEO' || event.target.tagName === 'AUDIO')) stop();
  }, true);
  // Data Saver users remain opt-in; never start audio from an unrelated tap.
  if (!document.hidden && !isMuted() && !(navigator.connection && navigator.connection.saveData)) start(true);
})();
