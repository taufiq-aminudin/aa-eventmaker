import { describe, it, expect } from 'vitest';
import { INITIAL_TASKS } from './data/initialData';
import { TaskItem } from './types';
import {
  CATEGORY_CONFIGS,
  getCategoryMeta,
  ALL_CATEGORY_KEYS,
  getTaskDependencyInfo,
  isCircularDependency,
} from './screens/PlannerScreen';

// Helper reorder function matching the arrayMove logic used in Planner
function reorderTasksList(list: TaskItem[], fromIndex: number, toIndex: number): TaskItem[] {
  const result = [...list];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

describe('Planner Checklist & Drag-and-Drop Reordering', () => {
  it('should initialize with default tasks', () => {
    expect(INITIAL_TASKS.length).toBeGreaterThan(0);
    expect(INITIAL_TASKS[0].title).toBeDefined();
    expect(INITIAL_TASKS[0].category).toBeDefined();
  });

  it('should properly reorder items from top to bottom', () => {
    const original = [...INITIAL_TASKS];
    const firstTask = original[0];
    const secondTask = original[1];

    const reordered = reorderTasksList(original, 0, 1);

    expect(reordered[0].id).toBe(secondTask.id);
    expect(reordered[1].id).toBe(firstTask.id);
    expect(reordered.length).toBe(original.length);
  });

  it('should properly move an item to the end of the list', () => {
    const original = [...INITIAL_TASKS];
    const firstTask = original[0];

    const reordered = reorderTasksList(original, 0, original.length - 1);

    expect(reordered[reordered.length - 1].id).toBe(firstTask.id);
    expect(reordered[0].id).not.toBe(firstTask.id);
    expect(reordered.length).toBe(original.length);
  });

  it('should preserve task item properties after reordering', () => {
    const original = [...INITIAL_TASKS];
    const reordered = reorderTasksList(original, 2, 0);

    const movedTask = reordered[0];
    const originalItem = original[2];

    expect(movedTask.id).toBe(originalItem.id);
    expect(movedTask.title).toBe(originalItem.title);
    expect(movedTask.dueDate).toBe(originalItem.dueDate);
    expect(movedTask.assignee).toBe(originalItem.assignee);
    expect(movedTask.isCompleted).toBe(originalItem.isCompleted);
  });
});

describe('Task Categories & Visual Tags', () => {
  it('should have visual tag configs for Venue, Catering, and Photography', () => {
    expect(CATEGORY_CONFIGS['Venue']).toBeDefined();
    expect(CATEGORY_CONFIGS['Catering']).toBeDefined();
    expect(CATEGORY_CONFIGS['Photography']).toBeDefined();

    expect(CATEGORY_CONFIGS['Venue'].accentColor).toBe('#10b981');
    expect(CATEGORY_CONFIGS['Catering'].accentColor).toBe('#f59e0b');
    expect(CATEGORY_CONFIGS['Photography'].accentColor).toBe('#6366f1');
  });

  it('should support case-insensitive category lookup and fallbacks', () => {
    const venueMeta = getCategoryMeta('venue');
    expect(venueMeta.key).toBe('Venue');

    const cateringMeta = getCategoryMeta('CATERING');
    expect(cateringMeta.key).toBe('Catering');

    const photoMeta = getCategoryMeta('photography');
    expect(photoMeta.key).toBe('Photography');

    const fallbackMeta = getCategoryMeta('CustomUnlistedCategory');
    expect(fallbackMeta.label).toBe('CustomUnlistedCategory');
  });

  it('should include key categories in ALL_CATEGORY_KEYS', () => {
    expect(ALL_CATEGORY_KEYS).toContain('Venue');
    expect(ALL_CATEGORY_KEYS).toContain('Catering');
    expect(ALL_CATEGORY_KEYS).toContain('Photography');
  });
});

describe('Task Dependencies & Blocked Status', () => {
  it('should correctly flag a task as blocked when its parent task is incomplete', () => {
    const testTasks: TaskItem[] = [
      {
        id: 'parent-1',
        projectId: 'p1',
        title: 'Parent Task Incomplete',
        category: 'Venue',
        dueDate: 'Tomorrow',
        assignee: 'Alice',
        isCompleted: false,
      },
      {
        id: 'child-1',
        projectId: 'p1',
        title: 'Child Task Dependent',
        category: 'Catering',
        dueDate: 'Next Week',
        assignee: 'Bob',
        isCompleted: false,
        dependsOnTaskId: 'parent-1',
      },
    ];

    const depInfo = getTaskDependencyInfo(testTasks[1], testTasks);
    expect(depInfo.isBlocked).toBe(true);
    expect(depInfo.parentTask?.id).toBe('parent-1');
  });

  it('should automatically unblock a dependent task once the parent task is completed', () => {
    const testTasks: TaskItem[] = [
      {
        id: 'parent-1',
        projectId: 'p1',
        title: 'Parent Task Completed',
        category: 'Venue',
        dueDate: 'Tomorrow',
        assignee: 'Alice',
        isCompleted: true, // Parent is completed
      },
      {
        id: 'child-1',
        projectId: 'p1',
        title: 'Child Task Dependent',
        category: 'Catering',
        dueDate: 'Next Week',
        assignee: 'Bob',
        isCompleted: false,
        dependsOnTaskId: 'parent-1',
      },
    ];

    const depInfo = getTaskDependencyInfo(testTasks[1], testTasks);
    expect(depInfo.isBlocked).toBe(false);
    expect(depInfo.parentTask?.id).toBe('parent-1');
  });

  it('should not mark a task as blocked if the task itself is already completed', () => {
    const testTasks: TaskItem[] = [
      {
        id: 'parent-1',
        projectId: 'p1',
        title: 'Parent Task',
        category: 'Venue',
        dueDate: 'Tomorrow',
        assignee: 'Alice',
        isCompleted: false,
      },
      {
        id: 'child-1',
        projectId: 'p1',
        title: 'Child Task',
        category: 'Catering',
        dueDate: 'Next Week',
        assignee: 'Bob',
        isCompleted: true, // Child is already completed
        dependsOnTaskId: 'parent-1',
      },
    ];

    const depInfo = getTaskDependencyInfo(testTasks[1], testTasks);
    expect(depInfo.isBlocked).toBe(false);
  });

  it('should detect circular dependencies and self-dependencies', () => {
    const testTasks: TaskItem[] = [
      {
        id: 'task-a',
        projectId: 'p1',
        title: 'Task A',
        category: 'Venue',
        dueDate: 'Today',
        assignee: 'Alice',
        isCompleted: false,
        dependsOnTaskId: 'task-b',
      },
      {
        id: 'task-b',
        projectId: 'p1',
        title: 'Task B',
        category: 'Catering',
        dueDate: 'Tomorrow',
        assignee: 'Bob',
        isCompleted: false,
        dependsOnTaskId: 'task-c',
      },
      {
        id: 'task-c',
        projectId: 'p1',
        title: 'Task C',
        category: 'Photography',
        dueDate: 'Next Week',
        assignee: 'Charlie',
        isCompleted: false,
      },
    ];

    // Self dependency
    expect(isCircularDependency('task-a', 'task-a', testTasks)).toBe(true);

    // task-c cannot depend on task-a because task-a -> task-b -> task-c (would form a loop)
    expect(isCircularDependency('task-c', 'task-a', testTasks)).toBe(true);

    // But task-c can safely depend on a completely unrelated task
    expect(isCircularDependency('task-c', 'unrelated-task', testTasks)).toBe(false);
  });
});
