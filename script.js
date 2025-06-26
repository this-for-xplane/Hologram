async function initTilt() {
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
      alert('권한 요청 실패');
      return;
    }
  }

  VanillaTilt.init(document.querySelectorAll('.holo-card'), {
    max: 25,
    speed: 500,
    glare: true,
    'max-glare': 0.7,
    gyroscope: true,
    gyroscopeMinAngleX: -45,
    gyroscopeMaxAngleX: 45,
    gyroscopeMinAngleY: -45,
    gyroscopeMaxAngleY: 45,
  });
}

document.querySelector('#enable').addEventListener('click', initTilt);
