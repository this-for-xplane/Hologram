console.log('script.js loaded');

function updateHolo(x, y) {
  const el = document.getElementById('hello');
  // x, y는 -1 ~ 1 범위 (중앙 기준)
  // 중앙에서 마우스가 오른쪽 끝이면 x=1, 왼쪽 끝이면 x=-1
  // y도 위가 -1, 아래가 1으로 설정
  // 빛 위치는 중앙 50% 기준으로 움직임 (0~100%)
  const offsetX = 50 + x * 30; // ±30% 범위 내 이동
  const offsetY = 50 + y * 30;
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
      // gamma: 좌우 기울기 (좌우 기울기 최대 ±45도 가정)
      // beta: 앞뒤 기울기 (앞뒤 최대 ±45도 가정)
      // -1 ~ 1로 정규화해서 updateHolo에 전달
      updateHolo(e.gamma / 45, -e.beta / 45); // beta는 반전해서 Y축 맞춤
    });
  } else {
    window.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      // 마우스 위치 - 중앙 위치 → -1 ~ 1 정규화
      const x = (e.clientX - centerX) / centerX;
      const y = (e.clientY - centerY) / centerY;
      updateHolo(x, y);
    });
  }
}

document.getElementById('enable').addEventListener('click', init);

// PC 등 기울기 이벤트 없는 환경에서는 버튼 없이 바로 실행
if (!('DeviceOrientationEvent' in window)) {
  init();
}
