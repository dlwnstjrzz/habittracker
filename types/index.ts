interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: string; // ISO 형식의 날짜 문자열 (YYYY-MM-DD)
}

interface Category {
  id: string;
  title: string;
  color: string;
  todos: { [date: string]: Todo[] }; // 날짜별 todos
}
