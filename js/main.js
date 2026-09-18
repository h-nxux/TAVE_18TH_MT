/* =========================================================
   main.js
   SLIDES 데이터를 TEMPLATES로 화면에 그리고, 좌우 이동 버튼/키보드를 처리.
   ========================================================= */

(function () {
  const frame = document.querySelector('.slide-frame');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const counter = document.getElementById('counter');

  // slides-data.js의 SLIDES를 순서대로 실제 슬라이드 엘리먼트로 변환
  const slideEls = SLIDES.map(data => {
    const render = TEMPLATES[data.type];
    if (!render) {
      console.warn(`알 수 없는 슬라이드 타입: "${data.type}" (slides-data.js 확인 필요)`);
      return null;
    }
    return render(data);
  }).filter(Boolean);

  slideEls.forEach(el => frame.appendChild(el));

  let current = 0;

  function render() {
    slideEls.forEach((el, i) => el.classList.toggle('active', i === current));
    counter.textContent = (current + 1) + ' / ' + slideEls.length;
    prevBtn.classList.toggle('disabled', current === 0);
    nextBtn.classList.toggle('disabled', current === slideEls.length - 1);
  }

  prevBtn.addEventListener('click', () => {
    if (current > 0) { current--; render(); }
  });
  nextBtn.addEventListener('click', () => {
    if (current < slideEls.length - 1) { current++; render(); }
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'ArrowLeft') prevBtn.click();
  });

  /* -----------------------------------------------------------
     퀴즈 코너 바로가기 메뉴
     각 슬라이드 헤더에 있는 corner-jump-btn 버튼을 누르면,
     slides-data.js의 CORNERS 목록을 보여주고 클릭 시 해당 코너의
     규칙(rules) 슬라이드로 바로 이동. 아직 안 만든 코너는 "준비중".
     ----------------------------------------------------------- */

  // cornerId -> 슬라이드 인덱스 (rules 슬라이드에 cornerId가 있는 것만 등록됨)
  const cornerIndex = {};
  slideEls.forEach((el, i) => {
    if (el.dataset.corner) cornerIndex[el.dataset.corner] = i;
  });

  const cornerMenu = document.createElement('div');
  cornerMenu.className = 'corner-menu';
  cornerMenu.innerHTML = CORNERS.map((c, i) => {
    const idx = cornerIndex[c.id];
    const ready = idx !== undefined;
    return `
      <button class="corner-menu-item${ready ? '' : ' is-disabled'}" data-index="${ready ? idx : ''}" ${ready ? '' : 'disabled'}>
        <span>${i + 1}. ${c.label}</span>
        ${ready ? '' : '<span class="corner-menu-badge">준비중</span>'}
      </button>
    `;
  }).join('');
  document.body.appendChild(cornerMenu);

  function openCornerMenu(btn) {
    const r = btn.getBoundingClientRect();
    cornerMenu.style.left = r.left + 'px';
    cornerMenu.style.top = (r.bottom + 8) + 'px';
    cornerMenu.classList.add('open');
  }
  function closeCornerMenu() {
    cornerMenu.classList.remove('open');
  }

  frame.addEventListener('click', (e) => {
    const btn = e.target.closest('.corner-jump-btn');
    if (!btn) return;
    e.stopPropagation();
    if (cornerMenu.classList.contains('open')) { closeCornerMenu(); }
    else { openCornerMenu(btn); }
  });

  cornerMenu.addEventListener('click', (e) => {
    const item = e.target.closest('.corner-menu-item');
    if (!item || item.disabled) return;
    current = Number(item.dataset.index);
    render();
    closeCornerMenu();
  });

  document.addEventListener('click', (e) => {
    if (!cornerMenu.contains(e.target) && !e.target.closest('.corner-jump-btn')) {
      closeCornerMenu();
    }
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCornerMenu();
  });

  /* -----------------------------------------------------------
     버튼 메뉴 이동 (이어그리기 퀴즈처럼 슬라이드 순서와 상관없이
     "이 노란 버튼을 누르면 이 슬라이드로" 식으로 점프하는 경우)
     버튼에 data-jump-to="menuId" 를 넣어두면, 그 menuId를 dataset.menu로
     가진 슬라이드로 바로 이동함. (menu-circle-btn, menu-back-btn 등에서 사용)
     ----------------------------------------------------------- */
  const menuIndex = {};
  slideEls.forEach((el, i) => {
    if (el.dataset.menu) menuIndex[el.dataset.menu] = i;
  });

  frame.addEventListener('click', (e) => {
    const jumpBtn = e.target.closest('[data-jump-to]');
    if (!jumpBtn) return;
    const targetId = jumpBtn.dataset.jumpTo;
    if (menuIndex[targetId] === undefined) {
      console.warn(`이동할 슬라이드를 찾을 수 없음: menuId "${targetId}" (slides-data.js 확인 필요)`);
      return;
    }
    current = menuIndex[targetId];
    render();
  });

  render();
})();
