# Handoff: 드론협회 커뮤니티 사이트 (KDDA)

## Overview
한국드론앤데이터협회(KDDA)를 위한 회원 커뮤니티 사이트 프로토타입. 게시판 중심의 회원 커뮤니티로, 게시글 열람/작성, 카테고리 필터, 로그인/회원가입 플로우를 포함합니다.

## About the Design Files
이 번들에 포함된 `Drone Community.dc.html`은 **HTML로 만든 디자인 참고 자료(프로토타입)**이며, 그대로 복사해 쓸 프로덕션 코드가 아닙니다. 이 문서와 파일을 참고해 **React + Vite + TypeScript** 프로젝트 구조에서, 프로젝트가 이미 쓰고 있는 패턴(라우팅, 상태관리, 스타일링 방식 등)에 맞춰 동일한 화면을 재구현해주세요. 아직 정해진 패턴이 없다면 표준적인 React Router + 컴포넌트 기반 구조를 추천합니다.

## Fidelity
**High-fidelity.** 색상, 타이포그래피, 간격, 인터랙션이 최종 디자인 의도를 반영합니다. 코드베이스의 기존 컴포넌트/스타일링 도구(styled-components, CSS Modules, Tailwind 등 프로젝트가 채택한 방식)로 픽셀 단위까지 동일하게 재현해주세요.

## Screens / Views
파일 하나에 4개의 화면이 상태(view)로 전환되는 방식(SPA)으로 구현되어 있습니다. React에서는 각각 별도 라우트/페이지 컴포넌트로 분리하는 것을 권장합니다.

### 1. 메인 게시판 (Feed)
- **Purpose**: 카테고리별 게시글 목록 열람, 협회 통계/행사 확인.
- **Layout**: 상단 고정 헤더(68px) → 히어로 배너 → 3단 그리드 본문(`220px 1fr 260px`, gap 24px, max-width 1180px, 중앙 정렬).
  - 좌측: 카테고리 리스트 + 협회 소개 카드
  - 중앙: 게시글 카드 리스트 (flex column, gap 12px)
  - 우측: 다가오는 행사 카드, 회원 등급 안내 카드(다크 배경)
- **Header** (모든 화면 공통, sticky top:0):
  - 배경색: `#07C7B9` (사용자가 편집기에서 직접 변경한 헤더 배경 — 원래는 네이비 `#0f2136`이었음)
  - 좌측: 로고 마크(원형, navy `#16324f` 배경에 흰 십자 + 4개 모서리 점으로 프로펠러 모터 표현) + "KDDA / 한국드론앤데이터협회" 2줄 텍스트(흰색, 15px, 800) + "KOREA DRONE ASSOCIATION" 서브텍스트(10px, `#7fa8cc`)
  - nav 링크: 게시판(활성 시 흰색), 협회소개, 행사일정, 자료실 — 13.5px, 600, `#c8d8e8`, `white-space:nowrap`
  - 우측: 검색창(170px, 배경 `#16324f`, border `#244a6e`) + 로그인 상태에 따라 "글쓰기" 버튼/아바타 또는 "로그인"/"회원가입" 버튼
- **히어로 배너**: `linear-gradient(120deg, #07EADF, #173657)` (사용자 편집), padding 36px/32px. 좌측 타이틀 텍스트(26px/800, 흰색) + 서브텍스트(14px, `#DAE3EC` — 사용자 편집), 우측 통계 3개(회원수/게시글/예정행사, 각 22px/800 숫자 + 11px 라벨 `#7fa8cc`)
- **게시글 카드**: 흰 배경, border `#e2e6eb`, radius 12px, padding 16px, hover 시 border `#3d7ab5`. 좌측 112×80px 썸네일(줄무늬 placeholder + "DRONE PHOTO" 모노스페이스 텍스트), 우측 카테고리 배지(공지 배지는 앰버 `#fdf1de`/`#a8681c`, 일반 카테고리는 스카이 `#eaf2fa`/`#245a8a`) + 제목(15px/700, 말줄임) + 요약(13px, 회색, 말줄임) + 메타 정보(작성자·날짜·댓글·추천, 12px `#9aa4b1`, 모두 nowrap)

### 2. 게시글 상세 (Post Detail)
- **Purpose**: 게시글 전문, 댓글 열람/작성.
- **Layout**: max-width 860px 중앙 정렬. "← 목록으로" 링크 → 본문 카드(카테고리 배지, 제목 24px/800, 작성자 아바타+메타, 1600×900 이미지 placeholder, 본문 텍스트 14.5px/line-height 1.9) → 추천/스크랩 버튼 → 댓글 카드(작성자 아바타 26px 원형 + 이름/날짜 + 본문, 댓글 입력창+등록 버튼)

### 3. 글쓰기 (Write)
- **Purpose**: 신규 게시글 작성.
- **Layout**: max-width 760px. 카테고리 select → 제목 input → 이미지 업로드 dropzone(점선 border, 120px 높이) → 내용 textarea(220px) → 취소/등록하기 버튼(우측 정렬)
- 제출 시 새 글이 목록 최상단에 추가되고 피드로 이동.

### 4. 로그인/회원가입 (Login/Signup)
- **Purpose**: 인증.
- **Layout**: 380px 카드, 중앙 정렬(화면 전체 flex center). 로고 + 탭(로그인/회원가입, 활성 탭은 파란 밑줄 `#3d7ab5`) → 회원가입 시에만 이름 필드 노출 → 이메일/비밀번호 필드 → 제출 버튼(라벨은 탭에 따라 "로그인"/"가입하기") → "게시판으로 돌아가기" 링크

## Interactions & Behavior
- 헤더 로고/게시판 클릭 → 피드로 이동
- 카테고리 클릭 → 해당 카테고리로 필터링 (전체/공지사항/자유게시판/기체정보/비행후기/Q&A)
- 게시글 카드 클릭 → 상세 화면으로 이동, 해당 게시글 데이터 표시
- "글쓰기" 클릭: 로그인 상태 아니면 로그인 화면으로 리다이렉트, 로그인 상태면 글쓰기 화면으로 이동
- 로그인/회원가입 제출 → `loggedIn = true`로 전환, 피드로 이동, 헤더가 "글쓰기" 버튼 + 아바타로 변경
- 아바타 클릭 → 로그아웃, 피드로 이동
- 카드 hover 시 border 색상 전환(0.15s)
- 클릭 가능한 요소는 전부 `cursor:pointer`

## State Management
React로 재구현 시 아래 상태가 필요합니다:
- `view`: 'feed' | 'post' | 'write' | 'login' (React Router 사용 시 라우트로 대체 가능)
- `loggedIn`: boolean
- `activeCategory`: string (필터)
- `selectedPostId`: 상세로 이동한 게시글 id
- `posts`: 게시글 배열 (더미 데이터 7개 포함, 파일 내 `INITIAL_POSTS` 참고)
- `authTab`: 'login' | 'signup'
- 글쓰기 폼 상태: `formCategory`, `formTitle`, `formBody`
- 인증 폼 상태: `authName`, `authEmail`, `authPassword`
- 실제 서비스에서는 posts/댓글/인증을 API 연동으로 대체 필요 (현재는 전부 더미 데이터, 네트워크 호출 없음)

## Design Tokens

### Colors
- Header background (사용자 편집): `#07C7B9`
- Hero gradient (사용자 편집): `linear-gradient(120deg, #07EADF, #173657)`
- Hero subtext (사용자 편집): `#DAE3EC`
- Navy (base brand): `#0f2136` / `#16324f` / `#173657` / `#244a6e`
- Sky blue accent: `#3d7ab5` (버튼/링크/포인트)
- Sky blue tint (카테고리 배지): 배경 `#eaf2fa`, 텍스트 `#245a8a`
- Amber (공지 배지): 배경 `#fdf1de`, 텍스트 `#a8681c`
- Page background: `#f5f7f9`
- Card background: `#fff`, border `#e2e6eb`
- Text primary: `#1a2330` / `#0f2136` / `#182430`
- Text muted: `#6b7684` / `#8a94a3` / `#9aa4b1` / `#a3adba`
- Footer background: `#0f2136`, footer text: `#5f7997`

### Typography
- Font family: `Inter` (400/500/600/700/800), 모노스페이스 요소는 `IBM Plex Mono`
- 헤더 로고: 15px/800
- 히어로 타이틀: 26px/800
- 섹션 타이틀: 18-20px/800
- 게시글 제목: 15px/700
- 본문: 14-14.5px, line-height 1.6-1.9
- 메타/라벨: 10-13px, 500-700

### Spacing / Radius
- 카드 radius: 10-14px, 배지 radius: 5-7px, 버튼 radius: 8px
- 헤더 높이: 68px
- 본문 max-width: 1180px(피드), 860px(상세), 760px(글쓰기)
- 그리드 gap: 24px, 카드 내부 padding: 16-32px

## Assets
- 로고: SVG 없이 CSS로 구성된 원형 마크(십자 + 4개 점) — 실제 협회 로고 확보 시 이미지로 교체 필요
- 게시글 썸네일 / 상세 이미지: 줄무늬 placeholder(`repeating-linear-gradient`) + "DRONE PHOTO" 텍스트 — 실제 드론 사진으로 교체 필요
- 폰트: Google Fonts CDN (Inter, IBM Plex Mono)

## Files
- `Drone Community.dc.html` — 전체 디자인 소스 (템플릿 + 로직이 한 파일에 포함). 화면 전환은 `state.view`로 처리되며, 각 화면은 `data-screen-label` 속성으로 구분되어 있습니다 (메인 게시판 / 게시글 상세 / 글쓰기 / 로그인·회원가입).
- `screenshots/01-feed.png` — 메인 게시판
- `screenshots/02-post-detail.png` — 게시글 상세
- `screenshots/03-login.png` — 로그인/회원가입
- `screenshots/04-write.png` — 글쓰기
