"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      className="toaster group top-4 right-4"
      toastOptions={{
        duration: 4000,
      }}
      icons={{
        success: <CircleCheckIcon className="w-5 h-5" />,
        info: <InfoIcon className="w-5 h-5" />,
        warning: <TriangleAlertIcon className="w-5 h-5" />,
        error: <OctagonXIcon className="w-5 h-5" />,
        loading: <Loader2Icon className="w-5 h-5 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "0.5rem",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
