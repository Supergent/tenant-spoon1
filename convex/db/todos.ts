/**
 * Database Layer: Todos
 *
 * This is the ONLY file that directly accesses the todos table using ctx.db.
 * All todo-related database operations are defined here as pure async functions.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// ============================================================================
// CREATE
// ============================================================================

export async function createTodo(
  ctx: MutationCtx,
  args: {
    userId: string;
    text: string;
    priority?: "low" | "medium" | "high";
    dueDate?: number;
    tags?: string[];
  }
) {
  const now = Date.now();
  return await ctx.db.insert("todos", {
    ...args,
    completed: false,
    createdAt: now,
    updatedAt: now,
  });
}

// ============================================================================
// READ
// ============================================================================

/**
 * Get a todo by its ID
 */
export async function getTodoById(ctx: QueryCtx, id: Id<"todos">) {
  return await ctx.db.get(id);
}

/**
 * Get all todos for a user, ordered by creation date (newest first)
 */
export async function getTodosByUser(ctx: QueryCtx, userId: string) {
  return await ctx.db
    .query("todos")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .order("desc")
    .collect();
}

/**
 * Get todos by user and completion status
 */
export async function getTodosByUserAndCompleted(
  ctx: QueryCtx,
  userId: string,
  completed: boolean
) {
  return await ctx.db
    .query("todos")
    .withIndex("by_user_and_completed", (q) =>
      q.eq("userId", userId).eq("completed", completed)
    )
    .order("desc")
    .collect();
}

/**
 * Get active (incomplete) todos for a user
 */
export async function getActiveTodosByUser(ctx: QueryCtx, userId: string) {
  return getTodosByUserAndCompleted(ctx, userId, false);
}

/**
 * Get completed todos for a user
 */
export async function getCompletedTodosByUser(ctx: QueryCtx, userId: string) {
  return getTodosByUserAndCompleted(ctx, userId, true);
}

/**
 * Count total todos for a user
 */
export async function countTodosByUser(ctx: QueryCtx, userId: string) {
  const todos = await getTodosByUser(ctx, userId);
  return todos.length;
}

/**
 * Count active todos for a user
 */
export async function countActiveTodosByUser(ctx: QueryCtx, userId: string) {
  const todos = await getActiveTodosByUser(ctx, userId);
  return todos.length;
}

/**
 * Count completed todos for a user
 */
export async function countCompletedTodosByUser(ctx: QueryCtx, userId: string) {
  const todos = await getCompletedTodosByUser(ctx, userId);
  return todos.length;
}

// ============================================================================
// UPDATE
// ============================================================================

/**
 * Update a todo's text
 */
export async function updateTodoText(
  ctx: MutationCtx,
  id: Id<"todos">,
  text: string
) {
  return await ctx.db.patch(id, {
    text,
    updatedAt: Date.now(),
  });
}

/**
 * Toggle a todo's completed status
 */
export async function toggleTodoCompleted(ctx: MutationCtx, id: Id<"todos">) {
  const todo = await ctx.db.get(id);
  if (!todo) {
    throw new Error("Todo not found");
  }

  const now = Date.now();
  return await ctx.db.patch(id, {
    completed: !todo.completed,
    completedAt: !todo.completed ? now : undefined,
    updatedAt: now,
  });
}

/**
 * Mark a todo as completed
 */
export async function completeTodo(ctx: MutationCtx, id: Id<"todos">) {
  const now = Date.now();
  return await ctx.db.patch(id, {
    completed: true,
    completedAt: now,
    updatedAt: now,
  });
}

/**
 * Mark a todo as incomplete
 */
export async function incompleteTodo(ctx: MutationCtx, id: Id<"todos">) {
  return await ctx.db.patch(id, {
    completed: false,
    completedAt: undefined,
    updatedAt: Date.now(),
  });
}

/**
 * Update todo priority
 */
export async function updateTodoPriority(
  ctx: MutationCtx,
  id: Id<"todos">,
  priority?: "low" | "medium" | "high"
) {
  return await ctx.db.patch(id, {
    priority,
    updatedAt: Date.now(),
  });
}

/**
 * Update todo due date
 */
export async function updateTodoDueDate(
  ctx: MutationCtx,
  id: Id<"todos">,
  dueDate?: number
) {
  return await ctx.db.patch(id, {
    dueDate,
    updatedAt: Date.now(),
  });
}

/**
 * Update todo tags
 */
export async function updateTodoTags(
  ctx: MutationCtx,
  id: Id<"todos">,
  tags?: string[]
) {
  return await ctx.db.patch(id, {
    tags,
    updatedAt: Date.now(),
  });
}

// ============================================================================
// DELETE
// ============================================================================

/**
 * Delete a todo
 */
export async function deleteTodo(ctx: MutationCtx, id: Id<"todos">) {
  return await ctx.db.delete(id);
}

/**
 * Delete all completed todos for a user
 */
export async function deleteCompletedTodos(ctx: MutationCtx, userId: string) {
  const completedTodos = await getCompletedTodosByUser(ctx, userId);
  await Promise.all(completedTodos.map((todo) => ctx.db.delete(todo._id)));
  return completedTodos.length;
}
