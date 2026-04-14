:root {
  --rx: 0deg;
  --ry: 0deg;
  --tx: 50%;
  --ty: 50%;
  --op: 0;
}

body {
  margin: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at center, #1a1a1a 0%, #050505 100%);
  color: #eee;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
}

/* 배경 비네팅 효과 */
.vignette {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle, transparent 20%, rgba(0,0,0,0.8) 100%);
  pointer-events: none;
  z-index: 5;
}

.scene {
  text-align: center;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.header h1 {
  font-size: 0.9rem;
  letter-spacing: 0.3rem;
  color: rgba(255,255,255,0.5);
  margin: 0;
}

.header h1 span { color: #fff; }
.header p { font-size: 0.7rem; color: rgba(255,255,255,0.3); margin-top: 0.5rem; }

.holo-card {
  position: relative;
  width: 340px;
  height: 210px;
  background: linear-gradient(135deg, #444 0%, #888 50%, #444 100%);
  border-radius: 12px;
  overflow: hidden;
  /* 그림자를 다중으로 써서 바닥에서 뜬 느낌 강조 */
  box-shadow: 
    0 10px 20px rgba(0,0,0,0.5),
    0 30px 60px rgba(0,0,0,0.3),
    inset 0 0 0 1px rgba(255,255,255,0.1);
  transform-style: preserve-3d;
  transform: perspective(1200px) rotateX(var(--rx)) rotateY(var(--ry));
  will-change: transform;
  cursor: pointer;
}

/* 격자 패턴 개선 */
.surface-texture {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.15;
  background-image: 
    repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px),
    repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px);
  background-size: 4px 4px;
  mix-blend-mode: overlay;
}

.holo-glare {
  position: absolute;
  inset: -100%; /* 범위를 더 넓혀서 빛의 이동 반경 확보 */
  z-index: 2;
  opacity: var(--op);
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(
    110deg,
    #ff0000 0%, #ffff00 14%, #00ff00 28%, #00ffff 42%, 
    #0000ff 56%, #7700ff 70%, #ff00ff 84%, #ff0000 100%
  );
  background-size: 300% 300%;
  background-position: var(--tx) var(--ty);
  mix-blend-mode: color-dodge; /* exclusion보다 color-dodge가 금속 반사에 더 자연스러움 */
  filter: brightness(0.7) contrast(1.4);
}

.content {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.logo { 
  font-size: 2.5rem; 
  font-weight: 900;
  letter-spacing: -2px;
  color: #fff;
}

.serial {
  font-size: 0.5rem;
  margin-top: 15px;
  font-family: monospace;
  opacity: 0.5;
}

#debug-console {
  font-size: 0.7rem;
  color: #666;
  font-family: monospace;
  margin-bottom: 0.5rem;
}

.hint {
  font-size: 0.8rem;
  color: #444;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}
