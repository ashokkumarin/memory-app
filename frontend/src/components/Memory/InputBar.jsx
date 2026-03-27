import ActionButton from "../buttons/ActionButton";
import { styles } from "../../styles/inputModeStyles";

export default function InputBar({
  keyVal,
  value,
  setKeyVal,
  setValue,
  onSave,
  loading,
}) {
  return (
    <div style={styles.inputBar}>
      <input
        style={styles.keyInput}
        value={keyVal}
        onChange={(e) => setKeyVal(e.target.value)}
        placeholder="Key"
      />

      <input
        style={styles.valueInput}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Value"
      />

      <ActionButton
        variant="save"
        onClick={onSave}
        disabled={loading || !keyVal.trim() || !value.trim()}
      >
        {loading ? "Saving..." : "Save"}
      </ActionButton>
    </div>
  );
}