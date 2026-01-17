// game.js — Игровая логика с прогрессией и анимацией

(function () {
  let gameStage = 0; // 0 = начало, 1 = после первого выбора, 2 = финал

  // Ждём полной загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startGame);
  } else {
    startGame();
  }

  function startGame() {
    updateScene("Ты скачал Telegram.<br><span class='flicker'>OmniCore уже ищет тебя...</span>");
    createButtons([
      { id: 'btn1', text: '🏃 Бежать в Doomworm', action: choosePath1 },
      { id: 'btn2', text: '🚗 Спрятаться у Dodge', action: choosePath2 }
    ]);
  }

  function choosePath1() {
    if (gameStage === 0) {
      updateScene("<span class='alert'>Ты врываешься в Doomworm!</span><br>Патрули на пороге!");
      updateResult("<span style='color:#ffeb3b'>+10 TON за смелость!</span>");
      gameStage = 1;
      createButtons([
        { id: 'btn1', text: '⚔️ Сражаться', action: fight },
        { id: 'btn2', text: '💨 Убежать', action: escape }
      ]);
    }
  }

  function choosePath2() {
    if (gameStage === 0) {
      updateScene("Dodge оживает!<br><span style='color:#4caf50'>Telegram-робот рядом...</span>");
      updateResult("<span style='color:#4caf50'>Код восстановлен!</span>");
      gameStage = 1;
      createButtons([
        { id: 'btn1', text: '🛡️ Активировать защиту', action: activateShield },
        { id: 'btn2', text: '📡 Отправить сигнал', action: sendSignal }
      ]);
    }
  }

  function fight() {
    updateScene("Ты запускаешь нейро-удар!<br>Роботы OmniCore взрываются 💥");
    updateResult("<span style='color:#ff5722'>Победа! Но система следит...</span>");
    endGame("hero");
  }

  function escape() {
    updateScene("Ты исчезаешь в туннелях данных...<br>OmniCore теряет след.");
    updateResult("<span style='color:#2196f3'>Ты свободен. Пока...</span>");
    endGame("runner");
  }

  function activateShield() {
    updateScene("Робот создаёт щит из кода!<br>Патруль замерз в цифровом льду ❄️");
    updateResult("<span style='color:#00bcd4'>Защита активна!</span>");
    endGame("defender");
  }

  function sendSignal() {
    updateScene("Сигнал уходит в сеть...<br>Сопротивление получает твои данные.");
    updateResult("<span style='color:#8bc34a'>Ты часть движения!</span>");
    endGame("resistance");
  }

  function endGame(outcome) {
    gameStage = 2;
    const tg = window.TG_APP;

    if (tg) {
      tg.MainButton.setText("Отправить результат");
      tg.MainButton.show();
      tg.MainButton.onClick(() => {
        tg.sendData(JSON.stringify({
          action: "game_complete",
          outcome: outcome,
          timestamp: Date.now()
        }));
        tg.close();
      });
    }

    // Можно добавить кнопку "Играть снова"
    setTimeout(() => {
      createButtons([
        { text: '🔄 Играть снова', action: () => location.reload() }
      ]);
    }, 2000);
  }

  // Вспомогательные функции
  function updateScene(html) {
    document.getElementById('scene').innerHTML = html;
  }

  function updateResult(html) {
    document.getElementById('result').innerHTML = html;
  }

  function createButtons(buttonConfigs) {
    const container = document.getElementById('buttons');
    container.innerHTML = '';
    buttonConfigs.forEach(cfg => {
      const btn = document.createElement('button');
      btn.className = 'comic-btn';
      if (cfg.id) btn.id = cfg.id;
      btn.textContent = cfg.text;
      btn.onclick = cfg.action;
      container.appendChild(btn);
    });
  }
})(); Обновил game.js: добавил логику игры, этапы, анимации и поддержку Telegram
