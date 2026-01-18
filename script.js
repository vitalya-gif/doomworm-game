// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем на весь экран
tg.BackButton.show();

// Обработчик кнопки "Назад"
tg.onEvent('backButtonClicked', () => {
    saveGame();
    tg.close();
});

// Игровые переменные
let gameState = {
    clicks: 0,
    totalClicks: 0,
    autoClicks: 0,
    multiplier: 1,
    autoLevel: 0,
    multiLevel: 0,
    autoPrice: 10,
    multiPrice: 50,
    autoPower: 1,
    startTime: Date.now(),
    autoEarned: 0
};

// Инициализация игры
function initGame() {
    // Загружаем сохранение
    const saved = localStorage.getItem('clicker_save');
    if (saved) {
        gameState = JSON.parse(saved);
        gameState.startTime = Date.now(); // Сбрасываем время начала
    }
    
    // Показываем имя пользователя если есть
    if (tg.initDataUnsafe?.user) {
        const user = tg.initDataUnsafe.user;
        document.getElementById('username').textContent = 
            user.first_name || user.username || 'Игрок';
    }
    
    // Обновляем интерфейс
    updateUI();
    
    // Запускаем авто-кликер
    setInterval(autoClick, 1000);
    
    // Запускаем таймер
    setInterval(updateTimer, 1000);
}

// Основной клик
document.getElementById('click-btn').addEventListener('click', function() {
    // Анимация кнопки
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 100);
    
    // Добавляем клики
    const clickValue = 1 * gameState.multiplier;
    gameState.clicks += clickValue;
    gameState.totalClicks += clickValue;
    
    // Обновляем интерфейс
    updateUI();
    
    // Сохраняем каждые 10 кликов
    if (gameState.totalClicks % 10 === 0) {
        saveGame();
    }
});

// Авто-кликер
function autoClick() {
    if (gameState.autoLevel > 0) {
        const autoValue = gameState.autoPower * gameState.multiplier;
        gameState.clicks += autoValue;
        gameState.totalClicks += autoValue;
        gameState.autoEarned += autoValue;
        updateUI();
    }
}

// Покупка улучшений
function buyUpgrade(type) {
    if (type === 'auto') {
        if (gameState.clicks >= gameState.autoPrice) {
            gameState.clicks -= gameState.autoPrice;
            gameState.autoLevel++;
            gameState.autoPower += 1;
            gameState.autoPrice = Math.floor(gameState.autoPrice * 1.5);
            updateUI();
            saveGame();
        }
    } else if (type === 'multi') {
        if (gameState.clicks >= gameState.multiPrice) {
            gameState.clicks -= gameState.multiPrice;
            gameState.multiLevel++;
            gameState.multiplier += 0.5;
            gameState.multiPrice = Math.floor(gameState.multiPrice * 2);
            updateUI();
            saveGame();
        }
    }
}

// Обновление интерфейса
function updateUI() {
    // Обновляем счетчики
    document.getElementById('counter').textContent = 
        Math.floor(gameState.clicks).toLocaleString();
    document.getElementById('total-clicks').textContent = 
        Math.floor(gameState.totalClicks).toLocaleString();
    document.getElementById('auto-earned').textContent = 
        Math.floor(gameState.autoEarned).toLocaleString();
    
    // Обновляем улучшения
    document.getElementById('auto-level').textContent = gameState.autoLevel;
    document.getElementById('auto-power').textContent = gameState.autoPower;
    document.getElementById('auto-price').textContent = gameState.autoPrice;
    
    document.getElementById('multi-level').textContent = gameState.multiLevel;
    document.getElementById('multi-value').textContent = gameState.multiplier;
    document.getElementById('multi-price').textContent = gameState.multiPrice;
    
    // Обновляем кнопки покупки
    document.querySelectorAll('.buy-btn').forEach(btn => {
        const price = parseInt(btn.querySelector('span').textContent);
        btn.disabled = gameState.clicks < price;
    });
    
    // Рассчитываем CPS (кликов в секунду)
    const cps = gameState.autoPower * gameState.multiplier;
    document.getElementById('cps').textContent = cps.toFixed(1);
}

// Таймер игры
function updateTimer() {
    const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    document.getElementById('play-time').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Сохранение игры
function saveGame() {
    localStorage.setItem('clicker_save', JSON.stringify(gameState));
    tg.HapticFeedback.impactOccurred('light'); // Вибрация
    showNotification('Игра сохранена! 💾');
}

// Сброс игры
function resetGame() {
    if (confirm('Вы уверены? Весь прогресс будет потерян!')) {
        gameState = {
            clicks: 0,
            totalClicks: 0,
            autoClicks: 0,
            multiplier: 1,
            autoLevel: 0,
            multiLevel: 0,
            autoPrice: 10,
            multiPrice: 50,
            autoPower: 1,
            startTime: Date.now(),
            autoEarned: 0
        };
        localStorage.removeItem('clicker_save');
        updateUI();
        tg.HapticFeedback.impactOccurred('medium');
        showNotification('Игра сброшена! 🔄');
    }
}

// Поделиться игрой
function shareGame() {
    const text = `🎮 Я накликал ${gameState.totalClicks.toLocaleString()} кликов в Simple Clicker! Попробуй и ты!`;
    tg.shareMessage(text);
}

// Уведомления
function showNotification(message) {
    // Создаем временное уведомление
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 12px 24px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Добавляем CSS анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Запускаем игру при загрузке
document.addEventListener('DOMContentLoaded', initGame);
