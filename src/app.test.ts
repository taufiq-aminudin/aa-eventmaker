import { describe, it, expect } from 'vitest';
import { INITIAL_TASKS } from './data/initialData';
import { TaskItem } from './types';

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
