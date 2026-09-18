/* =========================================================
   slides-data.js
   ★★★ 페이지 순서/내용을 바꾸려면 이 파일만 수정하면 됩니다 ★★★

   - SLIDES 배열의 순서 = 실제 발표에서 보여지는 슬라이드 순서.
   - 순서를 바꾸고 싶으면 아래 { ... } 덩어리(객체)들의 순서를 잘라서 옮기면 됨.
   - 새 게임 규칙 페이지를 추가하고 싶으면, 아래 "게임 규칙 안내 예시"
     객체를 통째로 복사해서 붙여넣고 내용만 바꾸면 됨 (콤마(,) 잊지 말기).
   - 규칙이 필요 없는 항목은 그냥 줄을 지우면 됨.
   ========================================================= */

// 전체 퀴즈 "코너" 목록 (상단 바로가기 메뉴에 이 순서 그대로 나옴).
// - id: 아래 각 게임의 rules 슬라이드에 있는 cornerId와 짝을 맞추는 값 (마음대로 바꾸지 말 것)
// - label: 메뉴에 보여지는 이름
// 아직 안 만든 코너도 미리 여기 적어두면 메뉴에 "준비중"으로 흐리게 보이고,
// 나중에 그 게임의 rules 슬라이드를 만들면서 같은 id를 cornerId로 넣어주면 자동으로 활성화됨.
const CORNERS = [
  { id: 'person-quiz', label: '인물퀴즈' },
  { id: 'song-quiz', label: '1초 노래 퀴즈' },
  { id: 'four-letter-quiz', label: '네글자 퀴즈' },
  { id: 'overlap-object-quiz', label: '안숨은그림찾기' },
  { id: 'draw-quiz', label: '이어그리기 퀴즈' },
];

// 인물 퀴즈 "사진 페이지 + 정답 페이지" 한 세트를 만들어주는 함수.
// 번호, 사진 경로, 정답만 넣으면 두 장이 자동으로 생성됨.
function personQuizSet(number, imagePath, answer) {
  return [
    { type: 'quiz-photo', number, gameName: '인물 퀴즈', badgeColor: '#16247d', image: imagePath },
    { type: 'quiz-answer', number, gameName: '인물 퀴즈', badgeColor: '#16247d', answer },
  ];
}

// 노래 퀴즈 "문제(1초/3초/5초 재생 버튼) 페이지 + 정답 페이지" 한 세트를 만들어주는 함수.
// 번호와 정답("가수 - 제목")만 넣으면 두 장이 자동으로 생성되고,
// mp3 경로는 image/1초노래퀴즈/clip_숫자_길이.mp3 형식으로 알아서 맞춰짐.
function songQuizSet(number, answer) {
  const n = String(number).padStart(2, '0');
  const base = `image/1초노래퀴즈/clip_${n}_`;
  return [
    {
      type: 'song-quiz',
      number,
      gameName: '1초 노래 퀴즈',
      badgeColor: '#16247d',
      clips: { '1s': `${base}1s.mp3`, '3s': `${base}3s.mp3`, '5s': `${base}5s.mp3` },
    },
    { type: 'quiz-answer', number, gameName: '1초 노래 퀴즈', badgeColor: '#16247d', answer },
  ];
}

// 안숨은그림찾기 "문제 사진 + 정답 사진" 한 세트를 만들어주는 함수.
// 1번은 연습 문제라서 화면에 "연습"으로 표시되고, 2번부터는 1, 3번부터는 2 ... 이런 식으로
// 실제 문제 번호가 하나씩 당겨져서 표시됨 (파일 이름의 번호는 그대로 두면 됨).
// questionImage/answerImage에는 image/안숨은그림찾기/ 안의 실제 파일 경로를 그대로 적으면 됨.
function hiddenPictureSet(n, questionImage, answerImage) {
  const label = n === 1 ? '연습' : String(n - 1).padStart(2, '0') + '.';
  return [
    { type: 'quiz-photo', label, gameName: '안숨은그림찾기', badgeColor: '#16247d', image: questionImage },
    { type: 'quiz-photo', label, gameName: '안숨은그림찾기', badgeColor: '#16247d', image: answerImage },
  ];
}

// 이어그리기 퀴즈: 한 카테고리(영화 A / 영화 B / 속담 A / 속담 B) 안의
// "문제 1 / 문제 2 / 문제 3 / 예비 문제" 4개 버튼 메뉴 + 각 문제의 정답(보이기/감추기) 페이지를 만들어주는 함수.
// - categoryId: 이 카테고리의 고유 id (버튼끼리 서로 찾아가는 값, 마음대로 지어도 되지만 다른 것과 겹치면 안 됨)
// - categoryLabel: 카테고리 이름표 (문제 페이지 왼쪽 위에 작게 표시됨)
// - backTargetId: 뒤로가기를 눌렀을 때 돌아갈 상위 메뉴의 id
// - answers: ['문제1 정답', '문제2 정답', '문제3 정답', '예비문제 정답'] 순서로 4개
function drawCategorySet(categoryId, categoryLabel, backTargetId, answers) {
  const labels = ['문제 1', '문제 2', '문제 3', '예비 문제'];
  const menu = {
    type: 'button-menu',
    menuId: categoryId,
    label: categoryLabel,
    backTargetId,
    gameName: '이어그리기 퀴즈',
    badgeColor: '#16247d',
    buttons: labels.map((label, i) => ({ label, targetId: `${categoryId}-${i}` })),
  };
  const answerSlides = labels.map((label, i) => ({
    type: 'reveal-answer',
    menuId: `${categoryId}-${i}`,
    label,
    backTargetId: categoryId,
    gameName: '이어그리기 퀴즈',
    badgeColor: '#16247d',
    answer: answers[i],
  }));
  return [menu, ...answerSlides];
}

const SLIDES = [

  // ---------------- 1. 표지 슬라이드 ----------------
  {
    type: 'title',
    subtitle: '어서오세요 18기에',
    title: 'TAVE MT',
  },

  // ---------------- 2. 게임 규칙 안내 예시 (인물 퀴즈) ----------------
  // 이 아래 객체를 복사 & 붙여넣기 해서 게임마다 규칙 페이지를 계속 추가하면 됩니다.
  {
    type: 'rules',
    cornerId: 'person-quiz',     // 상단 바로가기 메뉴와 연결되는 id (CORNERS 목록과 맞춰야 함)
    gameName: '인물 퀴즈',       // 흰색 말풍선에 들어가는 게임 이름
    badgeColor: '#16247d',       // 게임 이름 글자 색 (원하면 게임마다 다르게 지정 가능)
    rulesTitle: '규칙 안내',
    rules: [
      '다양한 종류의 인물 사진(이목구비, 과거 사진, 웃긴 짤, 그냥 사진 등)이 제시됩니다.',
      '제시된 인물의 정답을 아는 사람은 팀 구호를 크게 외칩니다.',
      '호명 후 3초 안에 정답을 외치지 못하면 다른 팀에게로 기회가 넘어갑니다.',
    ],
    example: {
      label: '예시',
      items: ['정', '우', '진'],   // 원 안에 들어갈 글자 (자유롭게 늘리거나 줄일 수 있음)
    },
  },

  // ---------------- 3. 인물 퀴즈: 사진 -> 정답 세트 ----------------
  // personQuizSet(번호, 사진 경로, 정답) 한 줄이 [사진 슬라이드, 정답 슬라이드] 2장으로 펼쳐짐.
  // 사람을 추가하고 싶으면 이 줄을 복사해서 번호/경로/정답만 바꾸면 됨.
  ...personQuizSet(1, 'image/인물퀴즈/01_아이유.jpg', '아이유'),
  ...personQuizSet(2, 'image/인물퀴즈/02_스윙스.jpeg', '스윙스'),
  ...personQuizSet(3, 'image/인물퀴즈/03_조세호.jpeg', '조세호'),
  ...personQuizSet(4, 'image/인물퀴즈/04_미나미.jpeg', '미나미'),
  ...personQuizSet(5, 'image/인물퀴즈/05_레오나르도디카프리오.jpeg', '레오나르도 디카프리오'),
  ...personQuizSet(6, 'image/인물퀴즈/06_김연아.jpeg', '김연아'),
  ...personQuizSet(7, 'image/인물퀴즈/07_톰홀랜드.jpeg', '톰 홀랜드'),
  ...personQuizSet(8, 'image/인물퀴즈/08_정형돈.png', '정형돈'),
  ...personQuizSet(9, 'image/인물퀴즈/09_구교환.jpeg', '구교환'),
  ...personQuizSet(10, 'image/인물퀴즈/10_일론머스크.jpeg', '일론 머스크'),
  ...personQuizSet(11, 'image/인물퀴즈/11_조승우.jpeg', '조승우'),
  ...personQuizSet(12, 'image/인물퀴즈/12_공유.jpeg', '공유'),
  ...personQuizSet(13, 'image/인물퀴즈/13_김혜수.jpeg', '김혜수'),
  ...personQuizSet(14, 'image/인물퀴즈/14_하치와레.jpg', '하치와레'),
  ...personQuizSet(15, 'image/인물퀴즈/15_류현진.jpeg', '류현진'),
  ...personQuizSet(16, 'image/인물퀴즈/16_휴닝카이.jpg', '휴닝카이'),
  ...personQuizSet(17, 'image/인물퀴즈/17_타일러.jpeg', '타일러'),
  ...personQuizSet(18, 'image/인물퀴즈/18_손흥민.jpeg', '손흥민'),
  ...personQuizSet(19, 'image/인물퀴즈/19_정일영.jpeg', '정일영'),
  ...personQuizSet(20, 'image/인물퀴즈/20_이재용.jpeg', '이재용'),
  ...personQuizSet(21, 'image/인물퀴즈/21_장원영.png', '장원영'),

  // ---------------- 4. 게임 규칙 안내 (1초 노래 퀴즈) ----------------
  // example.type: 'media' 로 지정하면 원형 정답 대신 재생 버튼 박스가 나옴.
  // example.audio 에 mp3 경로를 넣으면 그 박스를 눌렀을 때 바로 재생/일시정지 됨.
  // (mp3 폴더/경로 알려주면 audio 값만 채워서 연결할 예정)
  {
    type: 'rules',
    cornerId: 'song-quiz',        // 상단 바로가기 메뉴와 연결되는 id (CORNERS 목록과 맞춰야 함)
    gameName: '1초 노래 퀴즈',
    badgeColor: '#16247d',
    rulesTitle: '규칙 안내',
    rules: [
      '유명(?)곡의 첫 1초가 제시됩니다.',
      '제시된 노래의 정답을 아는 사람은 팀 구호를 크게 외칩니다. 지명되면 가수와 제목을 외칩니다. 가수와 제목을 맞힌 뒤 진행자가 "춤!"이라고 외치면 5초동안 춤을 춰야 합니다.',
      '호명 후 3초 안에 정답을 외치지 못하면 다른 팀에게로 기회가 넘어갑니다.',
    ],
    example: {
      type: 'media',
      label: '연습',
      audio: '', // 예) 'audio/노래퀴즈/00_연습.mp3'
    },
  },

  // ---------------- 5. 노래 퀴즈: 문제 -> 정답 세트 ----------------
  // songQuizSet(번호, '가수 - 제목') 한 줄이 [문제 슬라이드, 정답 슬라이드] 2장으로 펼쳐짐.
  ...songQuizSet(1, '아일릿 - 마그네틱'),
  ...songQuizSet(2, '에스파 - NEXT LEVEL'),
  ...songQuizSet(3, '다나카&닛몰캐쉬 - 잘 자요 아가씨'),
  ...songQuizSet(4, '에이티즈 - BAD'),
  ...songQuizSet(5, '빅뱅 - Fantastic Baby'),
  ...songQuizSet(6, '코르티스 - RED RED'),
  ...songQuizSet(7, '아이브 - I AM'),
  ...songQuizSet(8, '키키 - 404 (New era)'),
  ...songQuizSet(9, '르세라핌 - 스파게티'),
  ...songQuizSet(10, '투어스 - 첫 만남은 너무 어려워'),
  ...songQuizSet(11, '뉴진스 - 하입보이'),
  ...songQuizSet(12, '라이즈 - get a guitar'),

  // ---------------- 6. 게임 규칙 안내 (네글자 퀴즈) ----------------
  // example.type: 'tiles' 로 지정하면 원형 정답 대신 네모 타일이 나옴.
  // items에 아는 글자는 그대로, 아직 안 정한 글자는 '?'로 적으면 됨.
  {
    type: 'rules',
    cornerId: 'four-letter-quiz',
    gameName: '네글자 퀴즈',
    badgeColor: '#16247d',
    rulesTitle: '규칙 안내',
    rules: [
      '팀별로 나와 일자로 출제자와 마주보는 위치에 착석합니다.',
      '출제자가 리듬에 맞추어 네글자 중 두글자를 말하면 곧바로 대답해야 합니다. (절거나 리듬보다 느려지면 실패로 간주)',
      '한 바퀴를 돌아오는 동안 가장 많이 맞힌 팀이 이깁니다.',
    ],
    example: {
      type: 'tiles',
      items: ['와', '이', '?', '?'],
    },
  },

  // ---------------- 7. 게임 규칙 안내 (안숨은그림찾기) ----------------
  // 이 게임은 하단 예시 박스가 따로 없어서 example을 안 넣었음.
  {
    type: 'rules',
    cornerId: 'overlap-object-quiz',
    gameName: '안숨은그림찾기',
    badgeColor: '#16247d',
    rulesTitle: '규칙 안내',
    rules: [
      '5개의 사물이 겹쳐진 사진이 제시됩니다.',
      '겹쳐진 사물 모두를 찾은 사람은 팀 구호를 크게 외칩니다. 지명되면 5개의 사물 이름을 모두 연달아 외칩니다.',
      '호명 후 3초 안에 정답을 외치지 못하면 다른 팀에게로 기회가 넘어갑니다. (주워먹기 가능)',
    ],
  },

  // ---------------- 8. 안숨은그림찾기: 문제 -> 정답 세트 ----------------
  // hiddenPictureSet(번호, 문제 사진 경로, 정답 사진 경로) 한 줄이 2장으로 펼쳐짐.
  // 1번은 화면에 "연습"으로 표시되고, 2번부터는 01. 부터 시작.
  ...hiddenPictureSet(1, 'image/안숨은그림찾기/1.png', 'image/안숨은그림찾기/1_1.png'),
  ...hiddenPictureSet(2, 'image/안숨은그림찾기/2.png', 'image/안숨은그림찾기/2_1.png'),
  ...hiddenPictureSet(3, 'image/안숨은그림찾기/3.png', 'image/안숨은그림찾기/3_1.png'),
  ...hiddenPictureSet(4, 'image/안숨은그림찾기/4.png', 'image/안숨은그림찾기/4_1.png'),
  ...hiddenPictureSet(5, 'image/안숨은그림찾기/5.png', 'image/안숨은그림찾기/5_1.png'),
  ...hiddenPictureSet(6, 'image/안숨은그림찾기/6.png', 'image/안숨은그림찾기/6_1.png'),
  ...hiddenPictureSet(7, 'image/안숨은그림찾기/7.png', 'image/안숨은그림찾기/7_1.png'),
  ...hiddenPictureSet(8, 'image/안숨은그림찾기/8.png', 'image/안숨은그림찾기/8_1.png'),
  ...hiddenPictureSet(9, 'image/안숨은그림찾기/9.png', 'image/안숨은그림찾기/9_1.png'),
  ...hiddenPictureSet(10, 'image/안숨은그림찾기/10.png', 'image/안숨은그림찾기/10_1.png'),

  // ---------------- 9. 게임 규칙 안내 (이어그리기 퀴즈) ----------------
  // 내용은 아직 안 정해서 비워둠. 나중에 rules 배열에 문장을 채우면 됨 (다른 규칙 페이지와 동일한 형식).
  {
    type: 'rules',
    cornerId: 'draw-quiz',
    gameName: '이어그리기 퀴즈',
    badgeColor: '#16247d',
    rulesTitle: '규칙 안내',
    rules: [],
  },

  // ---------------- 10. 이어그리기 퀴즈: 메인 메뉴 (영화 A / 영화 B / 속담 A / 속담 B) ----------------
  {
    type: 'button-menu',
    menuId: 'draw-main',
    gameName: '이어그리기 퀴즈',
    badgeColor: '#16247d',
    buttons: [
      { label: '영화 A', targetId: 'draw-movieA' },
      { label: '영화 B', targetId: 'draw-movieB' },
      { label: '속담 A', targetId: 'draw-proverbA' },
      { label: '속담 B', targetId: 'draw-proverbB' },
    ],
  },

  // ---------------- 11. 이어그리기 퀴즈: 카테고리별 문제/정답 ----------------
  // drawCategorySet(카테고리 id, 카테고리 이름, 돌아갈 메뉴 id, [문제1, 문제2, 문제3, 예비문제])
  // 한 줄이 [문제 메뉴 슬라이드, 정답 슬라이드 4장] 총 5장으로 펼쳐짐.
  ...drawCategorySet('draw-movieA', '영화 A', 'draw-main', ['기생충', '아바타', '암살', '어벤져스']),
  ...drawCategorySet('draw-movieB', '영화 B', 'draw-main', ['왕과 사는 남자', '스파이더맨', '파묘', '명량']),
  ...drawCategorySet('draw-proverbA', '속담 A', 'draw-main', [
    '등잔 밑이 어둡다',
    '말 한마디에 천냥 빚도 갚는다.',
    '세 살 버릇 여든까지 간다.',
    '마른 하늘에 날벼락',
  ]),
  ...drawCategorySet('draw-proverbB', '속담 B', 'draw-main', [
    '공든 탑이 무너지랴',
    '콩 심은 데 콩 나고 팥 심은 데 팥 난다.',
    '지렁이도 밟으면 꿈틀한다.',
    '가는 말이 고와야 오는 말이 곱다.',
  ]),

];
