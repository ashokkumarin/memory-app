import { useEffect, useState } from "react";
import { getMemory, saveMemory, deleteMemory } from "../services/api";

export default function InputModePage() {
  const [list, setList] = useState([]);
  const [keyVal, setKeyVal] = useState("");
  const [value, setValue] = useState("");

  // ✅ FETCH
  const fetchData = async () => {
    try {
      const data = await getMemory();
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ SAVE FUNCTION (IMPORTANT — MUST EXIST)
  const handleSave = async () => {
    try {
      await saveMemory({ key: keyVal, value });
      setKeyVal("");
      setValue("");
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px", height: "100%", overflow: "auto" }}>
      <h2>Settings</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          value={keyVal}
          onChange={(e) => setKeyVal(e.target.value)}
          placeholder="Key"
        />

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Value"
        />

        {/* ✅ FIX HERE */}
        <button onClick={handleSave}>Save</button>
      </div>

      {list.map((item) => (
        <div key={item.id} style={{ display: "flex", justifyContent: "space-between" }}>
          <span>
            <b>{item.key}</b>: {item.value}
          </span>

          <div>
            <button onClick={() => {
              setKeyVal(item.key);
              setValue(item.value);
            }}>
              Edit
            </button>

            <button onClick={async () => {
              await deleteMemory(item.id);
              fetchData();
            }}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}