import { useState } from "react";
import { buttonVariants, styles } from "../../styles/inputModeStyles";

export default function ActionButton({
  children,
  onClick,
  variant = "save",
  disabled = false,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const backgroundColor = disabled
    ? "#94a3b8"
    : isHovered
    ? buttonVariants[variant].hover
    : buttonVariants[variant].base;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles.buttonBase,
        ...styles.saveButton,
        backgroundColor,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
}