const BASE_URL = "http://localhost:3000/api";

const checkResponse = async (res) => {
  if (res.ok) {
    return res.json();
  }

  let errorData;

  try {
    errorData = await res.json();
  } catch {
    errorData = {};
  }

  return Promise.reject({
    status: res.status,
    message: errorData.message || "Ocurrió un error",
    errors: errorData.errors || [],
  });
};

const request = ({ endpoint, method = "GET", body, token }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }).then(checkResponse);
};

export const loginAdmin = ({ email, password }) => {
  return request({
    endpoint: "/auth/login",
    method: "POST",
    body: {
      email,
      password,
    },
  });
};

export const getCurrentAdmin = (token) => {
  return request({
    endpoint: "/auth/me",
    token,
  });
};

export const getMenuItems = () => {
  return request({
    endpoint: "/menu",
  });
};

export const getInventoryItems = () => {
  return request({
    endpoint: "/inventory",
  });
};

export const getRestaurantSettings = () => {
  return request({
    endpoint: "/settings",
  });
};

export const createMenuItem = ({ item, token }) => {
  return request({
    endpoint: "/menu",
    method: "POST",
    body: item,
    token,
  });
};

export const updateMenuItem = ({ mongoId, item, token }) => {
  return request({
    endpoint: `/menu/${mongoId}`,
    method: "PATCH",
    body: item,
    token,
  });
};

export const deleteMenuItem = ({ mongoId, token }) => {
  return request({
    endpoint: `/menu/${mongoId}`,
    method: "DELETE",
    token,
  });
};

export const createInventoryItem = ({ item, token }) => {
  return request({
    endpoint: "/inventory",
    method: "POST",
    body: item,
    token,
  });
};

export const updateInventoryItem = ({ mongoId, item, token }) => {
  return request({
    endpoint: `/inventory/${mongoId}`,
    method: "PATCH",
    body: item,
    token,
  });
};

export const deleteInventoryItem = ({ mongoId, token }) => {
  return request({
    endpoint: `/inventory/${mongoId}`,
    method: "DELETE",
    token,
  });
};

export const updateRestaurantSettings = ({ settings, token }) => {
  return request({
    endpoint: "/settings",
    method: "PATCH",
    body: settings,
    token,
  });
};