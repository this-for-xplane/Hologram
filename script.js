const root = document.documentElement;
const card = document.getElementById('holoCard');
const debug = document.getElementById('debug-console');
let initialized = false;

function log(msg) {
  const line = document.createElement('div');
  line.textContent = `> ${msg}`;
  debug.prepend(line);
}

function updateHolo(xPerc, yPerc) {
  if (!initialized) {
    initialized = true;
    root.style.setProperty('--op', '1');
  }
  // 스티커의 묵직한 질감을 위해 회전각을 살짝 줄이고 빛의 이동을 선명하게 함
  root.style.setProperty('--rx', `${(yPerc - 0.5) * -30}deg`);
  root.style.setProperty('--ry', `${(xPerc - 0.5) * 30}deg`);
  root.style.setProperty('--tx', `${xPerc * 100}%`);
  root.style.setProperty('--ty', `${yPerc * 100}%`);
}

// 갤럭시용 핸들러 (절대 좌표계 사용 시 더 정확함)
function handleAndroidSensor(e) {
  let { gamma, beta } = e; 
  // 갤럭시 가로/세로 모드 대응 보정
  if (gamma === null || beta === null) return;

  // 갤럭시 센서 범위를 0~1로 매핑
  const x = Math.min(Math.max((gamma + 45) / 90, 0), 1);
  const y = Math.min(Math.max((beta - 25) / 60, 0), 1);
  
  updateHolo(x, y);
}

async function startEngine() {
  log("엔진 시동...");

  // 1. iOS 권한 요청 처리
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission === 'granted') {
        window.addEventListener('deviceorientation', handleAndroidSensor);
        log("iOS 연결됨");
      }
    } catch (err) { log("iOS 오류: " + err.message); }
  } 
  // 2. 안드로이드 및 일반 환경
  else {
    // 안드로이드는 'deviceorientationabsolute'가 더 정확할 때가 많음
    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', handleAndroidSensor);
      log("갤럭시 Absolute 모드 활성화");
    } else {
      window.addEventListener('deviceorientation', handleAndroidSensor);
      log("표준 모드 활성화");
    }
  }
}

// 터치 드래그는 항상 작동하게 (백업)
window.addEventListener('touchmove', (e) => {
  updateHolo(e.touches[0].clientX / window.innerWidth, e.touches[0].clientY / window.innerHeight);
}, { passive: true });

window.addEventListener('mousemove', (e) => {
  updateHolo(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
});

card.addEventListener('click', startEngine, { once: true });
