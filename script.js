const btn = document.getElementById('enable');

function updateHolo(gamma, beta) {
  // 센서값 정규화 (-1 ~ 1)
  const x = Math.max(-1, Math.min(1, gamma / 45));
  const y = Math.max(-1, Math.min(1, beta / 45));

  // 빛의 위치 (중심에서 얼마나 이동할지)
  const posX = 50 + (x * 70); // 70으로 높여서 더 역동적으로 이동
  const posY = 50 + (y * 70);

  // 기울기에 따른 색상 변화 (0~360도)
  const hue = ((x + y + 2) / 4) * 360;
  
  // 기울기가 클수록 빛을 더 진하게 (강도 조절)
  const opacity = 0.5 + (Math.abs(x) + Math.abs(y)) * 0.25;

  btn.style.setProperty('--x', `${posX}%`);
  btn.style.setProperty('--y', `${posY}%`);
  btn.style.setProperty('--h', hue);
  btn.style.setProperty('--o', opacity);

  // 버튼의 3D 회전 (광택과 각도를 맞춤)
  btn.style.transform = `rotateX(${-y * 20}deg) rotateY(${x * 20}deg)`;
}

async function startHolo() {
  // iOS 13+ 권한 요청 처리
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const result = await DeviceOrientationEvent.requestPermission();
      if (result === 'granted') {
        window.addEventListener('deviceorientation', (e) => updateHolo(e.gamma, e.beta));
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    // 안드로이드/크롬 환경 (HTTPS 필수)
    window.addEventListener('deviceorientation', (e) => updateHolo(e.gamma, e.beta));
    
    // PC 데스크탑 테스트용 마우스 이벤트
    window.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const my = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      updateHolo(mx * 30, my * 30);
    });
  }
}

// 사용자 클릭 시 센서와 효과 시작
btn.addEventListener('click', startHolo, { once: true });
