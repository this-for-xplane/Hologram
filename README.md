**Aero Hologram UI**

Aero Hologram UI는 물리적인 홀로그램 스티커의 질감과 빛 반사 효과를 웹 환경에서 정교하게 재현한 인터랙티브 디자인 프로젝트임. 단순한 그래픽 구현을 넘어 기기의 자이로스코프 센서 데이터와 실시간 연동되어 입체적인 시각 경험을 제공함.
## 주요 구현 특징
• 가속도 및 자이로스코프 연동: JavaScript의 DeviceOrientationEvent를 사용하여 모바일 기기의 기울기에 따라 홀로그램의 광원 위치와 카드 회전각을 실시간으로 계산함. iOS의 권한 요청 방식과 안드로이드의 deviceorientationabsolute 모드를 모두 대응하여 크로스 플랫폼 최적화를 진행함.
• 다층 레이어 구조 (Multi-layered Design): 금속 질감의 베이스 레이어, 미세한 격자 패턴의 서피스 텍스처, 무지개 빛의 스펙트럼 레이어, 강한 하이라이트를 위한 플래시 레이어를 겹쳐 실제 스티커와 유사한 깊이감을 형성함.
• 고급 블렌딩 기법: mix-blend-mode: exclusion과 color-dodge를 조합하여 금속 표면 위에서 빛이 굴절되고 반사되는 효과를 물리적으로 유사하게 모사함. CSS 변수(--tx, --ty)를 통해 그라데이션의 위치를 동적으로 변경하여 광택의 움직임을 구현함.
• 3D 트랜스폼: perspective와 rotateX/Y 속성을 활용해 평면적인 웹 요소를 3차원 공간에서 움직이는 듯한 입체 카드로 변환함. will-change: transform을 적용해 모바일 환경에서도 끊김 없는 60fps 성능을 유지함.
## 기술 스택 및 호환성
• 언어: HTML5, CSS3 (Variables, 3D Transforms), Vanilla JavaScript.
• 입력 방식: 모바일 자이로 센서, 터치 드래그, 마우스 무브 등 멀티 입력 지원.
• 보안: 모바일 센서 데이터 접근을 위해 HTTPS 환경에 최적화됨.

[실행 화면 보기 (Demo)](https://hologram-gold.vercel.app/)
