import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[30px] text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-[hsl(var(--brand-2))] shadow-[inset_0px_-5px_5px_0px_rgba(253,147,18,0.50),inset_0px_4px_5px_0px_rgba(253,147,18,0.50),0px_24px_7px_0px_rgba(0,0,0,0.00),0px_16px_6px_0px_rgba(0,0,0,0.01),0px_9px_5px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.09),0px_1px_2px_0px_rgba(0,0,0,0.10)]",
        outline:
          "border border-[hsl(var(--brand-soft))] text-[hsl(var(--brand-soft))] bg-transparent",
        ghost: "bg-transparent text-foreground hover:bg-muted/40",
      },
      size: {
        default: "px-8 py-[10px]",
        sm: "px-4 py-2 text-sm",
        lg: "px-10 py-3 text-base",
        pill: "px-8 py-[10px]",
        block: "w-full px-8 py-4 text-2xl tracking-[-0.72px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };


