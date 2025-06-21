import { type VariantProps, cva } from "class-variance-authority";
import type React from "react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary border-transparent text-primary-foreground hover:bg-primary/80 bg-blue-500 text-white",
        secondary:
          "bg-secondary border-transparent text-secondary-foreground hover:bg-secondary/80 bg-gray-200 text-gray-800",
        destructive:
          "bg-destructive border-transparent text-destructive-foreground hover:bg-destructive/80 bg-red-500 text-white",
        outline:
          "text-foreground border border-input hover:bg-accent hover:text-accent-foreground border-gray-300 hover:bg-gray-100",
        success:
          "bg-green-100 border-transparent text-green-800 hover:bg-green-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={badgeVariants({ variant, className })} {...props} />;
}

export { Badge, badgeVariants };
