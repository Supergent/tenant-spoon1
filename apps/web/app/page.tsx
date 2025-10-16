/**
 * Home Page
 *
 * Main entry point showing authentication or todo list
 */

import { TodoApp } from "@/components/todo-app";

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <TodoApp />
    </main>
  );
}
