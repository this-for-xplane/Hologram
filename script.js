const card = document.getElementById('holoCard');
const specLayer = document.querySelector('.specular-layer');
const debug = document.getElementById('debug-console');

let centerG = 0; let centerB = 0;
let initialized = false;

function log(msg) {
  const line = document.createElement('div');
  line.textContent = msg;
  debug.prepend(line);
}

function updateHolo(g, b) {
  if (!initialized) return;

  const relG = g - centerG;
  const relB = b - centerB;

  // 1. 노이즈 및 좌표 계산
  const bumpX = Math.sin(relG * 0.1) * 10;
  const bumpY = Math.cos(relB * 0.1) * 10;
  const px = 50 - (relG * 1.5) + bumpX;
  const py = 50 - (relB * 1.5) + bumpY;
  const hue = (relG + relB + 720) % 360;

  // 2. 그래디언트 구문을 문자열로 조립 (오류 방지를 위해 띄어쓰기 주의)
  const grad1 = `linear-gradient(${45 + relG}deg, transparent 10%, hsla(${hue}, 50%, 80%, 0.3) 50%, transparent 90%)`;
  const grad2 = `radial-gradient(ellipse 60% 50% at ${px}% ${py}%, hsla(${(hue + 180) % 360}, 40%, 85%, 0.4) 0%, transparent 80%)`;
  
  const finalMap = `${grad1}, ${grad2}`;

  // 3. 변수 주입 (카드 전체가 아닌 레이어에 직접 주입하여 우선순위 확보)
  specLayer.style.setProperty('--diffraction', finalMap);
  
  // 4. 아주 미세한 움직임 적용
  card.style.transform = `perspective(1000px) rotateX(${-relB * 0.05}deg) rotateY(${relG * 0.05}deg)`;
}

async function handleStart() {
  log("센서 활성화 시도...");
  
  const startLogic = (e) => {
    if (!initialized) {
      centerG = e.gamma;
      centerB = e.beta;
      initialized = true;
      log("초기화 완료: 기준점 설정됨");
    }
    updateHolo(e.gamma, e.beta);
  };

  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const res = await DeviceOrientationEvent.requestPermission();
      if (res === 'granted') {
        window.addEventListener('deviceorientation', startLogic);
      } else {
        log("권한 거부됨");
      }
    } catch (err) {
      log("에러: " + err.message);
    }
  } else {
    log("안드로이드/데스크탑 모드");
    window.addEventListener('deviceorientation', startLogic);
    
    // PC 마우스 시뮬레이션
    window.addEventListener('mousemove', (e) => {
      if (!initialized) initialized = true;
      const gx = (e.clientX / window.innerWidth - 0.5) * 60;
      const gy = (e.clientY / window.innerHeight - 0.5) * 60;
      updateHolo(gx, gy);
    });
  }
}

card.addEventListener('click', handleStart, { once: true });
