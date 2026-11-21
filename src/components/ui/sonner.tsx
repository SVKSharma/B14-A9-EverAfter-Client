"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-center"
      className="toaster group"
      closeButton
      gap={10}
      visibleToasts={3}
      icons={{
        success: <CircleCheckIcon className="size-3.5" strokeWidth={2} />,
        info: <InfoIcon className="size-3.5" strokeWidth={2} />,
        warning: <TriangleAlertIcon className="size-3.5" strokeWidth={2} />,
        error: <OctagonXIcon className="size-3.5" strokeWidth={2} />,
        loading: <Loader2Icon className="size-3.5 animate-spin" strokeWidth={2} />,
      }}
      // Sits clear of the fixed public nav and the dashboard header, both 4.5rem.
      offset={{ top: 88, left: 16, right: 16 }}
      mobileOffset={{ top: 76, left: 12, right: 12 }}
      style={
        {
          "--width": "min(26rem, calc(100vw - 2rem))",
          "--normal-bg": "var(--glass-strong)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--glass-border)",
          "--border-radius": "1rem",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
