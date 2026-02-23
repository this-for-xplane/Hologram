const card = document.getElementById('holoCard');
const specLayer = card.querySelector('.specular-layer');

let centerG = 0;
let centerB = 0;
let initialized = false;

function updateHolo(g, b) {
  if (!initialized) return;

  const relG = g - centerG;
  const relB = b - centerB;

  // 자동 리센터링 (자세가 너무 바뀌면 갱신)
  if (Math.abs(relG) > 60 || Math.abs(relB) > 60) {
    centerG = g; centerB = b;
  }

  // 1. 항공기 표면의 울퉁불퉁함을 시뮬레이션하기 위한 노이즈 값
  // Sine 함수를 중첩해 불규칙한 빛의 굴곡을 만듦
  const noiseX = Math.sin(relG * 0.1) * 5 + Math.cos(relB * 0.05) * 5;
  const noiseY = Math.cos(relG * 0.05) * 5 + Math.sin(relB * 0.1) * 5;

  // 2. 빛의 중심 좌표 계산 (기울기 반대 방향)
  const px = 50 - (relG * 1.5) + noiseX;
  const py = 50 - (relB * 1.5) + noiseY;

  // 3. 색상 계산 (연하고 자연스러운 파스텔톤)
  const baseHue = (relG + relB + 360) % 360;

  // 4. 원형이 아닌 "선형 산란(Anisotropic)"과 "불규칙한 맵" 생성
  // 여러 방향의 linear-gradient를 겹쳐 원 모양을 파괴함
  const map = `
    linear-gradient(
      ${45 + relG}deg,
      transparent 0%,
      hsla(${baseHue}, 60%, 80%, 0.2) 20%,
      hsla(${(baseHue + 40)%360}, 50%, 75%, 0.3) 50%,
      transparent 80%
    ),
    radial-gradient(
      ellipse at ${px}% ${py}%,
      hsla(${(baseHue + 180)%360}, 40%, 80%, 0.25) 0%,
      transparent 60%
    ),
    linear-gradient(
      ${-45 + relB}deg,
      transparent 30%,
      hsla(${(baseHue + 90)%360}, 50%, 80%, 0.15) 50%,
      transparent 70%
    )
  `;

  card.style.setProperty('--diffraction', map);
  
  // 미세한 3D 기울기
  card.style.transform = `rotateX(${-relB * 0.1}deg) rotateY(${relG * 0.1}deg)`;
}

async function init() {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    const res = await DeviceOrientationEvent.requestPermission();
    if (res === 'granted') {
      window.addEventListener('deviceorientation', e => {
        if(!initialized) { centerG = e.gamma; centerB = e.beta; initialized = true; }
        updateHolo(e.gamma, e.beta);
      });
    }
  } else {
    // 안드로이드 / 데스크탑
    window.addEventListener('deviceorientation', e => {
      if(!initialized) { centerG = e.gamma; centerB = e.beta; initialized = true; }
      updateHolo(e.gamma, e.beta);
    });
    // 마우스 테스트 시
    window.addEventListener('mousemove', e => {
      if(!initialized) initialized = true;
      const gx = (e.clientX / window.innerWidth - 0.5) * 60;
      const gy = (e.clientY / window.innerHeight - 0.5) * 60;
      updateHolo(gx, gy);
    });
  }
}

card.addEventListener('click', init, { once: true });
