export default function MemoryList({ list, onEdit, onDelete }) {
  return (
    <div>
      <h3>Stored Data</h3>

      {list.map((item) => (
        <div key={item.id} style={styles.row}>
          <div>
            <b>{item.key}</b>: {item.value}
          </div>

          <div>
            <button onClick={() => onEdit(item)} style={styles.btn}>
              Edit
            </button>

            <button
              onClick={() => onDelete(item.id)}
              style={{ ...styles.btn, background: "#e74c3c" }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    padding: "8px",
    background: "#f5f5f5",
    borderRadius: "6px",
  },
  btn: {
    marginLeft: "10px",
    padding: "4px 8px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};