import { useState } from "react";
import { buttonVariants, styles } from "../../styles/inputModeStyles";

export default function IconButton({ children, title, onClick, variant }) {
  const [isHovered, setIsHovered] = useState(false);

  const backgroundColor = isHovered
    ? buttonVariants[variant].hover
    : buttonVariants[variant].base;

  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        ...styles.buttonBase,
        ...styles.iconButton,
        backgroundColor,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
}