"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "../ui/sonner";
const queryClient = new QueryClient();

export function Provider({
  children,
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        disableTransitionOnChange
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        <div className="   max-w-4xl mx-auto px-5">{children}</div>
        <Toaster />
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
