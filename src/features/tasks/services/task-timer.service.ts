import { Task } from '@/types/domain.types';

export interface PerformanceMetric {
  taskId: string;
  expectedDurationMinutes: number;
  effectiveDurationMinutes: number;
  varianceMinutes: number; // positive = saved time, negative = delayed
  scorePercentage: number;
}

export class TaskTimerService {
  /**
   * Section 6.3 Rule: Record exact time when employee presses "Accept Task"
   */
  public static acceptTask(task: Task): Task {
    return {
      ...task,
      status: 'in_progress',
      acceptedAt: new Date().toISOString(),
    };
  }

  /**
   * Section 6.3 Rule: Record exact time when employee presses "Complete Task"
   * Calculates effective_duration = task_completed_at - task_accepted_at
   */
  public static completeTask(task: Task): { updatedTask: Task; metric: PerformanceMetric } {
    if (!task.acceptedAt) {
      throw new Error('لا يمكن إتمام المهمة قبل أن يتم استلامها والبدء بها أولاً.');
    }

    const completedAt = new Date().toISOString();
    const acceptedTime = new Date(task.acceptedAt).getTime();
    const completedTime = new Date(completedAt).getTime();

    // Calculate effective duration in minutes
    const effectiveDurationMinutes = Math.round((completedTime - acceptedTime) / (1000 * 60));
    const expected = task.expectedDurationMinutes || 60;
    const varianceMinutes = expected - effectiveDurationMinutes;

    // Performance ratio calculation
    const scoreRatio = Math.min(1.5, Math.max(0.5, expected / (effectiveDurationMinutes || 1)));
    const scorePercentage = Math.round(scoreRatio * 100);

    const updatedTask: Task = {
      ...task,
      status: 'completed',
      completedAt,
      effectiveDurationMinutes,
    };

    const metric: PerformanceMetric = {
      taskId: task.id,
      expectedDurationMinutes: expected,
      effectiveDurationMinutes,
      varianceMinutes,
      scorePercentage,
    };

    return { updatedTask, metric };
  }
}
