import {
  Link,
} from "react-router-dom";

const variantClasses = {
  primary:
    "bg-zinc-900 text-white hover:bg-zinc-700",

  secondary:
    "bg-white text-zinc-900 hover:bg-zinc-100",

  yellow:
    "bg-yellow-400 text-zinc-900 hover:bg-yellow-300",

  blue:
    "bg-blue-900 text-white hover:bg-blue-800",

  danger:
    "bg-red-600 text-white hover:bg-red-700",
};

const Button = ({
  children,
  to,
  type = "button",
  variant = "secondary",
  className = "",
  disabled = false,
  onClick,
  ...props
}) => {
  const classes = [
    // Layout / touch target
    "inline-flex min-h-11 min-w-11 items-center justify-center",

    // Shape
    "rounded-xl border-2 border-zinc-900 px-5 py-2.5",

    // Typography
    "text-xs font-bold uppercase tracking-[0.16em]",

    // Motion
    "transition duration-150",

    // Keyboard accessibility
    "focus-visible:outline-none",
    "focus-visible:ring-4",
    "focus-visible:ring-blue-400",
    "focus-visible:ring-offset-2",

    // Selected variant
    variantClasses[variant] ??
      variantClasses.secondary,

    // Disabled styles
    disabled
      ? "cursor-not-allowed opacity-50"
      : "active:scale-[0.98]",

    className,
  ]
    .join(" ")
    .trim();

  // LINK BUTTON
  if (to) {
    if (disabled) {
      return (
        <span
          className={classes}
          aria-disabled="true"
          {...props}
        >
          {children}
        </span>
      );
    }

    return (
      <Link
        to={to}
        className={classes}
        {...props}
      >
        {children}
      </Link>
    );
  }

  // NORMAL BUTTON
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;