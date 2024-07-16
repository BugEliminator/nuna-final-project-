 // 캔버스 요소 선택 및 2D 렌더링 컨텍스트 가져오기
const $c = document.querySelector("canvas");
const ctx = $c.getContext(`2d`);

// 음식 항목과 색상 배열
const product = [
  "떡볶이", '돈가스', "초밥", "피자", "냉면", "치킨", '족발', "피자", "삼겹살",
];

const colors = ["#dc0936", "#e6471d", "#f7a416", "#efe61f ", "#60b236", "#209b6c", "#169ed8", "#3f297e", "#87207b", "#be107f", "#e7167b"];

// 회전판 생성 함수
const newMake = () => {
    // 캔버스 중심 좌표 계산
    const [cw, ch] = [$c.width / 2, $c.height / 2];
    // 각 섹션의 각도 계산
    const arc = Math.PI / (product.length / 2);
  
    // 각 섹션 그리기
    for (let i = 0; i < product.length; i++) {
      ctx.beginPath();
      // 섹션의 색상 설정
      ctx.fillStyle = colors[i % (colors.length - 1)];
      ctx.moveTo(cw, ch);
      // 호(arc) 그리기
      ctx.arc(cw, ch, cw, arc * (i - 1), arc * i);
      ctx.fill();
      ctx.closePath();
    }

    // 텍스트 스타일 설정
    ctx.fillStyle = "#fff";
    ctx.font = "18px Pretendard";
    ctx.textAlign = "center";

    // 각 섹션의 중앙에 텍스트 배치
    for (let i = 0; i < product.length; i++) {
      // 섹션의 중앙 각도 계산
      const angle = (arc * i) + (arc / 2);

      ctx.save();

      // 텍스트 위치 설정
      ctx.translate(
        cw + Math.cos(angle) * (cw - 50),
        ch + Math.sin(angle) * (ch - 50),
      );

      // 텍스트 회전
      ctx.rotate(angle + Math.PI / 2);

      // 텍스트 그리기
      product[i].split(" ").forEach((text, j) => {
        ctx.fillText(text, 0, 30 * j);
      });

      ctx.restore();
    }
}

// 회전 함수
const rotate = () => {
  // 초기 스타일 재설정
  $c.style.transform = `initial`;
  $c.style.transition = `initial`;
  
  setTimeout(() => {
    // 무작위로 선택된 항목의 인덱스 구하기
    const ran = Math.floor(Math.random() * product.length);

    // 각도 및 회전량 계산
    const arc = 360 / product.length;
    const rotate = (ran * arc) + 3600 + (arc * 3) - (arc / 4);
    
    // 회전 적용
    $c.style.transform = `rotate(-${rotate}deg)`;
    $c.style.transition = `2s`;
    
    // 회전 완료 후 알림 표시
    setTimeout(() => alert(`오늘의 야식은?! ${product[ran]} 어떠신가요?`), 2000);
  }, 1);
};

// 회전판 생성 함수 호출
newMake();

