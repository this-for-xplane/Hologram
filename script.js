const card = document.getElementById('holoCard');
let centerGamma = 0;
let centerBeta = 0;
let isInitialized = false;

// 급격한 자세 변화 감지용 변수
let lastValidGamma = 0;
let lastValidBeta = 0;

function updateLighting(gamma, beta) {
  // 1. 동적 중앙값 기준 계산 (상대적 변화량)
  let relGamma = gamma - centerGamma;
  let relBeta = beta - centerBeta;

  // 2. 급격한 변화 감지 (예: 90도 이상 자세 변경 시 자동 리센터링)
  if (Math.abs(relGamma) > 70 || Math.abs(relBeta) > 70) {
    centerGamma = gamma;
    centerBeta = beta;
    relGamma = 0;
    relBeta = 0;
  }

  // 3. 물리적 벡터 계산 (X-Plane 방식의 상대 각도 도출)
  const x = Math.sin(relGamma * Math.PI / 180);
  const y = Math.sin(relBeta * Math.PI / 180);
  
  // 4. 회절 파장(Color Wave) 계산
  // 단순히 흰색 광원을 보여주는 게 아니라, 각도에 따라 특정 '파장'이 강조되도록 설정
  const hue = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  const dist = Math.sqrt(x * x + y * y); // 광원으로부터의 거리

  // 5. 다층 회절 맵 (Diffraction Map) 생성
  // 강렬한 하얀 원 대신, 은은한 무지개 띠가 겹치도록 렌더링
  let diffractionMap = `
    radial-gradient(
      circle at ${50 - (x * 100)}% ${50 - (y * 100)}%,
      hsl(${hue}, 90%, 75%) 0%,
      hsl(${(hue + 60) % 360}, 80%, 70%) 25%,
      hsl(${(hue + 120) % 360}, 70%, 60%) 50%,
      transparent 80%
    ),
    conic-gradient(
      from ${hue}deg at ${50 - (x * 50)}% ${50 - (y * 50)}%,
      hsla(${(hue + 180) % 360}, 100%, 70%, 0.2) 0deg,
      transparent 90deg,
      hsla(${(hue + 240) % 360}, 100%, 70%, 0.2) 180deg,
      transparent 270deg
    )
  `;

  card.style.setProperty('--diffraction-map', diffractionMap);
}

async function startHolo(e) {
  // 클릭 시점의 틸트값을 기준으로 영점 조절
  if (typeof DeviceOrientationEvent !== 'undefined') {
    // iOS 권한 요청 처리
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission !== 'granted') return;
    }

    // 첫 리스너 등록 시 현재 값을 중심으로 설정
    const initialHandler = (event) => {
      centerGamma = event.gamma;
      centerBeta = event.beta;
      window.removeEventListener('deviceorientation', initialHandler);
      
      // 실제 작동 리스너 등록
      window.addEventListener('deviceorientation', (ev) => {
        updateLighting(ev.gamma, ev.beta);
      });
    };
    window.addEventListener('deviceorientation', initialHandler);
  } else {
    // 데스크탑 시뮬레이션
    window.addEventListener('mousemove', (me) => {
      const gx = (me.clientX / window.innerWidth - 0.5) * 60;
      const gy = (me.clientY / window.innerHeight - 0.5) * 60;
      updateLighting(gx, gy);
    });
  }
}

card.addEventListener('click', startHolo, { once: true });
