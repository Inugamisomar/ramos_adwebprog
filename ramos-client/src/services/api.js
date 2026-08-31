const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const apiRequest = async (
  endpoint,
  options = {}
) => {
  const token =
    localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    data = {
      message:
        "Invalid response from server.",
    };
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Something went wrong."
    );
  }

  return data;
};

export default apiRequest;
export { API_URL };