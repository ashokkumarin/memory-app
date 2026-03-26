import { useState } from "react";
import ChatPage from "./pages/ChatPage";
import InputModePage from "./pages/InputModePage";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  const [mode, setMode] = useState("chat");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar mode={mode} setMode={setMode} />

      <div style={{ flex: 1 }}>
        {mode === "chat" ? <ChatPage /> : <InputModePage />}
      </div>
    </div>
  );
}

export default App;