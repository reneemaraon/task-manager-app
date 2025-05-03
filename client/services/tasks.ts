import { apiClient } from "./api";

export interface TaskData {
  id: string;
  title: string;
  description: string;
  status: string;
  due_date: string;
  assigned_user_id: number;
  user_id: number;
  user: {
    name: string;
    id: number;
  };
  assigned_user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: string;
  dueDate?: string;
  assignedUserId?: number;
}

export interface CreateTaskData {
  title: string;
  description: string;
  status?: string;
  dueDate: string;
  assignedUserId: number;
}

export const tasksService = {
  create: async (taskData: CreateTaskData): Promise<TaskData> => {
    const preparedTaskData = {
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      due_date: taskData.dueDate,
      assigned_user_id: taskData.assignedUserId,
    };
    const data = await apiClient.post<TaskData>("/tasks", preparedTaskData, {
      requiresAuth: true,
    });
    return data;
  },

  update: async (id: string, taskData: UpdateTaskData): Promise<TaskData> => {
    const data = await apiClient.patch<TaskData>(`/tasks/${id}`, taskData, {
      requiresAuth: true,
    });
    return data;
  },

  getTasks: async (): Promise<TaskData[]> => {
    const data = await apiClient.get<TaskData[]>("/tasks", {
      requiresAuth: true,
    });
    return data;
  },

  getTask: async (taskId: string): Promise<TaskData> => {
    console.log("requesting taskId", taskId);
    const data = await apiClient.get<TaskData>(`/tasks/${taskId}`, {
      requiresAuth: true,
    });
    return data;
  },

  delete: async (taskId: string): Promise<void> => {
    try {
      await apiClient.delete(`/tasks/${taskId}`, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error("Delete task error:", error);
    }
  },
};
