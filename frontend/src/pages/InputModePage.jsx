import { useEffect, useState } from "react";
import { getMemory, saveMemory, deleteMemory } from "../services/api";
import InputBar from "../components/memory/InputBar";
import MemoryRow from "../components/memory/MemoryRow";
import { styles } from "../styles/inputModeStyles";

export default function InputModePage() {
  const [list, setList] = useState([]);
  const [keyVal, setKeyVal] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getMemory();
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch memory:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setKeyVal("");
    setValue("");
  };

  const handleSave = async () => {
    if (!keyVal.trim() || !value.trim()) return;

    try {
      setLoading(true);
      await saveMemory({ key: keyVal, value });
      resetForm();
      await fetchData();
    } catch (err) {
      console.error("Failed to save memory:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setKeyVal(item.key);
    setValue(item.value);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteMemory(id);
      await fetchData();
    } catch (err) {
      console.error("Failed to delete memory:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Settings</h2>

      <InputBar
        keyVal={keyVal}
        value={value}
        setKeyVal={setKeyVal}
        setValue={setValue}
        onSave={handleSave}
        loading={loading}
      />

      <div style={styles.list}>
        {list.map((item) => (
          <MemoryRow
            key={item.id}
            item={item}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </div>
    </div>
  );
}