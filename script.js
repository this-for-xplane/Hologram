VanillaTilt.init(document.querySelectorAll(".card"), {
  max: 25,               // 최대 기울기 각도
  speed: 500,            // 반응 속도
  glare: true,           // 빛 반사 효과 켜기
  "max-glare": 0.6,      // 최대 반사 밝기
  gyroscope: true        // 모바일 기울기 센서 켜기
});
