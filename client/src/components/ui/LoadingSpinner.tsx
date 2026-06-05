const SIZES = {
    small: "w-3 h-3",
    middle: "w-5 h-5",
    large: "w-7 h-7"
};

const COLORS = {
    gray: "bg-gray-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
    transparent: "bg-transparent"
};

interface LoadingSpinnerProps {
    title?: string;
    size?: Size;
    color?: Color;
    variant?: Variant
};

type Size = keyof typeof SIZES;
type Color = keyof typeof COLORS;
type Variant = "circle" | "dots";

function LoadingSpinner({ title, size = "middle", color = "gray", variant = "circle" }: LoadingSpinnerProps) {

    return (
        <div className="flex items-center gap-2">
            {title && <span className="text-white">{title}</span>}
            {variant === "dots" ? (
                <div className="grid grid-cols-2 gap-1 animate-spin">
                    <div className={`${SIZES[size]} ${COLORS[color]} rounded-sm`} />
                    <div className={`${SIZES[size]} ${COLORS[color]} rounded-sm`} />
                    <div className={`${SIZES[size]} ${COLORS[color]} rounded-sm`} />
                    <div className={`${SIZES[size]} ${COLORS[color]} rounded-sm`} />
                </div>
            ) : (
                <div className={`${SIZES[size]} ${COLORS[color]} border-2 border-gray-300 border-t-transparent rounded-full animate-spin`}></div>
            )}
        </div>
    );
}

export default LoadingSpinner;
