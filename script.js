const btn = document.getElementById('holoBtn');

function updateHolo(gamma, beta) {
  // 1. 센서 값 정규화 (-1 ~ 1)
  // 40도로 제한하여 살짝만 기울여도 크게 반응하도록 감도 상향
  const x = Math.max(-1, Math.min(1, gamma / 40));
  const y = Math.max(-1, Math.min(1, beta / 40));

  // 2. 조명 반사 위치 계산 (사용자 요청: 역방향 이동)
  // 기기를 오른쪽(+x)으로 기울이면 반사광은 왼쪽(-rx)으로 확 이동
  const rx = 50 - (x * 80); 
  const ry = 50 - (y * 80);

  // 3. 실시간 색상 회전 각도 계산 (핵심)
  // X, Y 기울기 비율을 삼각함수로 계산하여 광원이 비추는 '절대 각도'를 산출
  // 이 값에 의해 어떤 각도일 때 초록색이 보이고, 어떤 각도일 때 마젠타가 보일지 실시간 결정됨
  const angle = Math.atan2(y, x) * (180 / Math.PI);

  // 4. 기울기 강도 계산 (평평할 땐 색이 없고, 기울일수록 색이 진해짐)
  // 피타고라스 정리로 중심으로부터의 거리 계산
  const intensity = Math.min(1, Math.sqrt(x * x + y * y) * 1.5);

  // CSS 변수에 계산된 값 주입 (즉각적인 렌더링)
  btn.style.setProperty('--rx', `${rx}%`);
  btn.style.setProperty('--ry', `${ry}%`);
  btn.style.setProperty('--angle', `${angle}deg`);
  btn.style.setProperty('--intensity', intensity);
}

async function initSensors() {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission === 'granted') {
        window.addEventListener('deviceorientation', (e) => updateHolo(e.gamma, e.beta));
      }
    } catch (e) { console.error(e); }
  } else {
    // 안드로이드 및 데스크탑
    window.addEventListener('deviceorientation', (e) => updateHolo(e.gamma, e.beta));

    // PC 마우스 테스트 시뮬레이션
    window.addEventListener('mousemove', (e) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // 화면 중앙을 0으로 기준 잡고 -40 ~ +40 기울기 시뮬레이션
      const gamma = (e.clientX / w - 0.5) * 80; 
      const beta = (e.clientY / h - 0.5) * 80;
      updateHolo(gamma, beta);
    });
  }
}

// 상호작용 후 센서 권한/이벤트 활성화
btn.addEventListener('click', initSensors, { once: true });
