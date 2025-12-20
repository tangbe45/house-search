import { LoaderIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

type CustomSpinnerProps = React.ComponentProps<"div"> & {
  style?: string;
};

export function CustomSpinner({ style, ...props }: CustomSpinnerProps) {
  return (
    <div className={cn("flex items-center gap-4")} {...props}>
      <Spinner className={cn("size-6", style)} />
    </div>
  );
}
