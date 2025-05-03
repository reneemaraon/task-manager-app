import { createContext, useContext, useState, ReactNode } from "react";
import {
  tasksService,
  TaskData,
  CreateTaskData,
  UpdateTaskData,
} from "../services/tasks";
import { usersService, UsersData } from "../services/users";

interface TasksContextType {
  tasks: TaskData[];
  users: UsersData[];
  isLoading: boolean;
  error: string | null;
  createTask: (taskData: Omit<CreateTaskData, "id">) => Promise<boolean>;
  updateTask: (
    taskId: string,
    taskData: Partial<Omit<TaskData, "id">>
  ) => Promise<boolean>;
  getTasks: () => Promise<void>;
  getTask: (taskId: string) => Promise<TaskData | null>;
  searchUsers: (search: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<boolean>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};

interface TasksProviderProps {
  children: ReactNode;
}

export const TasksProvider = ({ children }: TasksProviderProps) => {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UsersData[]>([]);

  const searchUsers = async (search: string) => {
    const response = await usersService.search(search);
    setUsers(response);
  };

  const createTask = async (taskData: CreateTaskData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await tasksService.create(taskData);
      setTasks((prev) => [...prev, response]);
      return true;
    } catch (error: any) {
      console.error("Create task error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create task"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (
    taskId: string,
    taskData: UpdateTaskData
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await tasksService.update(taskId, taskData);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? response : task))
      );
      return true;
    } catch (error: any) {
      console.error("Update task error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update task"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getTasks = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await tasksService.getTasks();
      setTasks(data);
    } catch (error: any) {
      console.error("Get tasks error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch tasks"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getTask = async (taskId: string): Promise<TaskData | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const task = await tasksService.getTask(taskId);
      return task;
    } catch (error: any) {
      console.error("Get task error:", error);
      setError(
        error.response?.data?.message || error.message || "Failed to fetch task"
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (taskId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      await tasksService.delete(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      return true;
    } catch (error: any) {
      console.error("Delete task error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete task"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    tasks,
    isLoading,
    error,
    users,
    createTask,
    updateTask,
    getTasks,
    getTask,
    searchUsers,
    deleteTask,
  };

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
};

export default TasksContext;
