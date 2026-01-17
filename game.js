let coins = 0;
let damage = 1;
let autoDamage = 0;
let hammerLevel = 0;

// Загрузка сохранения
function loadGame() {
  const saved = localStorage.getItem('doomworm-car-crusher');
  if (saved) {
    const data = JSON.parse(saved);
    coins = data.coins || 0;
    damage = data.damage || 1;
    autoDamage = data.autoDamage || 0;
    hammerLevel = data.hammerLevel || 0;
    updateUI();
  }
}

// Сохранение
function saveGame() {
  localStorage.setItem('doomworm-car-crusher', JSON.stringify({
    coins,
    damage,
    autoDamage,
    hammerLevel
  }));
}

// Обновление интерфейса
function updateUI() {
  document.getElementById('coin-count').textContent = Math.floor(coins);
  document.getElementById('damage').textContent = damage;
  document.getElementById('auto-dmg').textContent = autoDamage;
  
  const btn = document.querySelector('.upgrade-btn');
  btn.disabled = coins < 100;
}

// Проиграть звук разрушения
function playCrashSound() {
  const sound = document.getElementById('crash-sound');
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(e => console.log("Audio play failed"));
  }
}

// Разрушить машину
function crushCar() {
  const car = document.getElementById('car');
  const container = document.getElementById('car-container');
  
  // Добавляем эффект разбитого стекла
  const shatter = document.createElement('div');
  shatter.className = 'glass-shatter';
  shatter.style.opacity = '0.7';
  container.appendChild(shatter);
  
  setTimeout(() => {
    shatter.remove();
  }, 500);
  
  // Анимация
  car.classList.remove('crushed');
  void car.offsetWidth; // триггер перерисовки
  car.classList.add('crushed');
  
  // Звук
  playCrashSound();
  
  // Награда
  coins += damage;
  updateUI();
  saveGame();
}

// Купить кувалду (увеличивает урон)
function buyHammer() {
  if (coins >= 100) {
    coins -= 100;
    damage += 2;
    hammerLevel++;
    updateUI();
    saveGame();
    
    // Обновим текст кнопки
    const btn = document.querySelector('.upgrade-btn');
    btn.textContent = `Кувалда (${hammerLevel + 1}): ${100 * (hammerLevel + 1)} монет`;
  }
}

// Пассивный доход (авто-разрушение)
setInterval(() => {
  if (autoDamage > 0) {
    coins += autoDamage / 10;
    updateUI();
    saveGame();
  }
}, 100);

// Инициализация
loadGame();
updateUI();

// Поддержка Telegram
if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.expand();
  window.Telegram.WebApp.ready();
}
