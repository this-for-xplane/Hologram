/**
 * script.js
 * 파일 위치: /script.js
 */

const root = document.documentElement;
const card = document.getElementById('holoCard');
const debug = document.getElementById('debug-console');
let initialized = false;

function log(msg) {
  if (!debug) return;
  const line = document.createElement('div');
  line.textContent = `> ${msg}`;
  debug.prepend(line);
  console.log(msg);
}

// 홀로그램 시각 효과 업데이트 함수
function updateHolo(xPerc, yPerc) {
  if (!initialized) {
    initialized = true;
    root.style.setProperty('--op', '1');
  }
  
  // 아이패드 파지 각도를 고려한 민감도 조절
  // 0.5를 중심으로 최대 25도까지 회전
  const rx = (yPerc - 0.5) * -25; 
  const ry = (xPerc - 0.5) * 25;  
  
  root.style.setProperty('--rx', `${rx}deg`);
  root.style.setProperty('--ry', `${ry}deg`);
  root.style.setProperty('--tx', `${xPerc * 100}%`);
  root.style.setProperty('--ty', `${yPerc * 100}%`);
}

// 센서 데이터 매핑 함수 (기기별 최적화)
function handleOrientation(e) {
  // e.beta: 앞뒤 기울기 (-180 ~ 180), e.gamma: 좌우 기울기 (-90 ~ 90)
  if (e.gamma === null || e.beta === null) return;

  // 아이패드를 세로로 들었을 때 기준 (기본 각도 보정)
  // x축: 좌우 -30도 ~ +30도 범위를 0 ~ 1로 변환
  // y축: 상하 10도 ~ 70도 범위를 0 ~ 1로 변환 (들고 보는 각도)
  const x = Math.min(Math.max((e.gamma + 30) / 60, 0), 1);
  const y = Math.min(Math.max((e.beta - 10) / 60, 0), 1);
  
  updateHolo(x, y);
}

// 권한 요청 함수
async function startEngine() {
  log("센서 활성화 시도...");

  // iOS 13+ 권한 요청 처리
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const response = await DeviceOrientationEvent.requestPermission();
      log("권한 상태: " + response);
      
      if (response === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation, true);
        log("센서 연결 성공!");
      } else {
        alert("센서 권한이 거부되었습니다. 설정에서 Safari의 동작 및 방향 접근을 허용해주세요.");
      }
    } catch (error) {
      log("오류 발생: " + error.message);
    }
  } else {
    // 안드로이드 및 일반 브라우저
    window.addEventListener('deviceorientation', handleOrientation, true);
    log("표준 센서 연결");
  }
}

// 1. 마우스 이동 (PC 대응)
window.addEventListener('mousemove', (e) => {
  updateHolo(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
});

// 2. 터치 이동 (백업)
window.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  updateHolo(touch.clientX / window.innerWidth, touch.clientY / window.innerHeight);
}, { passive: true });

// 3. 카드 클릭 시 권한 요청 (핵심!)
card.addEventListener('click', () => {
  startEngine();
}, { once: true });
