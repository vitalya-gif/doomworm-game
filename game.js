let points = 0;
let upgrades = 0;
let multiplier = 1;

function updateUI() {
  document.getElementById("points").textContent = points;
  document.getElementById("upg-count").textContent = upgrades;
  updateStory();
}

function updateStory() {
  const story = document.getElementById("story");

  if (points < 50) {
    story.textContent = "DoomBot с тобой. Уничтожай дронов OmniCore!";
  } else if (points < 200) {
    story.textContent = "OmniCore в панике. Продолжай давить их дронов!";
  } else {
    story.textContent = "Ты кошмар OmniCore. Doomworm уже чувствует твой гнев.";
  }
}

function saveGame() {
  localStorage.setItem(
    "doomworm-clicker",
    JSON.stringify({ points, upgrades, multiplier })
  );
}

function loadGame() {
  const saved = localStorage.getItem("doomworm-clicker");
  if (!saved) {
    updateUI();
    return;
  }

  try {
    const data = JSON.parse(saved);
    points = data.points || 0;
    upgrades = data.upgrades || 0;
    multiplier = data.multiplier || 1;
  } catch (e) {
    points = 0;
    upgrades = 0;
    multiplier = 1;
  }

  updateUI();
}

function clickDrone() {
  const drone = document.getElementById("drone");
  const explosion = document.getElementById("explosion");
  const sound = document.getElementById("explosion-sound");

  drone.classList.add("clicked");
  setTimeout(() => drone.classList.remove("clicked"), 100);

  drone.style.opacity = "0";
  explosion.style.opacity = "1";

  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  points += 10 * multiplier;

  if (points % 50 === 0 && points > 0) {
    upgrades += 1;
    multiplier += 1;
  }

  updateUI();
  saveGame();

  setTimeout(() => {
    explosion.style.opacity = "0";
    setTimeout(() => {
      drone.style.opacity = "1";
    }, 300);
  }, 700);
}

function resetGame() {
  points = 0;
  upgrades = 0;
  multiplier = 1;
  localStorage.removeItem("doomworm-clicker");
  updateUI();
}

document.getElementById("drone-container").onclick = clickDrone;
document.getElementById("reset-btn").onclick = resetGame;

loadGame();

window.doomwormGame = {
  getScore: () => points
};
