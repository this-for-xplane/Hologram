const btn = document.getElementById('enable');

function updateHolo(gamma, beta) {
  // -1 ~ 1 범위로 정규화
  const x = Math.max(-1, Math.min(1, gamma / 45));
  const y = Math.max(-1, Math.min(1, beta / 45));

  // 빛의 중심점 (스티커 내부 위치)
  const posX = 50 + (x * 50);
  const posY = 50 + (y * 50);

  // 난반사 각도 계산 (기울기에 따라 무지개 띠가 회전)
  const hueAngle = (gamma + beta) * 2;

  btn.style.setProperty('--x', `${posX}%`);
  btn.style.setProperty('--y', `${posY}%`);
  btn.style.setProperty('--h', hueAngle);

  // 버튼 회전은 아주 미세하게 (2도 정도만)
  btn.style.transform = `perspective(500px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
}

async function init() {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission === 'granted') {
        window.addEventListener('deviceorientation', (e) => updateHolo(e.gamma, e.beta));
      }
    } catch (err) { console.error(err); }
  } else {
    // 안드로이드 및 일반 환경
    window.addEventListener('deviceorientation', (e) => updateHolo(e.gamma, e.beta));
    
    // 마우스 대응
    window.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width * 2 - 1;
      const my = (e.clientY - rect.top) / rect.height * 2 - 1;
      updateHolo(mx * 30, my * 30);
    });
  }
}

btn.addEventListener('click', init, { once: true });
