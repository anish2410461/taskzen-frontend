export interface Todo {
  id: string;
  task: string;
  completed: boolean;
  priority: string;
  status: string;
  dueDate: string;
  dueDateTime?: string;
  createdAt: string;
}
