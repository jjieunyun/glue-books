import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    topBarColor?: string;
}

export default function Card({ children, className = "", topBarColor }: CardProps) {
    return (
        <div className={`latte-card relative overflow-hidden group shadow-lg ${className}`}>
            {topBarColor && (
                <div className={`absolute top-0 left-0 w-full h-2 ${topBarColor}`} />
            )}
            {children}
        </div>
    );
}
