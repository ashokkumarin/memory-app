export const sendQuery = async (question) => {
  const res = await fetch("http://localhost:3000/query", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ question }),
  });
  return res.json();
};

export const getMemory = async () => {
  const res = await fetch("http://localhost:3000/memory");
  return res.json();
};

export const saveMemory = async (data) => {
  await fetch("http://localhost:3000/memory", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  });
};

export const deleteMemory = async (id) => {
  await fetch(`http://localhost:3000/memory/${id}`, {
    method: "DELETE",
  });
};