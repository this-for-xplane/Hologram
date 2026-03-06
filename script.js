const debug = document.getElementById('debug-console');
const root = document.documentElement;
let initialized = false;

function log(msg) {
  const line = document.createElement('div');
  line.textContent = `> ${msg}`;
  debug.prepend(line);
}

// 핵심 계산: 마우스나 센서의 위치값을 받아 CSS 변수 업데이트
function updateHolo(xPercentage, yPercentage) {
  if (!initialized) {
    initialized = true;
    root.style.setProperty('--op', '1'); // 첫 입력 시 홀로그램 켜기
  }

  // 각도 계산 (-15도 ~ 15도)
  const rx = (yPercentage - 0.5) * -30;
  const ry = (xPercentage - 0.5) * 30;

  // 빛의 위치 퍼센트 (0% ~ 100%)
  const tx = xPercentage * 100;
  const ty = yPercentage * 100;

  // CSS에 값 전달
  root.style.setProperty('--rx', `${rx}deg`);
  root.style.setProperty('--ry', `${ry}deg`);
  root.style.setProperty('--tx', `${tx}%`);
  root.style.setProperty('--ty', `${ty}%`);
}

// 1. PC 테스트용 마우스 이벤트 (항상 켜둠)
window.addEventListener('mousemove', (e) => {
  const xPercentage = e.clientX / window.innerWidth;
  const yPercentage = e.clientY / window.innerHeight;
  updateHolo(xPercentage, yPercentage);
});

// 2. 모바일 센서 이벤트 로직
async function startEngine() {
  log("센서 활성화 시도 중...");

  const handleOrientation = (e) => {
    // 안드로이드 센서값이 null로 들어오면 (HTTP 환경 등) 리턴
    if (e.gamma === null || e.beta === null) return;

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
        log("iOS 센서 권한 허용됨");
      } else {
        log("권한이 거부되었습니다.");
      }
    } catch (err) {
      log("오류 발생: HTTPS 환경이 맞는지 확인하세요.");
    }
  } else {
    // 안드로이드 및 구형 브라우저
    log("표준 센서 모드로 진입 (안드로이드는 HTTPS 필수)");
    window.addEventListener('deviceorientation', handleOrientation);
  }
}

// 화면을 클릭하면 모바일 권한 요청(시동)
document.body.addEventListener('click', () => {
  if (!initialized) startEngine();
}, { once: true });
