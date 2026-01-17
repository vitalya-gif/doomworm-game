const tg = window.Telegram.WebApp;

tg.expand();
tg.setHeaderColor('#0d0d1a');
tg.setBackgroundColor('#0d0d1a');

tg.MainButton.setText("Поделиться");
tg.MainButton.show();

tg.MainButton.onClick(() => {
  tg.sendData(JSON.stringify({ action: "share" }));
});
