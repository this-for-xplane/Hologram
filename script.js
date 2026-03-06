const debug = document.getElementById('debug-console');
const root = document.documentElement;
let initialized = false;
let warnedSensor = false;

function log(msg) {
  const line = document.createElement('div');
  line.textContent = `> ${msg}`;
  debug.prepend(line);
}

// 핵심 계산: 마우스/터치/센서 위치값을 받아 CSS 변수 업데이트
function updateHolo(xPercentage, yPercentage) {
  if (!initialized) {
    initialized = true;
    root.style.setProperty('--op', '1'); // 첫 입력 시 홀로그램 켜기
  }

  // 각도 계산 (-30도 ~ 30도)
  const rx = (yPercentage - 0.5) * -60;
  const ry = (xPercentage - 0.5) * 60;

  // 빛의 위치 퍼센트 (0% ~ 100%)
  const tx = xPercentage * 100;
  const ty = yPercentage * 100;

  // CSS에 실시간 값 전달
  root.style.setProperty('--rx', `${rx}deg`);
  root.style.setProperty('--ry', `${ry}deg`);
  root.style.setProperty('--tx', `${tx}%`);
  root.style.setProperty('--ty', `${ty}%`);
}

// 1. PC: 마우스 이동 (계속 움직임)
window.addEventListener('mousemove', (e) => {
  updateHolo(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
});

// 2. 모바일 폴백: 손가락으로 문지르기 (센서가 막혔을 때 실시간 작동을 위함)
window.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  updateHolo(touch.clientX / window.innerWidth, touch.clientY / window.innerHeight);
}, { passive: true }); // 스크롤 성능 저하 방지

// 3. 모바일 센서 이벤트 로직
async function startEngine() {
  log("센서 활성화 시도 중...");

  const handleOrientation = (e) => {
    // 안드로이드 센서값이 차단되어 null로 들어오면 경고 띄우고 종료
    if (e.gamma === null || e.beta === null) {
      if (!warnedSensor) {
        log("경고: 센서 값 차단됨! (HTTPS 환경 필수)");
        log("대신 손가락으로 화면을 드래그해보세요.");
        warnedSensor = true;
      }
      return;
    }

    // 모바일을 들고 있는 각도 정규화 (보통 폰을 45도 기울여서 봄)
    const xPercentage = Math.min(Math.max((e.gamma + 45) / 90, 0), 1);
    const yPercentage = Math.min(Math.max((e.beta - 20) / 90, 0), 1);

    updateHolo(xPercentage, yPercentage);
  };

  // iOS 13+ 기기 방향 권한 요청
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation);
        log("iOS 센서 권한 허용됨 - 기기를 기울여보세요.");
      } else {
        log("권한 거부됨 - 화면을 손가락으로 드래그해보세요.");
      }
    } catch (err) {
      log("오류 발생: " + err.message);
    }
  } else {
    // 안드로이드 및 구형 브라우저
    log("안드로이드 센서 대기 중... (기기를 기울여보세요)");
    window.addEventListener('deviceorientation', handleOrientation);
  }
}

// 화면을 클릭(터치)하면 엔진 시동
document.body.addEventListener('click', () => {
  if (!initialized) startEngine();
}, { once: true });
