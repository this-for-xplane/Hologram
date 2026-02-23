const btn = document.getElementById('enable');
let rafId = null;

function updateHolo(gamma, beta) {
  // 센서 데이터 정규화 (-1 ~ 1)
  const x = Math.max(-1, Math.min(1, gamma / 45));
  const y = Math.max(-1, Math.min(1, beta / 45));

  // CSS 변수 업데이트
  // 중심점 50% 기준 이동
  const posX = 50 + (x * 50);
  const posY = 50 + (y * 50);
  // 기울기에 따른 색상 각도 (0 ~ 360)
  const hue = ((x + y + 2) / 4) * 360;

  btn.style.setProperty('--x', `${posX}%`);
  btn.style.setProperty('--y', `${posY}%`);
  btn.style.setProperty('--h', hue);
  
  // 버튼 자체도 살짝 기울어지게 (3D 입체감)
  btn.style.transform = `perspective(500px) rotateX(${-y * 15}deg) rotateY(${x * 15}deg)`;
}

async function init() {
  // iOS 권한 요청
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    const permission = await DeviceOrientationEvent.requestPermission();
    if (permission === 'granted') {
      window.addEventListener('deviceorientation', (e) => updateHolo(e.gamma, e.beta));
    }
  } else {
    // 안드로이드/데스크탑
    window.addEventListener('deviceorientation', (e) => updateHolo(e.gamma, e.beta));
    
    // 마우스 지원
    window.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width * 2 - 1;
      const my = (e.clientY - rect.top) / rect.height * 2 - 1;
      updateHolo(mx * 45, my * 45);
    });
  }
  btn.textContent = "HI MINJUN"; // 텍스트 변경
}

btn.addEventListener('click', init, { once: true });
