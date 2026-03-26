import { useState, useEffect } from "react";

export default function MemoryForm({ onSave, selected }) {
  const [keyVal, setKeyVal] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    if (selected) {
      setKeyVal(selected.key);
      setValue(selected.value);
    }
  }, [selected]);

  const handleSubmit = () => {
    if (!keyVal || !value) return;

    onSave({ key: keyVal, value });

    setKeyVal("");
    setValue("");
  };

  return (
    <div style={styles.container}>
      <input
        placeholder="Key"
        value={keyVal}
        onChange={(e) => setKeyVal(e.target.value)}
        style={styles.input}
      />

      <input
        placeholder="Value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleSubmit} style={styles.button}>
        Save
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "8px 12px",
    background: "#4cafef",
    border: "none",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  },
};