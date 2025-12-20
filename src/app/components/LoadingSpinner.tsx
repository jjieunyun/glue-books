interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-2",
    lg: "h-14 w-14 border-[3px]",
};

export default function LoadingSpinner({
    size = "md",
    className = "",
}: LoadingSpinnerProps) {
    return (
        <div
            role="status"
            aria-live="polite"
            className={`rounded-full border-glue-200 border-t-glue-700 animate-spin ${sizeClasses[size]} ${className}`.trim()}
        />
    );
}
