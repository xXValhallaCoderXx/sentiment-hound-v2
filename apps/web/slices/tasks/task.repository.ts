import { ITaskRepository, ITask } from "@repo/services";

export class TaskRepository implements ITaskRepository {
  private tasks: ITask[] = [
    {
      id: "1",
      title: "Test Task",
      description: "Test Description",
      completed: false,
      userId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  async findById(id: string): Promise<ITask | null> {
    return this.tasks.find((task) => task.id === id) || null;
  }

  async findByUserId(userId: string): Promise<ITask[]> {
    return this.tasks.filter((task) => task.userId === userId);
  }

  async create(task: ITask): Promise<ITask> {
    this.tasks.push(task);
    return task;
  }

  async update(id: string, data: Partial<ITask>): Promise<ITask> {
    const task = await this.findById(id);
    if (!task) throw new Error("Task not found");
    Object.assign(task, data);
    return task;
  }

  async delete(id: string): Promise<void> {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index > -1) {
      this.tasks.splice(index, 1);
    }
  }

  async toggleComplete(id: string): Promise<ITask> {
    const task = await this.findById(id);
    if (!task) throw new Error("Task not found");

    task.completed = !task.completed;
    return task;
  }

  async getTasks(): Promise<ITask[]> {
    return this.tasks;
  }
}
