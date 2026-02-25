const card = document.getElementById('holoCard');
const specLayer = document.querySelector('.specular-layer');
const debug = document.getElementById('debug-console');

let centerG = 0;
let centerB = 0;
let initialized = false;

function log(msg) {
  const line = document.createElement('div');
  line.textContent = `> ${msg}`;
  debug.prepend(line);
}

function updateHolo(g, b) {
  if (!initialized) return;

  // 1. 기준점 대비 상대 각도
  const relG = g - centerG;
  const relB = b - centerB;

  // 2. 항공기 표면의 미세한 굴곡(Anisotropy) 시뮬레이션
  // 기울기에 따라 빛이 직선으로 안 가고 일렁이게 함
  const bumpX = Math.sin(relG * 0.12) * 15;
  const bumpY = Math.cos(relB * 0.12) * 15;

  // 3. 광원 위치 계산 (역방향 물리 반사)
  const px = 50 - (relG * 2.0) + bumpX;
  const py = 50 - (relB * 2.0) + bumpY;

  // 4. 회절 파장(Hue) 결정 (은은한 파스텔톤)
  const hue = (relG + relB + 720) % 360;

  // 5. 비정형 조명 맵 생성 (원형을 파괴하기 위해 선형과 타원형 믹스)
  const gradLinear = `linear-gradient(${45 + relG}deg, transparent 15%, hsla(${hue}, 50%, 85%, 0.2) 50%, transparent 85%)`;
  const gradRadial = `radial-gradient(ellipse 70% 40% at ${px}% ${py}%, hsla(${(hue + 160) % 360}, 45%, 90%, 0.4) 0%, transparent 80%)`;

  // 6. 스타일에 직접 주입
  specLayer.style.backgroundImage = `${gradLinear}, ${gradRadial}`;
  specLayer.style.opacity = "1";

  // 카드 3D 기울기 효과
  card.style.transform = `perspective(1000px) rotateX(${-relB * 0.08}deg) rotateY(${relG * 0.08}deg)`;
}

async function startEngine() {
  log("센서 활성화 시도 중...");

  const onOrientation = (e) => {
    if (!initialized) {
      centerG = e.gamma || 0;
      centerB = e.beta || 0;
      initialized = true;
      log("영점 조절 완료: 작동 시작");
    }
    updateHolo(e.gamma, e.beta);
  };

  // iOS 권한 요청
  if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission === 'granted') {
        window.addEventListener('deviceorientation', onOrientation);
      } else {
        log("권한이 거부되었습니다.");
      }
    } catch (err) {
      log("오류 발생: " + err.message);
    }
  } else {
    // 안드로이드 및 일반 브라우저
    log("표준 센서 모드로 진입");
    window.addEventListener('deviceorientation', onOrientation);
    
    // PC 테스트용 마우스 시뮬레이션
    window.addEventListener('mousemove', (e) => {
      if (!initialized) initialized = true;
      const gx = (e.clientX / window.innerWidth - 0.5) * 80;
      const gy = (e.clientY / window.innerHeight - 0.5) * 80;
      updateHolo(gx, gy);
    });
  }
}

// 사용자의 첫 터치로 엔진 시동
card.addEventListener('click', startEngine, { once: true });
