import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
     variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
     size?: "default" | "sm" | "lg" | "icon"
     asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
     ({ className, variant = "default", size = "default", ...props }, ref) => {
          const baseClasses = "btn"
          const variantClasses = {
               default: "btn-default",
               destructive: "btn-destructive",
               outline: "btn-outline",
               secondary: "btn-secondary",
               ghost: "btn-ghost",
               link: "btn-link",
          }
          const sizeClasses = {
               default: "",
               sm: "btn-sm",
               lg: "btn-lg",
               icon: "btn-icon",
          }

          return (
               <button className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)} ref={ref} {...props} />
          )
     },
)
Button.displayName = "Button"

export { Button }
