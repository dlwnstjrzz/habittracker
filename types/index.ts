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

// storage에 저장되는 데이터 구조
interface StorageData {
  categories: Category[]; // 카테고리 목록
  todos: { [date: string]: Todo[] }; // 날짜별 할일 목록
}
