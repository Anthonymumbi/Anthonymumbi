import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { UserPlus, Loader2 } from "lucide-react";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ children, isLoading, icon, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="submit"
        disabled={isLoading}
        className={cn(
          "w-full py-4 px-6 rounded-xl font-semibold text-lg",
          "gradient-accent text-accent-foreground",
          "flex items-center justify-center gap-3",
          "shadow-button hover:shadow-lg",
          "transform hover:scale-[1.02] active:scale-[0.98]",
          "transition-all duration-200",
          "disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          icon || <UserPlus className="w-5 h-5" />
        )}
        {children}
      </button>
    );
  }
);

SubmitButton.displayName = "SubmitButton";

export default SubmitButton;
