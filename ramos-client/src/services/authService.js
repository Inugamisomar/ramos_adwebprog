import apiRequest from "./api";

export const register = async (
  name,
  email,
  password
) => {
  return apiRequest(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    }
  );
};

export const login = async (
  email,
  password
) => {
  return apiRequest(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );
};

export const getProfile = async () => {
  return apiRequest(
    "/auth/profile"
  );
};

export const saveSession = (
  token,
  user
) => {
  localStorage.setItem(
    "token",
    token
  );

  localStorage.setItem(
    "user",
    JSON.stringify(user)
  );
};

export const getCurrentUser = () => {
  const savedUser =
    localStorage.getItem(
      "user"
    );

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(
      savedUser
    );
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "user"
  );
};