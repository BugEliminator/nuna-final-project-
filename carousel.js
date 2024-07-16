const initializeCarousel = () => {
  const carousels = document.querySelectorAll('.carousel_main');

  carousels.forEach(carousel => {
    const swiper = carousel.querySelector('.carousel_wrapper');
    const prevButton = carousel.querySelector('.carousel_prev');
    const nextButton = carousel.querySelector('.carousel_next');
    const bullets = carousel.querySelectorAll('.carousel_circle');
    let currentSlide = 0;

    function showSlide(slideIndex) {
      swiper.style.transform = `translateX(-${slideIndex * 300}px)`;
      currentSlide = slideIndex;

      bullets.forEach((bullet, index) => {
        if (index === currentSlide) {
          bullet.classList.add('active');
        } else {
          bullet.classList.remove('active');
        }
      });
    }

    prevButton.addEventListener('click', () => {
      if (currentSlide > 0) {
        showSlide(currentSlide - 1);
      }
    });

    nextButton.addEventListener('click', () => {
      if (currentSlide < bullets.length - 1) {
        showSlide(currentSlide + 1);
      }
    });

    bullets.forEach((bullet, index) => {
      bullet.addEventListener('click', () => {
        showSlide(index);
      });
    });

    showSlide(0);
  });
};
