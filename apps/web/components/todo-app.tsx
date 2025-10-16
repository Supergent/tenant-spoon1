/**
 * Todo App Main Component
 *
 * Shows authentication UI or todo list based on user session
 */

"use client";

import { useSession } from "@/lib/auth-client";
import { AuthUI } from "./auth-ui";
import { TodoList } from "./todo-list";
import { Skeleton } from "@jn74zky3xx5yj89rx9nes87swx7skt7x/components";

export function TodoApp() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md space-y-4 p-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthUI />;
  }

  return <TodoList />;
}
