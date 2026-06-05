import type { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "danger" | "primary" | "default";
    children: ReactNode;
}

function Button({ variant, children, ...rest }: ButtonProps) {
    let color = "bg-gray-600";

    if (variant === "danger") {
        color = "bg-red-500";
    }

    if (variant === "primary") {
        color = "bg-green-700";
    }

    return (
        <button
            className={`${color} p-2 rounded text-white cursor-pointer active:scale-95 disabled:opacity-50`}
            {...rest}
        >
            {children}
        </button>
    );
}

export default Button;