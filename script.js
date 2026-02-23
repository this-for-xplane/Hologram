const btn = document.getElementById('enable');

function updateHolo(gamma, beta) {
  // 1. 화면 중앙 상단(광원)과의 각도 계산
  // 기기가 기울어짐에 따라 '사용자의 눈'과 '광원' 사이의 상대 각도가 변하는 것을 시뮬레이션
  
  // 가상의 광원 위치에 따른 각도 (기울기 값을 각도로 변환)
  // 화면 중앙 상단 조명을 기준으로 하기 위해 beta(앞뒤)와 gamma(좌우)를 조합
  const angle = (gamma * 2) + (beta * 2);
  
  // 2. 테두리에 적용할 각도 업데이트 (음각 테두리가 빛을 튕겨내는 느낌)
  btn.style.setProperty('--angle', `${angle}deg`);
  
  // 3. 빛의 강도 (기울기가 심할수록 난반사가 강해짐)
  const intensity = 0.3 + (Math.abs(gamma) + Math.abs(beta)) / 90;
  btn.style.setProperty('--opacity', Math.min(intensity, 0.8));

  // 버튼 자체의 회전은 삭제 (음각 내부의 빛만 움직이도록 함)
}

async function init() {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const perm = await DeviceOrientationEvent.requestPermission();
      if (perm === 'granted') {
        window.addEventListener('deviceorientation', (e) => updateHolo(e.gamma, e.beta));
      }
    } catch (e) { console.error(e); }
  } else {
    // 안드로이드 및 일반 환경
    window.addEventListener('deviceorientation', (e) => updateHolo(e.gamma, e.beta));
    
    // 마우스 대응 (광원과의 거리에 따라 계산)
    window.addEventListener('mousemove', (e) => {
      const dx = e.clientX - window.innerWidth / 2;
      const dy = e.clientY - 0; // 화면 상단
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      btn.style.setProperty('--angle', `${angle}deg`);
    });
  }
}

btn.addEventListener('click', init, { once: true });
