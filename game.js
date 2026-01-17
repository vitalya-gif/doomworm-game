body {
  margin: 0;
  padding: 0;
  font-family: 'Bangers', cursive;
  background: #0a0a15;
  color: white;
  text-align: center;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

/* Фон: руины и туман */
body::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(100, 0, 0, 0.1), transparent 30%),
    radial-gradient(circle at 80% 70%, rgba(0, 50, 100, 0.1), transparent 30%),
    repeating-linear-gradient(0deg, rgba(0,0,0,0.8), rgba(0,0,0,0.8) 1px, transparent 1px, transparent 4px);
  z-index: -2;
}

#game {
  max-width: 500px;
  width: 95%;
  padding: 20px;
  background: rgba(10, 10, 20, 0.95);
  border-radius: 15px;
  box-shadow: 0 0 40px rgba(255, 65, 108, 0.6);
  position: relative;
  border: 2px solid #ff416c;
}

h1 {
  font-size: 2.4em;
  color: #ff416c;
  text-shadow: 4px 4px 0 #000, 0 0 15px rgba(255, 65, 108, 0.7);
  margin: 10px 0 15px;
}

#coins {
  font-size: 1.6em;
  margin: 15px 0;
  color: #ffeb3b;
  text-shadow: 2px 2px 0 #000;
}

#car-container {
  width: 240px;
  height: 140px;
  margin: 20px auto;
  position: relative;
  cursor: pointer;
}

#car {
  width: 100%;
  height: 100%;
  transition: transform 0.2s;
}

#car.crushed {
  animation: crushCar 0.6s forwards;
}

@keyframes crushCar {
  0% { transform: scale(1); }
  30% { transform: scale(0.95) rotate(-3deg); }
  60% { transform: scale(1.05) rotate(5deg); }
  100% { transform: scale(0.85) translateY(10px); }
}

/* Трещины на стекле */
#cracks {
  position: absolute;
  top: 30px;
  left: 50px;
  width: 140px;
  height: 30px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M10,50 L90,50 M50,10 L50,90 M20,20 L80,80 M80,20 L20,80' stroke='rgba(255,255,255,0.4)' stroke-width='1'/%3E%3C/svg%3E");
  opacity: 0;
  pointer-events: none;
}

#cracks.visible {
  opacity: 1;
  animation: flickerCracks 1s infinite;
}

@keyframes flickerCracks {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.2; }
}

/* Дым */
#smoke {
  position: absolute;
  bottom: 80px;
  left: 100px;
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, rgba(100,100,100,0.6), transparent 70%);
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
}

#smoke.smoking {
  animation: smokePuff 2s infinite;
}

@keyframes smokePuff {
  0% { opacity: 0; transform: translateY(0) scale(0.5); }
  50% { opacity: 0.7; }
  100% { opacity: 0; transform: translateY(-30px) scale(1.5); }
}

.hidden { display: none; }

.upgrade-btn {
  background: linear-gradient(45deg, #ff416c, #ff4b2b);
  color: white;
  border: 4px solid #000;
  font-family: 'Bangers', cursive;
  font-size: 1.2em;
  padding: 12px 20px;
  margin: 12px 0;
  cursor: pointer;
  box-shadow: 4px 4px 0 #000;
  border-radius: 10px;
  transition: all 0.15s;
}

.upgrade-btn:hover {
  transform: translateY(-2px);
  box-shadow: 6px 6px 0 #000;
}

.upgrade-btn:disabled {
  background: #555;
  cursor: not-allowed;
}

#stats {
  margin-top: 20px;
  font-size: 1.1em;
  color: #2196f3;
  text-shadow: 1px 1px 0 #000;
}
