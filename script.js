const holoText = document.getElementById('hello');

let latestX = 0;
let latestY = 0;
let ticking = false;

function updateHoloRaf() {
  const offsetX = 50 + latestX * 30;
  const offsetY = 50 + latestY * 30;

  holoText.style.backgroundPosition = `${offsetX}% ${offsetY}%`;
  holoText.style.setProperty('--light-x', `${offsetX}%`);
  holoText.style.setProperty('--light-y', `${offsetY}%`);

  ticking = false;
}

function scheduleUpdate(x, y) {
  latestX = x;
  latestY = y;
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(updateHoloRaf);
  }
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
      scheduleUpdate(e.gamma / 45, -e.beta / 45);
    });
  } else {
    window.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const x = (e.clientX - centerX) / centerX;
      const y = (e.clientY - centerY) / centerY;
      scheduleUpdate(x, y);
    });
  }
}

document.getElementById('enable').addEventListener('click', init);

if (!('DeviceOrientationEvent' in window)) {
  init();
}
