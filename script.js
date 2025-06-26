const holoText = document.getElementById('hello');

function updateHolo(x, y) {
  // x, y는 -1 ~ 1 범위
  const offsetX = 50 + x * 30;  // 무지개 배경 움직임
  const offsetY = 50 + y * 30;

  holoText.style.backgroundPosition = `${offsetX}% ${offsetY}%`;

  // 빛 위치 업데이트 (반짝임 레이어)
  holoText.style.setProperty('--light-x', `${offsetX}%`);
  holoText.style.setProperty('--light-y', `${offsetY}%`);
}

async function init() {
  if (
    typeof DeviceOrientationEvent !== 'undefined' &&
    typeof DeviceOrientationEvent.requestPermission === 'function'
  ) {
    try {
      const perm = await DeviceOrientationEvent.requestPermission();
      if (perm !== 'granted') {
        alert('센서 권한이 필요합니다!');
        return;
      }
    } catch (e) {
      alert('센서 권한 요청 중 에러가 발생했습니다.');
      return;
    }

    window.addEventListener('deviceorientation', (e) => {
      updateHolo(e.gamma / 45, -e.beta / 45); // beta는 y축 반전
    });
  } else {
    // PC나 센서 없는 환경용 마우스 이벤트
    window.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const x = (e.clientX - centerX) / centerX;
      const y = (e.clientY - centerY) / centerY;
      updateHolo(x, y);
    });
  }
}

document.getElementById('enable').addEventListener('click', init);

// PC 환경에서 버튼 없이 바로 실행
if (!('DeviceOrientationEvent' in window)) {
  init();
}
