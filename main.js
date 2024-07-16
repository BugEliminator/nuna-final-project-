const API_KEY = '62fc00364bd146588740';
const serviceId = 'COOKRCP01';
const dataType = 'json';
let startIdx = 1;
let endIdx = 100;
let url = new URL(
  `https://openapi.foodsafetykorea.go.kr/api/${API_KEY}/${serviceId}/${dataType}/${startIdx}/${endIdx}`
);

let recipeList = [];

async function getData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('data', data);
    recipeList = data.COOKRCP01.row; // 레시피 리스트 저장
    console.log('recipeList', recipeList);
    render();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const render = () => {
  let recipeHTML = recipeList.map((recipe, index) => {
    // 메뉴얼을 배열로 변환하고 빈 메뉴얼을 제거합니다
    let manuals = Object.keys(recipe)
      .filter(key => key.startsWith("MANUAL") && !key.includes("IMG")) // "MANUAL"로 시작하지만 "IMG"를 포함하지 않는 키 선택
      .sort((a, b) => {
        // 숫자 순서에 따라 정렬
        const numA = parseInt(a.replace('MANUAL', ''));
        const numB = parseInt(b.replace('MANUAL', ''));
        return numA - numB;
      })
      .map(key => recipe[key])
      .filter(manual => manual.trim() !== ""); // 빈 메뉴얼 제거

    // 정규표현식을 사용하여 앞의 번호와 끝의 알파벳 문자를 제거하는 함수
    const cleanManual = (manual) => manual
      .replace(/^\d+\.\s*/, '') // 앞의 번호와 점 제거
      .replace(/[a-zA-Z]$/, ''); // 끝의 알파벳 문자 제거

    // 클린된 메뉴얼 리스트 생성
    let cleanedManuals = manuals.map(cleanManual);
    console.log(manuals)
    // 이미지 URL을 가져옵니다 (빈 URL 제거)
    const images = [
      recipe.MANUAL_IMG01,
      recipe.MANUAL_IMG02,
      recipe.MANUAL_IMG03,
      recipe.MANUAL_IMG04,
      recipe.MANUAL_IMG05,
      recipe.MANUAL_IMG06,
      recipe.MANUAL_IMG07,
      recipe.MANUAL_IMG08,
      recipe.MANUAL_IMG09,
      recipe.MANUAL_IMG10,
      recipe.MANUAL_IMG11,
      recipe.MANUAL_IMG12,
      recipe.MANUAL_IMG13,
      recipe.MANUAL_IMG14,
      recipe.MANUAL_IMG15,
      recipe.MANUAL_IMG16,
      recipe.MANUAL_IMG17,
      recipe.MANUAL_IMG18,
      recipe.MANUAL_IMG19,
      recipe.MANUAL_IMG20
    ].filter(img => img.trim() !== ""); // 빈 이미지 URL 제거

    return `
      <div class="recipeBox">
        <h2>${index}. 요리 이름: ${recipe.RCP_NM}</h2> <!-- 레시피 이름 -->
        <div class="carousel_main">
          <div class="carousel_wrapper">
            ${images.map(img => `<div class="carousel_slide"><img src="${img}" alt="레시피 이미지"></div>`).join('')}
          </div>
          <div class="carousel_button_container">
            <button type="button" class="carousel_prev">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chevron-double-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                <path fill-rule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
              </svg>
            </button>
            <button type="button" class="carousel_next">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chevron-double-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"/>
                <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>
          <div class="carousel_pagination">
            ${images.map((_, index) => `<div class="carousel_circle"></div>`).join('')}
          </div>
        </div>
        <p>재료: ${recipe.RCP_PARTS_DTLS}</p> <!-- 레시피 재료 -->
        <p>만드는 방법</p>
        <ol>
          ${cleanedManuals.map(manual => `<li>${manual}</li>`).join('')} <!-- 레시피 설명 -->
        </ol>
        <p>열량: ${recipe.INFO_ENG}kcal</p>         
        <p>탄수화물: ${recipe.INFO_CAR}g</p>
        <p>단백질: ${recipe.INFO_PRO}g</p>
        <p>지방: ${recipe.INFO_FAT}g</p> 
        <p>나트륨: ${recipe.INFO_NA}g</p> 
        <p>카테고리: ${recipe.RCP_PAT2}</p>             
      </div>
    `;
  }).join(''); // .join('')을 추가하여 배열을 하나의 문자열로 병합
  document.getElementById('recipe-board').innerHTML = recipeHTML;
  initializeCarousel(); // 캐러셀 초기화 함수 호출
};

getData();
