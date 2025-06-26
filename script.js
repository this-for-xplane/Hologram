function updateHolo(x, y) {
  const el = document.getElementById('hello');
  // x, y 값을 배경 위치에 적용 (퍼센트 단위, 적당한 움직임 범위)
  const offsetX = 50 + x * 20;  // x는 -1 ~ 1, 20% 좌우 이동
  const offsetY = 50 + y * 20;  // y는 -1 ~ 1, 20% 상하 이동
  el.style.backgroundPosition = `${offsetX}% ${offsetY}%`;
}

async function init() {
  if (
    typeof DeviceOrientationEvent !== 'undefined' &&
    typeof DeviceOrientationEvent.requestPermission === 'function'
  ) {
    try {
      const perm = await DeviceOrientationEvent.requestPermission();
      if (perm !== 'granted') {
        alert('허용 필요!');
        return;
      }
    } catch (e) {
      alert('에러 발생');
      return;
    }

    window.addEventListener('deviceorientation', (e) => {
      // gamma: 좌우 기울기, beta: 앞뒤 기울기, 값을 -1~1로 정규화하여 전달
      updateHolo(e.gamma / 45, e.beta / 45);
    });
  } else {
    // 모바일 기기가 아니거나 권한 요청 함수가 없으면 PC 마우스 이벤트 처리
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;  // -1 ~ 1
      const y = (e.clientY / window.innerHeight) * 2 - 1; // -1 ~ 1
      updateHolo(x, y);
    });
  }
}

document.getElementById('enable').addEventListener('click', init);

// PC 등 기울기 이벤트가 없을 때 버튼 없이 바로 실행되도록 (선택사항)
if (!('DeviceOrientationEvent' in window)) {
  init();
}
