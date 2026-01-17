let health = 100;
let bucketsToday = 20;

function updateUI() {
  document.getElementById('health-percent').textContent = `${Math.max(0, Math.floor(health))}%`;
  document.getElementById('bucket-count').textContent = bucketsToday;
}

function playScream() {
  const sound = document.getElementById('scream-sound');
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }
  // Крик через alert (для эффекта)
  // Но лучше — визуальный эффект
}

function pourWater() {
  if (bucketsToday <= 0) return;

  const effect = document.getElementById('water-effect');
  effect.classList.remove('hidden');
  effect.classList.add('visible');

  // Уменьшаем вёдра
  bucketsToday--;
  // Увеличиваем здоровье
  health = Math.min(100, health + 5);

  // Крик
  playScream();

  updateUI();

  // Скрыть эффект через 1 сек
  setTimeout(() => {
    effect.classList.remove('visible');
    effect.classList.add('hidden');
  }, 1000);
}

// Инициализация
updateUI();

if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.expand();
  window.Telegram.WebApp.ready();
}
