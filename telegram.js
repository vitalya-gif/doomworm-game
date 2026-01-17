(function () {
  function init() {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.expand();
      tg.setHeaderColor('#0d0d1a');
      tg.setBackgroundColor('#0d0d1a');
      tg.disableClosingConfirmation();
      window.TG_APP = tg;
    } else {
      console.warn("Telegram WebApp не обнаружен.");
      window.TG_APP = null;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
