/* =========================================================
   templates.js
   슬라이드 "타입"별로 데이터를 실제 화면(HTML)로 바꿔주는 부분.
   여기는 내용 수정이 아니라 "디자인/구조"를 바꿀 때만 손대면 됨.
   페이지 순서나 문구를 바꾸고 싶다면 js/slides-data.js 를 수정할 것.
   ========================================================= */

// 원 숫자로 변환: 1 -> ①, 2 -> ② ...
function circledNumber(n) {
  return String.fromCodePoint(0x2460 + (n - 1));
}

// 좌상단 "TAVE MT 로고 + 게임 이름 뱃지" 헤더. rules / quiz-photo / quiz-answer가 공통으로 씀.
// 뱃지 옆의 정사각형 아이콘 버튼을 누르면(코너 바로가기) js/main.js가 만든
// 전체 코너 목록 메뉴가 열리고, 다른 게임의 규칙 페이지로 바로 이동할 수 있음.
function renderHeader(data) {
  return `
    <div class="rules-header">
      <div class="mini-logo grad-outline">${data.logoText || 'TAVE MT'}</div>
      <div class="badge-bubble" style="--badge-color:${data.badgeColor || '#16247d'}">${data.gameName}</div>
      <button class="corner-jump-btn" type="button" aria-label="퀴즈 코너 바로가기">
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="2"/>
          <rect x="14" y="3" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="2"/>
          <rect x="3" y="14" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="2"/>
          <rect x="14" y="14" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
    </div>
  `;
}

// "규칙 안내" 슬라이드의 하단 예시 섹션.
// example.type: 'media' 재생 버튼형(노래 퀴즈), 'tiles' 글자 타일형(네글자 퀴즈),
// 그 외(기본값) 원형 정답형(인물 퀴즈 등).
function renderExample(example) {
  if (!example) return '';

  if (example.type === 'tiles') {
    return `
      <div class="example-row example-row--tiles">
        ${(example.items || []).map(item => `<div class="panel-gold notch-tr answer-tile">${item}</div>`).join('')}
      </div>
    `;
  }

  if (example.type === 'media') {
    const audioTag = example.audio
      ? `<audio class="media-audio" src="${example.audio}" preload="none"></audio>`
      : '';
    return `
      <div class="example-row example-row--media">
        <div class="panel-gold notch-br tag-gold">${example.label || '연습'}</div>
        <div class="media-connector"></div>
        <div class="panel-gold notch-tr media-box">
          ${audioTag}
          <button class="play-btn" type="button" aria-label="재생/일시정지">
            <svg class="icon-play" viewBox="0 0 24 24"><polygon points="7,4 20,12 7,20" fill="#161608"/></svg>
            <svg class="icon-pause" viewBox="0 0 24 24"><rect x="5" y="4" width="5" height="16" fill="#161608"/><rect x="14" y="4" width="5" height="16" fill="#161608"/></svg>
          </button>
        </div>
      </div>
    `;
  }

  return `
    <div class="example-row">
      <div class="panel notch-br example-tag">${example.label || '예시'}</div>
      <svg class="example-connector" viewBox="0 0 100 60" preserveAspectRatio="none">
        <polyline points="0,30 55,30 100,4" fill="none" stroke="#e0b45c" stroke-width="4"/>
      </svg>
      <div class="answer-circles">
        ${(example.items || []).map(item => `<div class="answer-circle">${item}</div>`).join('')}
      </div>
    </div>
  `;
}

// 규칙 안내 박스 오른쪽 위에 "이번 라운드 1등/2등 점수"를 표시.
function renderPoints(points) {
  if (!points) return '';
  return `
    <div class="rules-points">
      <span>이번 라운드 1등: <b>${points.first}점</b></span>
      <span>2등: <b>${points.second}점</b></span>
    </div>
  `;
}

// media-box(재생 버튼)를 실제로 누르면 오디오가 재생/일시정지 되도록 연결.
function wireMediaExample(el) {
  const mediaBox = el.querySelector('.media-box');
  if (!mediaBox) return;
  const audio = mediaBox.querySelector('.media-audio');
  const btn = mediaBox.querySelector('.play-btn');
  mediaBox.addEventListener('click', () => {
    if (!audio) return; // 아직 연결된 mp3가 없으면 아이콘만 있고 동작은 안 함
    if (audio.paused) { audio.play(); btn.classList.add('is-playing'); }
    else { audio.pause(); btn.classList.remove('is-playing'); }
  });
  if (audio) {
    audio.addEventListener('ended', () => btn.classList.remove('is-playing'));
  }
}

// 노래 퀴즈 클립 버튼(1초/3초/5초)을 누르면 재생/일시정지, 하나 재생 시 나머지는 자동으로 멈춤.
function wireSongClips(el) {
  const buttons = Array.from(el.querySelectorAll('.song-clip-btn'));
  buttons.forEach(btn => {
    const audio = btn.querySelector('.song-clip-audio');
    btn.addEventListener('click', () => {
      const wasPlaying = !audio.paused;
      buttons.forEach(other => {
        const otherAudio = other.querySelector('.song-clip-audio');
        otherAudio.pause();
        other.classList.remove('is-playing');
      });
      if (!wasPlaying) { audio.currentTime = 0; audio.play(); btn.classList.add('is-playing'); }
    });
    audio.addEventListener('ended', () => btn.classList.remove('is-playing'));
  });
}

// 뒤로가기 버튼 (메뉴/정답 페이지 오른쪽 위). data-jump-to를 js/main.js가 읽어서 해당 menuId로 이동시킴.
function renderBackButton(targetId) {
  if (!targetId) return '';
  return `
    <button class="menu-back-btn" type="button" data-jump-to="${targetId}">
      <svg viewBox="0 0 24 24" fill="none"><path d="M15 5 L8 12 L15 19" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>뒤로</span>
    </button>
  `;
}

// 표지/엔딩 슬라이드가 공통으로 쓰는 상단 장식 바(쉐브론 + 트라페조이드 + 점 + 선).
function renderSpaceTopBar() {
  return `
    <div class="top-bar">
      <div class="chevrons left">
        <svg viewBox="0 0 12 20"><polygon points="12,0 3,10 12,20 9,20 0,10 9,0" fill="#ffd977"/></svg>
        <svg viewBox="0 0 12 20"><polygon points="12,0 3,10 12,20 9,20 0,10 9,0" fill="#ffd977"/></svg>
        <svg viewBox="0 0 12 20"><polygon points="12,0 3,10 12,20 9,20 0,10 9,0" fill="#ffd977"/></svg>
      </div>
      <div class="top-trapezoid"></div>
      <svg class="top-line left" viewBox="0 0 100 2" preserveAspectRatio="none"><line x1="0" y1="1" x2="100" y2="1" stroke="#d9ae55" stroke-width="1.4"/></svg>
      <svg class="top-line right" viewBox="0 0 100 2" preserveAspectRatio="none"><line x1="0" y1="1" x2="100" y2="1" stroke="#d9ae55" stroke-width="1.4"/></svg>
      <div class="top-dots"><span></span><span></span><span></span></div>
      <div class="chevrons right">
        <svg viewBox="0 0 12 20"><polygon points="0,0 9,10 0,20 3,20 12,10 3,0" fill="#ffd977"/></svg>
        <svg viewBox="0 0 12 20"><polygon points="0,0 9,10 0,20 3,20 12,10 3,0" fill="#ffd977"/></svg>
        <svg viewBox="0 0 12 20"><polygon points="0,0 9,10 0,20 3,20 12,10 3,0" fill="#ffd977"/></svg>
      </div>
    </div>
  `;
}

// 표지/엔딩 슬라이드가 공통으로 쓰는 유성 아이콘.
function renderShootStar() {
  return `
    <svg class="shoot-star" viewBox="0 0 300 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="starTrail" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f6d67a" stop-opacity="0"/>
          <stop offset="100%" stop-color="#ffe9a8" stop-opacity="1"/>
        </linearGradient>
      </defs>
      <line x1="0" y1="95" x2="260" y2="15" stroke="url(#starTrail)" stroke-width="4"/>
      <g transform="translate(268,10)">
        <path d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z" fill="#ffe9a8"/>
      </g>
    </svg>
  `;
}

// 표지/엔딩 슬라이드가 공통으로 쓰는 하단 대각선 점선.
function renderBottomStripe() {
  return `
    <div class="bottom-stripe">
      <svg viewBox="0 0 1600 40" preserveAspectRatio="none">
        <g stroke="#e0b45c" stroke-width="6">
          ${Array.from({ length: 33 }, (_, i) => {
            const x = -20 + i * 50;
            return `<line x1="${x}" y1="40" x2="${x + 30}" y2="0"/>`;
          }).join('')}
        </g>
      </svg>
    </div>
  `;
}

const TEMPLATES = {

  /* ---------------- 표지형 슬라이드 (표지, 팀명 정하기, 채점 중 등 재사용) ---------------- */
  title(data) {
    const el = document.createElement('div');
    el.className = 'slide';
    if (data.cornerId) el.dataset.corner = data.cornerId; // 상단 바로가기 메뉴가 이 값으로 찾아옴
    el.innerHTML = `
      <div class="s1-deco">
        ${renderSpaceTopBar()}
        ${renderShootStar()}

        <div class="s1-title"><span class="grad-outline">${data.subtitle}</span></div>
        <div class="s1-main"><span class="grad-outline">${data.title}</span></div>

        ${renderBottomStripe()}
      </div>
    `;
    return el;
  },

  /* ---------------- 엔딩 슬라이드 ---------------- */
  ending(data) {
    const el = document.createElement('div');
    el.className = 'slide';
    if (data.cornerId) el.dataset.corner = data.cornerId; // 상단 바로가기 메뉴가 이 값으로 찾아옴
    el.innerHTML = `
      <div class="s1-deco">
        ${renderSpaceTopBar()}
        ${renderShootStar()}

        <div class="s1-title"><span class="grad-outline">${data.subtitle}</span></div>
        <div class="s1-main"><span class="grad-outline">${data.title}</span></div>
        <div class="panel notch-both ending-credit">${data.credit}</div>

        ${renderBottomStripe()}
      </div>
    `;
    return el;
  },

  /* ---------------- 게임 규칙 안내 슬라이드 (재사용) ---------------- */
  rules(data) {
    const el = document.createElement('div');
    el.className = 'slide';
    if (data.cornerId) el.dataset.corner = data.cornerId; // 상단 바로가기 메뉴가 이 값으로 찾아옴

    const rulesHtml = (data.rules || [])
      .map((rule, i) => `<li><span class="num">${circledNumber(i + 1)}</span><span>${rule}</span></li>`)
      .join('');

    el.innerHTML = `
      ${renderHeader(data)}

      <div class="panel notch-tl rules-panel">
        ${renderPoints(data.points)}
        <div class="rules-title">${data.rulesTitle || '규칙 안내'}</div>
        <ul class="rules-list">${rulesHtml}</ul>
      </div>

      ${renderExample(data.example)}
    `;

    wireMediaExample(el);
    return el;
  },

  /* ---------------- 사진 슬라이드 (인물 퀴즈 / 안숨은그림찾기 등에서 재사용) ---------------- */
  'quiz-photo'(data) {
    const el = document.createElement('div');
    el.className = 'slide';
    // label을 직접 주면 그걸 그대로 쓰고("연습" 등), 없으면 번호를 "01." 형식으로 자동 생성
    const numberLabel = data.label || (String(data.number).padStart(2, '0') + '.');
    el.innerHTML = `
      ${renderHeader(data)}
      <div class="panel notch-tl quiz-panel">
        <div class="quiz-number">${numberLabel}</div>
        <div class="quiz-photo-wrap">
          <img class="quiz-photo" src="${data.image}" alt="사진 ${numberLabel}">
        </div>
      </div>
    `;
    return el;
  },

  /* ---------------- 노래 퀴즈: 문제(클립 재생) 슬라이드 (재사용) ---------------- */
  'song-quiz'(data) {
    const el = document.createElement('div');
    el.className = 'slide';
    const clips = data.clips || {};
    const clipDefs = [
      { key: '1s', label: '1초' },
      { key: '3s', label: '3초' },
      { key: '5s', label: '5초' },
      { key: '10s', label: '정답', isAnswer: true }, // 하이라이트(정답 공개)용 버튼
    ];
    const clipsHtml = clipDefs
      .filter(c => clips[c.key])
      .map(c => `
        <button class="song-clip-btn${c.isAnswer ? ' song-clip-btn--answer' : ''}" type="button" aria-label="${c.label} 재생">
          <audio class="song-clip-audio" src="${clips[c.key]}" preload="none"></audio>
          ${c.isAnswer ? `
            <svg class="song-clip-icon" viewBox="0 0 24 24"><path d="M12 2 L14.7 9 L22 9.5 L16.3 14.2 L18.2 21.5 L12 17.3 L5.8 21.5 L7.7 14.2 L2 9.5 L9.3 9 Z" fill="#161608"/></svg>
          ` : `
            <svg class="song-clip-icon" viewBox="0 0 24 24">
              <path d="M4 9v6h4l5 4V5L8 9H4z" fill="#161608"/>
              <path d="M16.2 8.2a5.2 5.2 0 010 7.6" stroke="#161608" stroke-width="2" fill="none" stroke-linecap="round"/>
              <path d="M19 5.5a9.2 9.2 0 010 13" stroke="#161608" stroke-width="2" fill="none" stroke-linecap="round"/>
            </svg>
          `}
          <span class="song-clip-label">${c.label}</span>
        </button>
      `)
      .join('');

    el.innerHTML = `
      ${renderHeader(data)}
      <div class="panel notch-tl quiz-panel">
        <div class="quiz-number">${String(data.number).padStart(2, '0')}.</div>
        <div class="song-clip-row">${clipsHtml}</div>
      </div>
    `;

    wireSongClips(el);
    return el;
  },

  /* ---------------- 인물 퀴즈: 정답 슬라이드 (재사용) ---------------- */
  'quiz-answer'(data) {
    const el = document.createElement('div');
    el.className = 'slide';
    el.innerHTML = `
      ${renderHeader(data)}
      <div class="panel notch-tl quiz-panel">
        <div class="quiz-number">${String(data.number).padStart(2, '0')}.</div>
        <div class="quiz-answer-text">${data.answer}</div>
      </div>
    `;
    return el;
  },

  /* ---------------- 버튼 메뉴 슬라이드 (이어그리기 퀴즈 등, 하위 메뉴로 이동하는 노란 원 버튼들) ---------------- */
  'button-menu'(data) {
    const el = document.createElement('div');
    el.className = 'slide';
    if (data.menuId) el.dataset.menu = data.menuId;

    const buttonsHtml = (data.buttons || [])
      .map(b => `<button class="menu-circle-btn" type="button" data-jump-to="${b.targetId}"><span>${b.label}</span></button>`)
      .join('');

    el.innerHTML = `
      ${renderHeader(data)}
      <div class="panel notch-tl quiz-panel">
        ${renderBackButton(data.backTargetId)}
        ${data.label ? `<div class="quiz-number">${data.label}</div>` : ''}
        <div class="menu-circle-row">${buttonsHtml}</div>
      </div>
    `;
    return el;
  },

  /* ---------------- 정답 보이기/감추기 슬라이드 (이어그리기 퀴즈 등) ---------------- */
  'reveal-answer'(data) {
    const el = document.createElement('div');
    el.className = 'slide';
    if (data.menuId) el.dataset.menu = data.menuId;

    el.innerHTML = `
      ${renderHeader(data)}
      <div class="panel notch-tl quiz-panel">
        ${renderBackButton(data.backTargetId)}
        ${data.label ? `<div class="quiz-number">${data.label}</div>` : ''}
        <div class="reveal-wrap">
          <div class="quiz-answer-text reveal-text">${data.answer}</div>
        </div>
        <button class="reveal-toggle-btn panel-gold notch-tr" type="button">
          <span class="reveal-label-show">문제 보이기</span>
          <span class="reveal-label-hide">문제 감추기</span>
        </button>
      </div>
    `;

    const wrap = el.querySelector('.reveal-wrap');
    const toggleBtn = el.querySelector('.reveal-toggle-btn');
    toggleBtn.addEventListener('click', () => wrap.classList.toggle('is-revealed'));

    return el;
  },

};
