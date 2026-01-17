(function () {
  let gameStage = 0;
  let killCount = 0;
  let level = 1;

  // Безопасное получение элементов
  function $(id) {
    const el = document.getElementById(id);
    if (!el) {
      console.warn(`Элемент #${id} не найден`);
      return null;
    }
    return el;
  }

  function updateKillCount() {
    const el = $('kill-count');
    if (el) el.textContent = killCount;
  }

  function startGame() {
    const scene = $('scene');
    if (!scene) return; // Защита

    scene.innerHTML = "Ты скачал Telegram.<br><span class='flicker'>OmniCore уже ищет тебя...</span>";
    createButtons([
      { text: '🏃 Бежать в Doomworm', action: startEscape },
      { text: '🚗 Спрятаться у Dodge', action: hideWithDodge }
    ]);
    updateKillCount();
    showLevelBadge();
  }

  function showLevelBadge() {
    const gameDiv = $('game');
    if (!gameDiv) return;
    let badge = document.querySelector('.level-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'level-badge';
      gameDiv.appendChild(badge);
    }
    badge.textContent = `Уровень ${level}`;
  }

  function startEscape() {
    if (gameStage === 0) {
      level = 1;
      showLevelBadge();
      showRobot();
      $('scene').innerHTML = "<span class='alert'>Ты врываешься в Doomworm!</span><br>Патрули на пороге!";
      $('result').innerHTML = "<span style='color:#ffeb3b'>+10 TON за смелость!</span>";
      gameStage = 1;
      createButtons([
        { text: '🤖 Вызвать робота', action: callRobot },
        { text: '💨 Убежать', action: escapeAlone }
      ]);
    }
  }

  function callRobot() {
    if (gameStage === 1) {
      $('scene').innerHTML = "Маленький робот 🤖 выходит из тени...<br>Он готов к бою!";
      $('result').innerHTML = "<span style='color:#4caf50'>Робот активирован!</span>";
      gameStage = 2;
      createButtons([
        { text: '⚡ Стрелять лазером', action: shootLaser },
        { text: '🏃 Бежать вместе', action: runTogether }
      ]);
    }
  }

  function shootLaser() {
    if (gameStage >= 2) {
      const container = $('robot-container');
      if (container) {
        const laser = document.createElement('div');
        laser.className = 'laser';
        container.appendChild(laser);

        setTimeout(() => {
          const explosion = document.createElement('div');
          explosion.className = 'explosion';
          container.appendChild(explosion);
          killCount++;
          updateKillCount();

          setTimeout(() => {
            laser.remove();
            explosion.remove();
          }, 500);
        }, 300);
      }

      $('scene').innerHTML = "Лазерный луч пронзает воздух!<br>Злой робот OmniCore взрывается 💥";
      $('result').innerHTML = `<span style='color:#ff5722'>Уничтожен! Всего: ${killCount}</span>`;

      if (killCount >= 2 && level === 1) {
        level = 2;
        showLevelBadge();
        $('scene').innerHTML = "⚠️ Вторая волна патрулей!<br>Город рушится...";
        createButtons([
          { text: '🔥 Стрелять быстрее', action: shootLaser },
          { text: '🚀 Прорываться', action: finalRun }
        ]);
      }
    }
  }

  function runTogether() {
    $('scene').innerHTML = "Вы бежите по разрушенному городу...<br>Здания горят, но робот ведёт тебя!";
    $('result').innerHTML = "<span style='color:#2196f3'>Скорость +20%</span>";
    gameStage = 3;
    createButtons([
      { text: '🏃 Бежать вперёд', action: finalRun },
      { text: '🛡️ Защититься', action: shieldUp }
    ]);
  }

  function finalRun() {
    if (level === 2) {
      $('scene').innerHTML = "Вы прорываетесь сквозь огненные завалы!<br>OmniCore теряет вас из виду...";
      $('result').innerHTML = "<span style='color:#8bc34a'>Победа! Но это только начало...</span>";
      endGame("hero");
    } else {
      $('scene').innerHTML = "Вы бежите... но патрули окружают вас.";
      createButtons([{ text: '⚡ Стрелять!', action: shootLaser }]);
    }
  }

  function shieldUp() {
    $('scene').innerHTML = "Робот создаёт щит из кода!<br>Патруль замерз в цифровом льду ❄️";
    $('result').innerHTML = "<span style='color:#00bcd4'>Защита активна!</span>";
    gameStage = 3;
    createButtons([{ text: '🚀 Бежать дальше', action: finalRun }]);
  }

  function escapeAlone() {
    $('scene').innerHTML = "Ты бежишь один...<br>Но патрули слишком быстрые.";
    $('result').innerHTML = "<span style='color:#f44336'>Пойман! Ты стёрт из сети...</span>";
    endGame("captured");
  }

  function hideWithDodge() {
    $('scene').innerHTML = "Dodge оживает!<br>Telegram-робот рядом...";
    $('result').innerHTML = "<span style='color:#4caf50'>Код восстановлен!</span>";
    endGame("defender");
  }

  function endGame(outcome) {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.MainButton.setText("Отправить результат");
      tg.MainButton.show();
      tg.MainButton.onClick(() => {
        tg.sendData(JSON.stringify({
          action: "game_complete",
          outcome: outcome,
          kills: killCount,
          level: level,
          timestamp: Date.now()
        }));
        tg.close();
      });
    }
    createButtons([{ text: '🔄 Играть снова', action: () => location.reload() }]);
  }

  function showRobot() {
    const container = $('robot-container');
    if (container) {
      container.innerHTML = '';
      const robot = document.createElement('div');
      robot.className = 'robot';
      container.appendChild(robot);
    }
  }

  function createButtons(buttonConfigs) {
    const container = $('buttons');
    if (!container) return;
    container.innerHTML = '';
    buttonConfigs.forEach(cfg => {
      const btn = document.createElement('button');
      btn.className = 'comic-btn';
      btn.textContent = cfg.text;
      btn.onclick = cfg.action;
      container.appendChild(btn);
    });
  }

  // Запуск после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startGame);
  } else {
    startGame();
  }
})();
