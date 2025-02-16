interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: string; // YYYY-MM-DD 형식의 날짜
  categoryId: string; // 어떤 카테고리에 속하는지
}

interface Category {
  id: string;
  title: string;
  color: string;
}

interface Routine {
  id: string;
  todoId: string; // 원본 할일 ID
  text: string; // 할일 내용
  categoryId: string; // 카테고리
  startDate: string; // 시작일 (YYYY-MM-DD)
  // 선택적 필드들
  endDate?: string; // 종료일 (없으면 무기한)
  frequency?: {
    // 반복 주기
    type: "daily" | "weekly" | "monthly";
    days?: number[]; // weekly인 경우 요일 (0-6, 0:일요일)
    dates?: number[]; // monthly인 경우 날짜들
  };
}

// storage에 저장되는 데이터 구조
interface StorageData {
  categories: Category[]; // 카테고리 목록
  todos: { [date: string]: Todo[] }; // 날짜별 할일 목록
  routines: Routine[]; // 루틴 배열 추가
}
