export default function MessageBubble({ role, text }) {
  return (
    <div style={{
      alignSelf: role === "user" ? "flex-end" : "flex-start",
      background: role === "user" ? "#4cafef" : "#2a2a2a",
      padding: "10px",
      borderRadius: "10px",
      maxWidth: "60%",
      color: "white"
    }}>
      {text}
    </div>
  );
}