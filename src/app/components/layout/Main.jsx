"use client"
import { LayoutContextProvider } from "@/app/contexts/LayoutContext";

export default function Main ({ children }) {
  return (
    <LayoutContextProvider>
      <main>
        {children}
      </main>
    </LayoutContextProvider>
  )
}
