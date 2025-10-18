import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";

import { cn } from "@/lib/utils";

const getToggleClasses = (variant, size) => {
  const baseClasses = "toggle";
  const variantClasses = {
    default: "toggle-default",
    outline: "toggle-outline",
  };
  const sizeClasses = {
    default: "toggle-default-size",
    sm: "toggle-sm",
    lg: "toggle-lg",
  };
  
  return cn(
    baseClasses,
    variantClasses[variant] || variantClasses.default,
    sizeClasses[size] || sizeClasses.default
  );
};

const Toggle = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => (
  <TogglePrimitive.Root ref={ref} className={cn(getToggleClasses(variant, size), className)} {...props} />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle };
