import { cn } from "@/lib/utils";

interface FormRadioGroupProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}

const FormRadioGroup = ({
  label,
  name,
  options,
  value,
  onChange,
  required,
  error,
}: FormRadioGroupProps) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </label>
      <div className="flex gap-6">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "flex items-center gap-3 cursor-pointer group"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                value === option.value
                  ? "border-accent bg-accent"
                  : "border-input bg-card group-hover:border-accent/50"
              )}
            >
              {value === option.value && (
                <div className="w-2 h-2 rounded-full bg-accent-foreground" />
              )}
            </div>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
            <span className="text-sm text-foreground">{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};

export default FormRadioGroup;
