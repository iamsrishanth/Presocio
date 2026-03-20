"use client";

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
    text?: string;
    size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({ text = "Loading...", size = "md" }: LoadingSpinnerProps) {
    const sizes = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3 py-8">
            <Loader2 className={`${sizes[size]} text-[var(--color-primary)] animate-spin`} />
            <p className="text-sm text-[var(--color-text-muted)] font-medium">{text}</p>
        </div>
    );
}
