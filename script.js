const card = document.getElementById('holoCard');
const debug = document.getElementById('debug-console');
let centerG = 0; let centerB = 0;
let initialized = false;

// 화면 콘솔 출력 함수
function log(msg) {
  const line = document.createElement('div');
  line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  debug.prepend(line);
}

function updateHolo(g, b) {
  if (!initialized) return;

  const relG = g - centerG;
  const relB = b - centerB;

  // 디버그 정보 출력
  if (Math.random() > 0.95) { // 로그 폭주 방지
    debug.firstChild.textContent = `G: ${g.toFixed(1)}, B: ${b.toFixed(1)} | Rel: ${relG.toFixed(1)}, ${relB.toFixed(1)}`;
  }

  if (Math.abs(relG) > 70 || Math.abs(relB) > 70) {
    centerG = g; centerB = b;
    log("중앙값 갱신됨");
  }

  const bumpX = Math.sin(relG * 0.15) * 8;
  const bumpY = Math.cos(relB * 0.15) * 8;
  const px = 50 - (relG * 1.8) + bumpX;
  const py = 50 - (relB * 1.8) + bumpY;
  const hue = (relG + relB + 360) % 360;

  const diffractionMap = `
    linear-gradient(${45 + (relG * 0.5)}deg, transparent 10%, hsla(${hue}, 40%, 80%, 0.15) 30%, hsla(${(hue + 40) % 360}, 45%, 75%, 0.25) 50%, hsla(${(hue - 40) % 360}, 40%, 80%, 0.15) 70%, transparent 90%),
    radial-gradient(ellipse 60% 40% at ${px}% ${py}%, hsla(${(hue + 180) % 360}, 30%, 85%, 0.3) 0%, transparent 70%)
  `;

  card.style.setProperty('--diffraction', diffractionMap);
  card.style.transform = `rotateX(${-relB * 0.05}deg) rotateY(${relG * 0.05}deg)`;
}

async function handleStart() {
  log("센서 요청 시작...");
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const res = await DeviceOrientationEvent.requestPermission();
      log("iOS 권한 상태: " + res);
      if (res === 'granted') {
        window.addEventListener('deviceorientation', (e) => {
          if (!initialized) { centerG = e.gamma; centerB = e.beta; initialized = true; log("초기 영점 설정됨"); }
          updateHolo(e.gamma, e.beta);
        });
      }
    } catch (err) {
      log("에러: " + err.message);
    }
  } else {
    log("일반 브라우저/안드로이드 감지");
    window.addEventListener('deviceorientation', (e) => {
      if (!initialized) { centerG = e.gamma; centerB = e.beta; initialized = true; log("영점 설정됨"); }
      updateHolo(e.gamma, e.beta);
    });
    // 마우스 테스트용
    window.addEventListener('mousemove', (e) => {
      if (!initialized) initialized = true;
      const gx = (e.clientX / window.innerWidth - 0.5) * 60;
      const gy = (e.clientY / window.innerHeight - 0.5) * 60;
      updateHolo(gx, gy);
    });
  }
}

card.addEventListener('click', handleStart, { once: true });
