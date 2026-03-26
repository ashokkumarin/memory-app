import { useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function ChatInput({ onSend }) {
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div style={styles.container}>
      <input
        style={styles.input}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder="Ask anything..."
      />
      <button style={styles.btn} onClick={send}>
        <FaArrowUp />
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #333",
    background: "#1e293b",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "none",
  },
  btn: {
    marginLeft: "10px",
    padding: "0 16px",
    borderRadius: "10px",
    border: "none",
    background: "#4cafef",
    color: "white",
    cursor: "pointer",
  },
};