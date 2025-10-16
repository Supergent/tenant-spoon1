/**
 * Todo List Component
 *
 * Main todo list interface with real-time updates
 */

"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { signOut } from "@/lib/auth-client";
import {
  Card,
  Button,
  Input,
  Badge,
  Skeleton,
  Checkbox,
} from "@jn74zky3xx5yj89rx9nes87swx7skt7x/components";
import { Trash2, LogOut } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";

export function TodoList() {
  const [newTodoText, setNewTodoText] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Queries
  const todos = useQuery(api.endpoints.todos.list);
  const stats = useQuery(api.endpoints.todos.stats);

  // Mutations
  const createTodo = useMutation(api.endpoints.todos.create);
  const toggleTodo = useMutation(api.endpoints.todos.toggle);
  const removeTodo = useMutation(api.endpoints.todos.remove);
  const clearCompleted = useMutation(api.endpoints.todos.clearCompleted);

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    try {
      await createTodo({ text: newTodoText });
      setNewTodoText("");
    } catch (error) {
      console.error("Failed to create todo:", error);
    }
  };

  const handleToggleTodo = async (id: Id<"todos">) => {
    try {
      await toggleTodo({ id });
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  const handleRemoveTodo = async (id: Id<"todos">) => {
    try {
      await removeTodo({ id });
    } catch (error) {
      console.error("Failed to remove todo:", error);
    }
  };

  const handleClearCompleted = async () => {
    try {
      await clearCompleted();
    } catch (error) {
      console.error("Failed to clear completed todos:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  // Filter todos
  const filteredTodos = todos?.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const isLoading = todos === undefined || stats === undefined;

  return (
    <div className="mx-auto min-h-screen max-w-2xl p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-headings text-3xl font-bold text-textPrimary">
            ✓ Todos
          </h1>
          <p className="mt-1 text-sm text-textSecondary">
            Distraction-free task management
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {/* Stats */}
      {isLoading ? (
        <Card className="mb-6 p-4">
          <Skeleton className="h-6 w-full" />
        </Card>
      ) : (
        <Card className="mb-6 p-4">
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-textSecondary">Total: </span>
              <span className="font-semibold text-textPrimary">
                {stats.total}
              </span>
            </div>
            <div>
              <span className="text-textSecondary">Active: </span>
              <span className="font-semibold text-primary">{stats.active}</span>
            </div>
            <div>
              <span className="text-textSecondary">Completed: </span>
              <span className="font-semibold text-success">
                {stats.completed}
              </span>
            </div>
            {stats.total > 0 && (
              <div className="ml-auto">
                <Badge variant="secondary">
                  {stats.completionRate}% complete
                </Badge>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Create Todo Form */}
      <Card className="mb-6 p-4">
        <form onSubmit={handleCreateTodo} className="flex gap-2">
          <Input
            type="text"
            placeholder="What needs to be done?"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={!newTodoText.trim()}>
            Add
          </Button>
        </form>
      </Card>

      {/* Filters */}
      <div className="mb-4 flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "active" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilter("active")}
        >
          Active
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilter("completed")}
        >
          Completed
        </Button>
        {stats && stats.completed > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearCompleted}
            className="ml-auto text-danger hover:text-danger-emphasis"
          >
            Clear Completed
          </Button>
        )}
      </div>

      {/* Todo List */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-6 w-full" />
            </Card>
          ))}
        </div>
      ) : filteredTodos && filteredTodos.length > 0 ? (
        <div className="space-y-2">
          {filteredTodos.map((todo) => (
            <Card
              key={todo._id}
              className={`group p-4 transition-all ${
                todo.completed ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => handleToggleTodo(todo._id)}
                />
                <span
                  className={`flex-1 ${
                    todo.completed
                      ? "text-textSecondary line-through"
                      : "text-textPrimary"
                  }`}
                >
                  {todo.text}
                </span>
                {todo.priority && (
                  <Badge
                    variant={
                      todo.priority === "high"
                        ? "destructive"
                        : todo.priority === "medium"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {todo.priority}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveTodo(todo._id)}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4 text-danger" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-textSecondary">
            {filter === "all"
              ? "No todos yet. Create one above!"
              : filter === "active"
              ? "No active todos. Great job!"
              : "No completed todos yet."}
          </p>
        </Card>
      )}
    </div>
  );
}
