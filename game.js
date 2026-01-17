// Переменная для отслеживания состояния
let gameStage = 0;

document.getElementById('btn1').onclick = () => {
  if (gameStage === 0) {
    // Этап 1: Бежим в Doomworm
    document.getElementById('scene').innerHTML = "Ты в Doomworm...<br>Но патрули близко!";
    document.getElementById('result').innerHTML = "<span style='color:#ffeb3b'>+10 TON за смелость!</span>";
    gameStage = 1;
  } else if (gameStage === 1) {
    // Этап 2: Появляются роботы
    document.getElementById('scene').innerHTML = "Патрульные роботы OmniCore!<br>Они тебя заметили...";
    document.getElementById('result').innerHTML = "<span style='color:#f44336'>Убегай или сражайся?</span>";
    gameStage = 2;
  }
};

document.getElementById('btn2').onclick = () => {
  if (gameStage === 0) {
    // Этап 1: Спрятаться у Dodge
    document.getElementById('scene').innerHTML = "Dodge ожил!<br>Telegram-робот рядом...";
    document.getElementById('result').innerHTML = "<span style='color:#4caf50'>Код восстановлен!</span>";
    gameStage = 1;
  } else if (gameStage === 1) {
    // Этап 2: Робот помогает
    document.getElementById('scene').innerHTML = "Робот активирует защиту!<br>Патруль замерз!";
    document.getElementById('result').innerHTML = "<span style='color:#2196f3'>Ты спасён!</span>";
    gameStage = 2;
  }
}; Update game logic
