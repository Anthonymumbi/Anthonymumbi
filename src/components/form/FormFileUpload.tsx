import { useId, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Camera, X, Upload } from "lucide-react";

interface FormFileUploadProps {
  label: string;
  onChange: (file: File | null) => void;
  accept?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

const FormFileUpload = ({
  label,
  onChange,
  accept = "image/*",
  helperText,
  error,
  required,
}: FormFileUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const descId = `${id}-desc`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onChange(file);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </label>

      {preview ? (
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-accent shadow-card">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-soft hover:scale-110 transition-transform"
            aria-label="Remove profile photo"
            title="Remove profile photo"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label="Upload profile photo"
          className={cn(
            "flex items-center gap-4 p-4 rounded-lg border-2 border-dashed cursor-pointer text-left",
            "border-input bg-card/50 hover:border-accent/50 hover:bg-card",
            "transition-all duration-200",
            error && "border-destructive"
          )}
        >
          <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
            <Camera className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {fileName || "Upload Profile Photo"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tap to select an image
            </p>
          </div>
          <Upload className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
        </button>
      )}

      <input
        id={id}
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="sr-only"
        aria-label={label}
        aria-describedby={error ? undefined : helperText ? descId : undefined}
        title={label}
      />

      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default FormFileUpload;
