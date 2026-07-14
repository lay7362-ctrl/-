import type { Post, Comment, DroneEvent } from "@/types";

export const CATEGORY_LIST = ["전체", "공지사항", "자유게시판", "기체정보", "비행후기", "Q&A"];
export const WRITE_CATEGORIES = ["자유게시판", "기체정보", "비행후기", "Q&A"];

export const INITIAL_POSTS: Post[] = [
  { id: 101, category: "공지사항", pinned: true, title: "2026년 하반기 정기총회 안내", excerpt: "10월 셋째 주 정기총회 개최 및 안건 안내드립니다.", author: "협회사무국", date: "2026.07.10", comments: 12, likes: 34, views: 1820, authorInitial: "협", body: "안녕하세요, 회원 여러분.\n\n2026년 하반기 정기총회를 아래와 같이 개최합니다. 많은 참여 부탁드립니다.\n\n- 일시: 2026년 10월 17일 (토) 14:00\n- 장소: 협회 대강당\n- 안건: 예산안 승인, 신규 자격제도 소개" },
  { id: 102, category: "기체정보", pinned: false, title: "인스파이어4 초기 배터리 세팅 팁 공유합니다", excerpt: "저온 환경에서 배터리 예열 방법 정리했어요", author: "하늘위드론", date: "2026.07.09", comments: 8, likes: 21, views: 640, authorInitial: "하", body: "겨울철 저온 비행 시 배터리 성능 저하를 줄이는 방법을 정리했습니다.\n\n1. 비행 전 실내에서 20분 이상 예열\n2. 배터리 온도가 15도 이상일 때 이륙\n3. 예비 배터리는 보온팩과 함께 보관" },
  { id: 103, category: "비행후기", pinned: false, title: "제주 성산일출봉 항공촬영 다녀왔습니다", excerpt: "허가 절차부터 촬영 포인트까지 후기 남겨요", author: "촬영왕민수", date: "2026.07.08", comments: 15, likes: 47, views: 980, authorInitial: "촬", body: "제주 성산일출봉 인근 촬영을 위해 사전 비행 승인을 받는 과정을 공유합니다.\n\n국토부 허가부터 문화재청 협의까지 약 3주가 소요되었고, 실제 촬영은 일출 직후 30분간 진행했습니다." },
  { id: 104, category: "Q&A", pinned: false, title: "초경량비행장치 조종자 자격시험 후기 궁금합니다", excerpt: "실기시험 난이도가 어느 정도인가요?", author: "드론입문", date: "2026.07.07", comments: 22, likes: 9, views: 512, authorInitial: "드", body: "다음 달 실기시험을 앞두고 있는데, 최근 응시하신 분들의 후기가 궁금합니다.\n\n특히 정지비행과 마름모 비행 코스에서 감점 요인이 궁금해요." },
  { id: 105, category: "자유게시판", pinned: false, title: "드론 동호회 정모 다녀온 사진 몇 장 올립니다", excerpt: "이번 주말 한강공원 정모 즐거웠습니다", author: "한강라이더", date: "2026.07.06", comments: 6, likes: 18, views: 402, authorInitial: "한", body: "이번 주말 한강 정모에 참석해주신 모든 분들 감사합니다.\n\n다음 정모는 8월 첫째 주 예정이며 신규 회원분들도 편하게 참여해주세요." },
  { id: 106, category: "기체정보", pinned: false, title: "국산 산업용 드론 신제품 스펙 비교", excerpt: "방제/측량용 기체 3종 비교 정리했습니다", author: "산업드론연구소", date: "2026.07.05", comments: 10, likes: 29, views: 733, authorInitial: "산", body: "최근 출시된 국산 산업용 드론 3종의 적재량, 비행시간, 가격을 비교했습니다.\n\n방제용은 적재량 위주로, 측량용은 정밀도와 배터리 효율을 중점적으로 비교했습니다." },
  { id: 107, category: "비행후기", pinned: false, title: "야간 비행 허가 신청 경험담", excerpt: "야간 특별비행승인 신청 과정 정리", author: "나이트플라이어", date: "2026.07.04", comments: 5, likes: 14, views: 355, authorInitial: "나", body: "야간 특별비행승인은 일반 비행승인보다 서류가 더 필요합니다.\n\n조명장치 사양서와 비상연락체계를 별도로 제출해야 했습니다." },
];

export const COMMENTS: Comment[] = [
  { initial: "김", author: "김비행사", date: "2026.07.10", body: "좋은 정보 감사합니다!" },
  { initial: "이", author: "이하늘", date: "2026.07.10", body: "저도 다음에 참고해볼게요." },
  { initial: "박", author: "박조종", date: "2026.07.09", body: "혹시 자세한 자료 더 있을까요?" },
];

export const EVENTS: DroneEvent[] = [
  { month: "7월", day: "18", title: "2026 드론 안전비행 세미나" },
  { month: "8월", day: "02", title: "한강 정기모임" },
  { month: "8월", day: "22", title: "산업용 드론 박람회 참관" },
];
