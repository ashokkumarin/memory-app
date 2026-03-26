import { FaComments, FaCog } from "react-icons/fa";

export default function Sidebar({ mode, setMode }) {
  return (
    <div style={styles.sidebar}>
      <Icon
        label="Chat"
        active={mode === "chat"}
        onClick={() => setMode("chat")}
      >
        <FaComments />
      </Icon>

      <Icon
        label="Settings"
        active={mode === "input"}
        onClick={() => setMode("input")}
      >
        <FaCog />
      </Icon>
    </div>
  );
}

function Icon({ children, label, active, onClick }) {
  return (
    <div onClick={onClick} title={label} style={{
      ...styles.icon,
      color: active ? "#4cafef" : "#aaa"
    }}>
      {children}
    </div>
  );
}

const styles = {
  sidebar: {
    width: "60px",
    background: "#1e1e1e",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "20px",
  },
  icon: {
    margin: "20px 0",
    fontSize: "20px",
    cursor: "pointer",
  },
};