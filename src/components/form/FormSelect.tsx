import { forwardRef, SelectHTMLAttributes, useId } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  placeholder?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, options, error, placeholder, className, ...props }, ref) => {
    const id = useId();
    return (
      <div className="space-y-2">
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          {label}
          {props.required && <span className="text-accent ml-1">*</span>}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={id}
            title={label}
            className={cn(
              "w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground",
              "appearance-none cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
              "transition-all duration-200 shadow-input",
              error && "border-destructive focus:ring-destructive/30 focus:border-destructive",
              !props.value && "text-muted-foreground",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        </div>
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

export default FormSelect;
