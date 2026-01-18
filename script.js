// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();
tg.BackButton.show();

// Игровые переменные с эффектами
let gameState = {
    clicks: 0,
    totalClicks: 0,
    autoClicks: 0,
    multiplier: 1,
    autoLevel: 0,
    multiLevel: 0,
    comboLevel: 0,
    autoPrice: 10,
    multiPrice: 50,
    comboPrice: 100,
    autoPower: 1,
    startTime: Date.now(),
    autoEarned: 0,
    comboCounter: 0,
    maxCombo: 1,
    recordCombo: 1,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    lastClickTime: Date.now(),
    comboTimeout: null,
    achievements: []
};

// Эффекты частиц
const particles = {
    colors: ['#ff0080', '#00ff80', '#0080ff', '#ff8000', '#8000ff'],
    
    createFloatingNumber(value, x, y) {
        const container = document.getElementById('floating-numbers');
        const number = document.createElement('div');
        
        number.textContent = `+${value}`;
        number.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            font-size: 24px;
            font-weight: bold;
            color: ${this.colors[Math.floor(Math.random() * this.colors.length)]};
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            z-index: 1001;
            pointer-events: none;
            animation: floatUp 1.5s ease-out forwards;
        `;
        
        container.appendChild(number);
        
        // Удаляем через 1.5 секунд
        setTimeout(() => number.remove(), 1500);
    },
    
    createParticles(x, y, count = 15) {
        const container = document.getElementById('particles-container');
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 10 + 5;
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100 + 50;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                background: ${this.colors[Math.floor(Math.random() * this.colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                --tx: ${tx}px;
                --ty: ${ty}px;
                animation: particleFly 1s ease-out forwards;
            `;
            
            container.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }
    },
    
    createConfetti() {
        const container = document.getElementById('confetti-container');
        const confettiCount = 150;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            const size = Math.random() * 20 + 5;
            const left = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 3 + 2;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            
            confetti.style.cssText = `
                position: absolute;
                left: ${left}%;
                top: -50px;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                transform: rotate(${Math.random() * 360}deg);
                animation: confettiFall ${duration}s ease-in ${delay}s forwards;
                opacity: 0.8;
            `;
            
            container.appendChild(confetti);
            setTimeout(() => confetti.remove(), (duration + delay) * 1000);
        }
    },
    
    createButtonEffects() {
        const dots = ['effect-dot-1', 'effect-dot-2', 'effect-dot-3'];
        
        dots.forEach((id, index) => {
            const dot = document.getElementById(id);
            const angle = (index * 120 + Math.random() * 30) * Math.PI / 180;
            const distance = 100 + Math.random() * 50;
            
            dot.style.cssText = `
                left: ${50 + Math.cos(angle) * distance}%;
                top: ${50 + Math.sin(angle) * distance}%;
                opacity: 1;
                animation: particleFly 2s ease-out infinite ${index * 0.3}s;
            `;
        });
    },
    
    createComboAnimation(combo) {
        const container = document.getElementById('combo-animation');
        const sizes = [200, 250, 300];
        const colors = ['#ff0080', '#00ff80', '#0080ff'];
        
        sizes.forEach((size, index) => {
            const ring = document.createElement('div');
            ring.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: ${size}px;
                height: ${size}px;
                border: 8px solid ${colors[index]};
                border-radius: 50%;
                transform: translate(-50%, -50%);
                opacity: 0;
                animation: pulse 0.5s ease-out ${index * 0.1}s forwards;
            `;
            
            container.appendChild(ring);
            setTimeout(() => ring.remove(), 1000);
        });
        
        // Текст комбо
        const text = document.createElement('div');
        text.textContent = `COMBO x${combo}!`;
        text.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 48px;
            font-weight: bold;
            color: white;
            text-shadow: 0 0 20px #ff0080;
            animation: comboGlow 0.5s ease-in-out 3, floatUp 1s ease-out 1s forwards;
        `;
        
        container.appendChild(text);
        setTimeout(() => text.remove(), 2000);
    }
};

// Достижения
const achievements = [
    { id: 1, name: 'Первый клик!', desc: 'Сделайте первый клик', earned: false, check: () => gameState.totalClicks >= 1 },
    { id: 2, name: 'Кликер-новичок', desc: 'Сделайте 100 кликов', earned: false, check: () => gameState.totalClicks >= 100 },
    { id: 3, name: 'Кликер-профи', desc: 'Сделайте 1000 кликов', earned: false, check: () => gameState.totalClicks >= 1000 },
    { id: 4, name: 'Мастер кликов', desc: 'Сделайте 10000 кликов', earned: false, check: () => gameState.totalClicks >= 10000 },
    { id: 5, name: 'Автоматизация', desc: 'Купите первый автокликер', earned: false, check: () => gameState.autoLevel >= 1 },
    { id: 6, name: 'Умножение', desc: 'Купите первый мультипликатор', earned: false, check: () => gameState.multiLevel >= 1 },
    { id: 7, name: 'Комбо мастер', desc: 'Достигните комбо x10', earned: false, check: () => gameState.recordCombo >= 10 },
    { id: 8, name: 'Ветеран', desc: 'Играйте более 10 минут', earned: false, check: () => (Date.now() - gameState.startTime) > 600000 }
];

// Инициализация игры
function initGame() {
    // Загружаем сохранение
    const saved = localStorage.getItem('clicker_save');
    if (saved) {
        const loaded = JSON.parse(saved);
        gameState = { ...gameState, ...loaded };
        gameState.startTime = Date.now() - (loaded.playTime || 0);
    }
    
    // Показываем имя пользователя
    if (tg.initDataUnsafe?.user) {
        const user = tg.initDataUnsafe.user;
        document.getElementById('username').textContent = 
            user.first_name || user.username || 'Игрок';
    }
    
    // Инициализируем эффекты
    particles.createButtonEffects();
    
    // Обновляем интерфейс
    updateUI();
    
    // Запускаем авто-кликер
    setInterval(autoClick, 1000);
    
    // Запускаем таймер
    setInterval(updateTimer, 1000);
    
    // Проверяем достижения
    setInterval(checkAchievements, 5000);
    
    // Обработчик кнопки "Назад"
    tg.onEvent('backButtonClicked', () => {
        saveGame();
        tg.close();
    });
}

// Основной клик с эффектами
document.getElementById('click-btn').addEventListener('click', function(e) {
    // Координаты клика
    const rect = this.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Анимация кнопки
    this.classList.add('clicking');
    setTimeout(() => this.classList.remove('clicking'), 300);
    
    // Комбо система
    const now = Date.now();
    const timeDiff = now - gameState.lastClickTime;
    
    if (timeDiff < 500) { // 500ms для комбо
        gameState.comboCounter = Math.min(gameState.comboCounter + 1, gameState.maxCombo);
        clearTimeout(gameState.comboTimeout);
    } else {
        gameState.comboCounter = 1;
    }
    
    gameState.lastClickTime = now;
    
    // Сброс комбо через 1 секунду
    gameState.comboTimeout = setTimeout(() => {
        gameState.comboCounter = 1;
        updateCombo();
    }, 1000);
    
    // Рассчет значения клика
    const comboMultiplier = 1 + (gameState.comboCounter - 1) * 0.1;
    const clickValue = Math.floor(1 * gameState.multiplier * comboMultiplier);
    
    // Добавляем клики
    gameState.clicks += clickValue;
    gameState.totalClicks += clickValue;
    
    // Добавляем опыт
    gameState.xp += clickValue;
    
    // Эффекты
    particles.createFloatingNumber(clickValue, x, y);
    particles.createParticles(x, y, 10);
    
    // Комбо эффекты
    if (gameState.comboCounter > 1) {
        particles.createComboAnimation(gameState.comboCounter);
        updateCombo();
        
        if (gameState.comboCounter > gameState.recordCombo) {
            gameState.recordCombo = gameState.comboCounter;
        }
    }
    
    // Обновляем интерфейс
    updateUI();
    
    // Сохраняем каждые 10 кликов
    if (gameState.totalClicks % 10 === 0) {
        saveGame();
    }
    
    // Вибрация
    tg.HapticFeedback.impactOccurred('light');
});

// Авто-кликер
function autoClick() {
    if (gameState.autoLevel > 0) {
        const autoValue = gameState.autoPower * gameState.multiplier;
        gameState.clicks += autoValue;
        gameState.totalClicks += autoValue;
        gameState.autoEarned += autoValue;
        gameState.xp += autoValue;
        
        // Случайный эффект частиц
        if (Math.random() > 0.7) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            particles.createParticles(x, y, 3);
        }
        
        updateUI();
    }
}

// Покупка улучшений
function buyUpgrade(type) {
    let price, success = false;
    
    switch(type) {
        case 'auto':
            price = gameState.autoPrice;
            if (gameState.clicks >= price) {
                gameState.clicks -= price;
                gameState.autoLevel++;
                gameState.autoPower += 1;
                gameState.autoPrice = Math.floor(price * 1.5);
                success = true;
                
                // Эффект покупки
                tg.HapticFeedback.impactOccurred('medium');
                showNotification('Автокликер улучшен! ⚡');
            }
            break;
            
        case 'multi':
            price = gameState.multiPrice;
            if (gameState.clicks >= price) {
                gameState.clicks -= price;
                gameState.multiLevel++;
                gameState.multiplier += 0.5;
                gameState.multiPrice = Math.floor(price * 2);
                success = true;
                
                // Эффект покупки
                tg.HapticFeedback.impactOccurred('heavy');
                showNotification('Множитель улучшен! 🚀');
            }
            break;
            
        case 'combo':
            price = gameState.comboPrice;
            if (gameState.clicks >= price) {
                gameState.clicks -= price;
                gameState.comboLevel++;
                gameState.maxCombo += 1;
                gameState.comboPrice = Math.floor(price * 3);
                success = true;
                
                // Эффект покупки
                tg.HapticFeedback.impactOccurred('rigid');
                particles.createConfetti();
                showNotification('Комбо система улучшена! 💥');
            }
            break;
    }
    
    if (success) {
        updateUI();
        saveGame();
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
    document.getElementById('record-combo').textContent = 
        `x${gameState.recordCombo}`;
    
    // Обновляем улучшения
    document.getElementById('auto-level').textContent = gameState.autoLevel;
    document.getElementById('auto-power').textContent = gameState.autoPower;
    document.getElementById('auto-price').textContent = gameState.autoPrice;
    
    document.getElementById('multi-level').textContent = gameState.multiLevel;
    document.getElementById('multi-value').textContent = gameState.multiplier;
    document.getElementById('multi-price').
