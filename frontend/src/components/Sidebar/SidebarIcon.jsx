import { useState } from "react";

export default function SidebarIcon({ icon, label, active, onClick }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        margin: "20px 0",
        fontSize: "20px",
        cursor: "pointer",
        color: active ? "#4cafef" : "#aaa",
      }}
    >
      {icon}

      {hover && (
        <div
          style={{
            position: "absolute",
            left: "50px",
            background: "#333",
            color: "#fff",
            padding: "5px 10px",
            borderRadius: "5px",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}