const card = document.getElementById('holoCard');
let centerG = 0;
let centerB = 0;
let initialized = false;

function updateHolo(g, b) {
  if (!initialized) return;

  // 1. 현재 각도에서 시작(영점) 각도를 뺀 상대값
  const relG = g - centerG;
  const relB = b - centerB;

  // 2. 급격한 변화 시 다시 영점 조절 (자세 변경 대응)
  if (Math.abs(relG) > 70 || Math.abs(relB) > 70) {
    centerG = g; centerB = b;
  }

  // 3. 표면 굴곡(Bump) 시뮬레이션: 빛이 표면을 타고 일렁이게 함
  const bumpX = Math.sin(relG * 0.15) * 8;
  const bumpY = Math.cos(relB * 0.15) * 8;

  // 4. 광원 위치 계산 (기울기 반대 방향 이동)
  const px = 50 - (relG * 1.8) + bumpX;
  const py = 50 - (relB * 1.8) + bumpY;

  // 5. 파스텔톤 회절색 계산
  const hue = (relG + relB + 360) % 360;

  // 6. 비등방성 산란(원형 탈피) 그래디언트 맵 생성
  const diffractionMap = `
    linear-gradient(
      ${45 + (relG * 0.5)}deg,
      transparent 10%,
      hsla(${hue}, 40%, 80%, 0.15) 30%,
      hsla(${(hue + 40) % 360}, 45%, 75%, 0.25) 50%,
      hsla(${(hue - 40) % 360}, 40%, 80%, 0.15) 70%,
      transparent 90%
    ),
    radial-gradient(
      ellipse 60% 40% at ${px}% ${py}%,
      hsla(${(hue + 180) % 360}, 30%, 85%, 0.3) 0%,
      transparent 70%
    )
  `;

  // 7. CSS 변수로 최종 계산값 전달
  card.style.setProperty('--diffraction', diffractionMap);
  
  // 미세한 카드 기울기 효과
  card.style.transform = `rotateX(${-relB * 0.05}deg) rotateY(${relG * 0.05}deg)`;
}

async function handleStart() {
  // 모바일 센서 권한 요청 및 이벤트 등록
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const res = await DeviceOrientationEvent.requestPermission();
      if (res === 'granted') {
        window.addEventListener('deviceorientation', (e) => {
          if (!initialized) {
            centerG = e.gamma;
            centerB = e.beta;
            initialized = true;
          }
          updateHolo(e.gamma, e.beta);
        });
      }
    } catch (err) {
      console.error("센서 접근 실패:", err);
    }
  } else {
    // 안드로이드 또는 일반 브라우저
    window.addEventListener('deviceorientation', (e) => {
      if (!initialized) {
        centerG = e.gamma;
        centerB = e.beta;
        initialized = true;
      }
      updateHolo(e.gamma, e.beta);
    });

    // PC 테스트를 위한 마우스 대응
    window.addEventListener('mousemove', (e) => {
      if (!initialized) initialized = true;
      const gx = (e.clientX / window.innerWidth - 0.5) * 60;
      const gy = (e.clientY / window.innerHeight - 0.5) * 60;
      updateHolo(gx, gy);
    });
  }
}

// 버튼을 한 번 눌러야 센서가 깨어납니다
card.addEventListener('click', handleStart, { once: true });
