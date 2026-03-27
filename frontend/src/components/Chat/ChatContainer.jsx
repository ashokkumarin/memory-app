import { useState, useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import { sendQuery } from "../../services/api";

export default function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const handleSend = async (text) => {
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    console.log("SENDING QUERY:", text);

    const data = await sendQuery(text);

    setLoading(false);

    setMessages((prev) => [
      ...prev,
      { role: "bot", text: data.answer },
    ]);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div style={styles.container}>
      <div style={styles.chatArea}>
        {messages.map((m, i) => (
          <MessageBubble key={i} {...m} />
        ))}

        {loading && <MessageBubble role="bot" text="Thinking..." />}

        <div ref={endRef} />
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%", // ✅ IMPORTANT FIX
    background: "#0f172a",
  },
  chatArea: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "800px",
    margin: "0 auto",
    width: "100%",
  },
};