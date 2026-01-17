// telegram.js — безопасная инициализация
(function () {
  // Ждём, пока DOM и Telegram API будут готовы
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTelegram);
  } else {
    initTelegram();
  }

  function initTelegram() {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      tg.expand();
      tg.setHeaderColor('#0d0d1a');
      tg.setBackgroundColor('#0d0d1a');
      tg.disableClosingConfirmation();
      window.TG_APP = tg; // Делаем доступным глобально для game.js
    } else {
      console.warn("Telegram WebApp не обнаружен. Режим разработки.");
      window.TG_APP = null;
    }
  }
})();Обновил telegram.js: безопасная инициализация WebApp, без ошибок при загрузке
