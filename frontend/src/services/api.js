export const sendQuery = async (question) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/query`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ question }),
  });
  return res.json();
};

export const getMemory = async () => {
  console.log("Fetching memory from API..."); // 👈 debug
  const res = await fetch(`${import.meta.env.VITE_API_URL}/memory`);
  return res.json();
};

export const saveMemory = async (data) => {
  await fetch(`${import.meta.env.VITE_API_URL}/memory`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  });
};

export const deleteMemory = async (id) => {
  await fetch(`${import.meta.env.VITE_API_URL}/memory/${id}`, {
    method: "DELETE",
  });
};