import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

const getButtonClasses = (variant, size) => {
  const baseClasses = "btn";
  const variantClasses = {
    default: "btn-default",
    destructive: "btn-destructive", 
    outline: "btn-outline",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
    link: "btn-link",
  };
  const sizeClasses = {
    default: "btn-default-size",
    sm: "btn-sm",
    lg: "btn-lg", 
    icon: "btn-icon",
  };
  
  return cn(
    baseClasses,
    variantClasses[variant] || variantClasses.default,
    sizeClasses[size] || sizeClasses.default
  );
};

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(getButtonClasses(variant, size), className)} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button };
