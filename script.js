// year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// simple carousel
const root = document.querySelector("[data-carousel]");
if(root){
  const track = root.querySelector(".carousel__track");
  const slides = Array.from(root.querySelectorAll(".carousel__slide"));
  const prev = root.querySelector("[data-prev]");
  const next = root.querySelector("[data-next]");
  const dotsWrap = root.querySelector(".carousel__dots");
  let i = 0;

  // dots
  slides.forEach((_, idx) => {
    const b = document.createElement("button");
    b.className = "dotbtn" + (idx === 0 ? " is-active" : "");
    b.type = "button";
    b.addEventListener("click", () => go(idx));
    dotsWrap.appendChild(b);
  });

  const dots = Array.from(dotsWrap.querySelectorAll(".dotbtn"));

  function go(idx){
    i = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(${-i * 100}%)`;
    dots.forEach((d, k) => d.classList.toggle("is-active", k === i));
  }

  prev?.addEventListener("click", () => go(i - 1));
  next?.addEventListener("click", () => go(i + 1));
}

document.querySelectorAll("[data-stack]").forEach((stack) => {
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) stack.classList.add("is-inview");
      else stack.classList.remove("is-inview"); // 다시 겹치게 하고 싶지 않으면 이 줄 지워
    },
    {
      threshold: 0.35,          // 35% 보이면 발동
      rootMargin: "0px 0px -10% 0px" // 살짝 늦게/자연스럽게
    }
  );
  io.observe(stack);
});

// Concept popups: reveal one by one on scroll
(() => {
  const stage = document.querySelector("[data-concept]");
  if (!stage) return;

  const pops = Array.from(stage.querySelectorAll("[data-pop]"));

  // 닫기 버튼(선택)
  pops.forEach((pop) => {
    pop.querySelector(".conceptPop__close")?.addEventListener("click", () => {
      pop.classList.remove("is-visible");
    });
  });

  // 스테이지가 화면에 들어오면 순차로 등장
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;

      // 순서대로 하나씩 보여주기
      pops.forEach((pop, i) => {
        setTimeout(() => pop.classList.add("is-visible"), i * 260);
      });

      // 한 번만 실행하고 끝
      io.disconnect();
    },
    { threshold: 0.35 }
  );

  io.observe(stage);
})();

// Process carousel with thumbnails
(() => {
  const root = document.querySelector("[data-process-carousel]");
  if (!root) return;

  const track = root.querySelector(".processCarousel__track");
  const slides = Array.from(root.querySelectorAll(".processCarousel__slide"));
  const prev = root.querySelector("[data-prev]");
  const next = root.querySelector("[data-next]");
  const thumbsWrap = root.querySelector("[data-thumbs]");

  let i = 0;

  // build thumbs
  slides.forEach((slide, idx) => {
    const img = slide.querySelector("img");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "processThumb" + (idx === 0 ? " is-active" : "");
    btn.setAttribute("aria-label", `Go to slide ${idx + 1}`);

    const tImg = document.createElement("img");
    tImg.src = img?.getAttribute("src") || "";
    tImg.alt = img?.getAttribute("alt") || `Thumbnail ${idx + 1}`;

    btn.appendChild(tImg);
    btn.addEventListener("click", () => go(idx));
    thumbsWrap.appendChild(btn);
  });

  const thumbs = Array.from(thumbsWrap.querySelectorAll(".processThumb"));

  function go(idx){
    i = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(${-i * 100}%)`;
    thumbs.forEach((t, k) => t.classList.toggle("is-active", k === i));
  }

  prev?.addEventListener("click", () => go(i - 1));
  next?.addEventListener("click", () => go(i + 1));

  // keyboard support
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") go(i - 1);
    if (e.key === "ArrowRight") go(i + 1);
  });

  // initial
  go(0);
})();
