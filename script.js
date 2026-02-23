const btn = document.getElementById('holoBtn');
const guide = document.querySelector('.guide');

// 기울기 값을 배경 위치 %로 변환하는 함수
function mapRange(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function updateHolo(gamma, beta) {
  // gamma: 좌우 기울기 (-90 ~ 90)
  // beta: 앞뒤 기울기 (-180 ~ 180)

  // 감도 조절 (너무 많이 기울이지 않아도 색이 변하도록 범위 제한)
  const tiltX = Math.max(-30, Math.min(30, gamma));
  const tiltY = Math.max(-30, Math.min(30, beta));

  // 핵심: 기울기 반대 방향으로 움직이도록 좌표 계산
  // 오른쪽으로 기울이면(+gamma) -> 배경은 왼쪽으로 이동(낮은 %)
  const posX = mapRange(tiltX, -30, 30, 80, 20); // 80% -> 20% 로 역방향 매핑
  
  // 아래로 기울이면(+beta) -> 배경은 위로 이동(낮은 %)
  const posY = mapRange(tiltY, -30, 30, 80, 20);

  // CSS 변수 업데이트
  btn.style.setProperty('--pos-x', `${posX}%`);
  btn.style.setProperty('--pos-y', `${posY}%`);
}

async function initSensors() {
  // iOS 13+ 권한 요청
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission === 'granted') {
        window.addEventListener('deviceorientation', (e) => updateHolo(e.gamma, e.beta));
        guide.style.display = 'none';
      } else {
        alert("센서 권한이 필요합니다.");
      }
    } catch (e) {
      alert("권한 요청 오류발생");
    }
  } else {
    // 안드로이드 및 미지원 기기 (바로 실행)
    window.addEventListener('deviceorientation', (e) => updateHolo(e.gamma, e.beta));
    guide.style.display = 'none';

    // PC 테스트용 마우스 이벤트
    window.addEventListener('mousemove', (e) => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        // 마우스 위치를 가상의 기울기 값으로 변환
        const gamma = (e.clientX / w - 0.5) * 60; // -30 ~ 30 범위 시뮬레이션
        const beta = (e.clientY / h - 0.5) * 60;
        updateHolo(gamma, beta);
    });
  }
}

// 버튼 클릭 시 센서 활성화 (안드로이드 크롬 정책 대응)
btn.addEventListener('click', initSensors, { once: true });
