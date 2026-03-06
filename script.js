const root = document.documentElement;
const card = document.getElementById('holoCard');
let initialized = false;

function updateHolo(e) {
  if (!initialized) {
    initialized = true;
    root.style.setProperty('--op', '1');
  }

  // 마우스 위치 (0 ~ 1 사이 값)
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  // 카드 회전 각도 (더 부드럽게)
  const rx = (y - 0.5) * -40;
  const ry = (x - 0.5) * 40;

  // 홀로그램 배경 이동 (무지개색이 휙휙 바뀌게 200% 범위 활용)
  const tx = x * 100;
  const ty = y * 100;

  root.style.setProperty('--rx', `${rx}deg`);
  root.style.setProperty('--ry', `${ry}deg`);
  root.style.setProperty('--tx', `${tx}%`);
  root.style.setProperty('--ty', `${ty}%`);
}

// PC 마우스 이동
window.addEventListener('mousemove', updateHolo);

// 모바일 터치 드래그 (실시간)
window.addEventListener('touchmove', (e) => {
  updateHolo(e.touches[0]);
}, { passive: true });

// iOS/Android 센서 시동은 이전과 동일하게 유지하되, 
// '클릭' 시에만 활성화 되도록 함
card.addEventListener('click', async () => {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    const permission = await DeviceOrientationEvent.requestPermission();
    if (permission === 'granted') {
      window.addEventListener('deviceorientation', (e) => {
        const xPerc = Math.min(Math.max((e.gamma + 45) / 90, 0), 1);
        const yPerc = Math.min(Math.max((e.beta - 20) / 90, 0), 1);
        updateHolo({ clientX: xPerc * window.innerWidth, clientY: yPerc * window.innerHeight });
      });
    }
  }
});
