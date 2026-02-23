const card = document.getElementById('holoCard');

// 1. 가상의 광원 위치 설정 (화면 정중앙 상단 뒤쪽)
const lightSource = { x: 0, y: -1, z: 2 }; 

function updateLighting(gamma, beta) {
    // 2. 기기의 기울기를 라디안으로 변환 (Normal Vector 계산용)
    const radG = (gamma * Math.PI) / 180;
    const radB = (beta * Math.PI) / 180;

    // 3. 표면 법선 벡터 (기울기에 따른 표면의 방향)
    const nx = Math.sin(radG);
    const ny = Math.sin(radB);
    const nz = Math.cos(radG) * Math.cos(radB);

    // 4. 입사광 대비 반사 각도 계산 (가상의 도트 프로덕트 응용)
    // 광원과 표면의 각도에 따라 '회절'되는 색상의 파장값을 도출
    const viewFactor = nx * lightSource.x + ny * lightSource.y + nz * lightSource.z;
    
    // 5. 파장(Wavelength) 시뮬레이션
    // 각도에 따라 0(Red) ~ 360(Violet) 사이의 색상값을 물리적으로 매핑
    const baseHue = (viewFactor + 1) * 180;
    
    // 6. 다중 조명 산란 계산 (진짜 홀로그램의 난반사 구현)
    // 하나의 띠가 아니라 각도별로 여러 파장이 겹치도록 계산
    let diffractionMap = `radial-gradient(
        circle at ${50 - gamma}% ${50 - beta}%,
        hsl(${baseHue}, 80%, 70%) 0%,
        hsl(${(baseHue + 40) % 360}, 70%, 60%) 20%,
        hsl(${(baseHue + 80) % 360}, 60%, 50%) 40%,
        transparent 70%
    ), linear-gradient(
        ${gamma + beta}deg,
        transparent,
        hsla(${(baseHue + 180) % 360}, 80%, 70%, 0.3) ${50 + gamma}%,
        transparent
    )`;

    // 7. 실시간 변수 주입
    card.style.setProperty('--diffraction-map', diffractionMap);
    
    // 실제 카드도 물리적으로 아주 미세하게 기울여 입체감 유지
    card.style.transform = `rotateY(${gamma * 0.1}deg) rotateX(${-beta * 0.1}deg)`;
}

// 센서 초기화 및 안드로이드 대응
async function init() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        const res = await DeviceOrientationEvent.requestPermission();
        if (res === 'granted') window.addEventListener('deviceorientation', e => updateLighting(e.gamma, e.beta));
    } else {
        window.addEventListener('deviceorientation', e => updateLighting(e.gamma, e.beta));
        // PC 테스트용 (마우스를 광원으로 취급)
        window.addEventListener('mousemove', e => {
            const gx = (e.clientX / window.innerWidth - 0.5) * 60;
            const gy = (e.clientY / window.innerHeight - 0.5) * 60;
            updateLighting(gx, gy);
        });
    }
}

card.addEventListener('click', init, { once: true });
