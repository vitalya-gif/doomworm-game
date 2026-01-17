document.getElementById('btn1').onclick = () => {
  document.getElementById('scene').innerHTML = "Ты в Doomworm...<br>Но патрули близко!";
  document.getElementById('result').innerHTML = "<span style='color:#ffeb3b'>+10 TON за смелость!</span>";
};

document.getElementById('btn2').onclick = () => {
  document.getElementById('scene').innerHTML = "Dodge ожил!<br>Telegram-робот рядом...";
  document.getElementById('result').innerHTML = "<span style='color:#4caf50'>Код восстановлен!</span>";
};
