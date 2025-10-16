import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@jn74zky3xx5yj89rx9nes87swx7skt7x/components";
import { ConvexClientProvider } from "@/providers/convex-provider";

export const metadata: Metadata = {
  title: "Distraction-Free Todos",
  description: "A stripped-down, distraction-free todo list with real-time sync",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <ConvexClientProvider>
          <AppProviders>{children}</AppProviders>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
