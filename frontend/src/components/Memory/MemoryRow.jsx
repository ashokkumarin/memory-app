import { FaEdit, FaTrash } from "react-icons/fa";
import IconButton from "../buttons/IconButton";
import { styles } from "../../styles/inputModeStyles";

export default function MemoryRow({ item, onEdit, onDelete }) {
  return (
    <div style={styles.row}>
      <div style={styles.rowActions}>
        <IconButton title="Edit" variant="edit" onClick={onEdit}>
          <FaEdit size={14} />
        </IconButton>

        <IconButton title="Delete" variant="delete" onClick={onDelete}>
          <FaTrash size={14} />
        </IconButton>
      </div>
              
      <span style={styles.rowText}>
        <b>{item.key}</b>: {item.value}
      </span>
    </div>
  );
}