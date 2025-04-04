const API_KEY = '62fc00364bd146588740';
const serviceId = 'COOKRCP01';
const dataType = 'json';

let recipeList = [];
let product = [];
const colors = [
  '#EE3F4A', // 파스텔 빨강
  '#F2718B', // 파스텔 핑크
  '#7FB562', // 파스텔 초록
  '#22A9E1', // 파스텔 파랑
  '#F79552', // 파스텔 오렌지
  '#BBB8DD', // 파스텔 보라
  '#FECC4F', // 파스텔 노랑
  '#D4E25B', // 파스텔 연두
  '#AEDFDC', // 파스텔 청록
  '#49B9BA', // 파스텔 민트
];

const $c = document.querySelector('canvas');
const ctx = $c.getContext('2d');

document.getElementById('btn-banchan').addEventListener('click', event => {
  event.preventDefault();
  loadRecipes('반찬');
});
document.getElementById('btn-dessert').addEventListener('click', event => {
  event.preventDefault();
  loadRecipes('후식');
});
document.getElementById('btn-main').addEventListener('click', event => {
  event.preventDefault();
  loadRecipes('일품');
});
document.getElementById('btn-soup').addEventListener('click', event => {
  event.preventDefault();
  loadRecipes('국&찌개');
});

async function loadRecipes(category) {
  const startIdx = 1;
  const endIdx = 1000;
  const url = new URL(
    `https://openapi.foodsafetykorea.go.kr/api/${API_KEY}/${serviceId}/${dataType}/${startIdx}/${endIdx}`
  );

  try {
    const response = await fetch(url);
    const data = await response.json();
    recipeList = data.COOKRCP01.row.filter(
      recipe => recipe.RCP_PAT2 === category
    );
    const selectedRecipes = getRandomRecipes(recipeList, 10);
    setFoodCategory(selectedRecipes);
    showRoulette(); // 돌림판과 관련된 요소를 보이게 함
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function showRoulette() {
  document.querySelector('.roulette').classList.add('show');
  document.querySelector('.roulette .triangle').classList.remove('hidden');
  document.querySelector('.roulette .pointer').classList.remove('hidden');
  document.querySelector('.roulette .start').classList.remove('hidden');
}

function getRandomRecipes(recipes, num) {
  const shuffled = recipes.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

function setFoodCategory(recipes) {
  product = recipes.map(recipe => recipe.RCP_NM);
  newMake();
}

function splitText(text, maxLength) {
  if (text.length <= maxLength) return [text];
  const parts = [];
  for (let i = 0; i < text.length; i += maxLength) {
    parts.push(text.substring(i, i + maxLength));
  }
  return parts;
}

function newMake() {
  ctx.clearRect(0, 0, $c.width, $c.height);

  if (product.length === 0) return;

  const isMobile = window.innerWidth <= 767;
  const canvasSize = isMobile ? 300 : 650;
  $c.width = canvasSize;
  $c.height = canvasSize;

  const [cw, ch] = [$c.width / 2, $c.height / 2];
  const arcCount = isMobile ? 6 : product.length; // 모바일에서는 6칸으로 조정
  const arc = Math.PI / (arcCount / 2);

  for (let i = 0; i < arcCount; i++) {
    ctx.beginPath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.moveTo(cw, ch);
    ctx.arc(cw, ch, cw, arc * i, arc * (i + 1));
    ctx.fill();
    ctx.closePath();
  }

  ctx.fillStyle = 'white';
  ctx.font = isMobile ? '14px Pretendard' : '18px Pretendard';
  ctx.textAlign = 'center';

  for (let i = 0; i < arcCount; i++) {
    const angle = arc * i + arc / 2;

    ctx.save();
    ctx.translate(
      cw + Math.cos(angle) * (cw - 60),
      ch + Math.sin(angle) * (ch - 60)
    );
    ctx.rotate(angle + Math.PI / 2);

    const textParts = splitText(product[i], isMobile ? 8 : 10);
    textParts.forEach((part, index) => {
      ctx.fillText(part, 0, index * (isMobile ? 15 : 20));
    });

    ctx.restore();
  }
}

function rotate() {
  if (product.length === 0) return;
  $c.style.transform = 'initial';
  $c.style.transition = 'initial';

  const isMobile = window.innerWidth <= 767;
  const arcCount = isMobile ? 6 : product.length;

  setTimeout(() => {
    const ran = Math.floor(Math.random() * arcCount);
    const arc = 360 / arcCount;
    const rotate = ran * arc + 3600 + arc * 3 - arc / 4;

    $c.style.transform = `rotate(-${rotate}deg)`;
    $c.style.transition = '2s';

    setTimeout(() => {
      alert(
        `오늘의 식사는?! ${product[ran]} 어떠신가요? 아래에서 레시피를 확인해보세요.`
      );
      showRecipe(recipeList[ran]); // 당첨된 레시피 정보 표시
    }, 2000);
  }, 1);
}

function showRecipe(recipe) {
  // 이미지 URL 배열로 변환 (기본값 빈 배열)
  const images = [];
  for (let i = 1; i <= 20; i++) {
    const imgUrl = recipe[`MANUAL_IMG${String(i).padStart(2, '0')}`];
    if (imgUrl) images.push(imgUrl);
  }

  // 만드는 방법을 줄바꿈으로 나누기 (기본값 빈 배열)
  const manuals = [];
  for (let i = 1; i <= 20; i++) {
    const manualText = recipe[`MANUAL${String(i).padStart(2, '0')}`];
    if (manualText) manuals.push(manualText);
  }

  const recipeHTML = `
      <div class="recipeBox">
          <h2><strong>${recipe.RCP_NM || '정보 없음'}</strong></h2>
          <img src="${recipe.ATT_FILE_NO_MAIN}" alt="Recipe Image"/>
          <p>재료: ${recipe.RCP_PARTS_DTLS || '정보 없음'}</p>
          <p>만드는 방법</p>

              ${manuals.map(manual => `<div>${manual}</div>`).join('')}

          <p>카테고리: ${recipe.RCP_PAT2 || '정보 없음'}</p>
          <p>열량: ${recipe.INFO_ENG || '정보 없음'}kcal</p>
          <p>탄수화물: ${recipe.INFO_CAR || '정보 없음'}g</p>
          <p>단백질: ${recipe.INFO_PRO || '정보 없음'}g</p>
          <p>지방: ${recipe.INFO_FAT || '정보 없음'}g</p>
          <p>나트륨: ${recipe.INFO_NA || '정보 없음'}g</p>

      </div>
  `;

  document.getElementById('recipe-board').innerHTML = recipeHTML;
}

window.addEventListener('resize', newMake);
