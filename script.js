function updateHolo(x, y) {
  const el = document.getElementById('hello');
  // x, y 값을 배경 위치에 적용
  const offsetX = 50 + x * 2;
  const offsetY = 50 + y * 2;
  el.style.backgroundPosition = `${offsetX}% ${offsetY}%`;
}

async function init() {
  if (
    typeof DeviceOrientationEvent !== 'undefined' &&
    typeof DeviceOrientationEvent.requestPermission === 'function'
  ) {
    try {
      const perm = await DeviceOrientationEvent.requestPermission();
      if (perm !== 'granted') return alert('허용 필요!');
    } catch (e) {
      return alert('에러 발생');
    }
  }

  window.addEventListener('deviceorientation', (e) => {
    updateHolo(e.gamma || 0, e.beta || 0);
  });
}

document.getElementById('enable').addEventListener('click', init);
