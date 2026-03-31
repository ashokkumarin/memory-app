export const buttonVariants = {
  save: {
    base: "#16a34a",
    hover: "#15803d",
  },
  edit: {
    hover: "#1d4ed8",
  },
  delete: {
    hover: "#b91c1c",
  },
};

export const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    height: "100%",
    overflow: "hidden",
  },
  heading: {
    marginBottom: "16px",
    flexShrink: 0,
  },
  inputBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    width: "100%",
    flexShrink: 0,
  },
  keyInput: {
    flex: "0 0 40%",
    padding: "10px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    outline: "none",
  },
  valueInput: {
    flex: "0 0 40%",
    padding: "10px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    outline: "none",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    alignItems: "right",
    flex: 1,
    overflow: "auto",
  },
  row: {
    display: "flex",
    alignItems: "left",
    gap: "12px",
  },

  rowText: {
    flex: 1,
    fontWeight: "500",
    textAlign: "left",   // 👈 add this
    justifyContent: "flex-start", // 👈 important
  },
  rowActions: {
    display: "flex",
    gap: "8px",
  },
  buttonBase: {
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    color: "#fff",
    transition: "all 0.2s ease",
  },
  saveButton: {
    flex: "0 0 10%",
    padding: "10px",
  },
  iconButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    cursor: "pointer",
  },
};