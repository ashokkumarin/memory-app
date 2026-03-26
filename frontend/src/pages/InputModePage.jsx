import { useEffect, useState } from "react";
import { getMemory, saveMemory, deleteMemory } from "../services/api";

export default function InputModePage() {
  const [list, setList] = useState([]);
  const [keyVal, setKeyVal] = useState("");
  const [value, setValue] = useState("");

  const fetchData = async () => {
    const data = await getMemory();
    setList(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const save = async () => {
    await saveMemory({ key: keyVal, value });
    setKeyVal("");
    setValue("");
    fetchData();
  };

  return (
    <div style={styles.container}>
      <h2>Settings</h2>

      <div style={styles.form}>
        <input value={keyVal} onChange={(e) => setKeyVal(e.target.value)} placeholder="Key" />
        <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Value" />
        <button onClick={save}>Save</button>
      </div>

      {list.map((item) => (
        <div key={item.id} style={styles.row}>
          <span><b>{item.key}</b>: {item.value}</span>

          <div>
            <button onClick={() => {
              setKeyVal(item.key);
              setValue(item.value);
            }}>Edit</button>

            <button onClick={async () => {
              await deleteMemory(item.id);
              fetchData();
            }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    height: "100%", // ✅ IMPORTANT
    overflow: "auto",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
};