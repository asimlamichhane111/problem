import axiosInstance from "./axiosInstance";

const API_URL = "/users/api/";

export const loginUser = async (email, password) => {
  const response = await axiosInstance.post(`${API_URL}login/`, { email, password });
  localStorage.setItem("access_token", response.data.token);
  if (response.data.refresh) {
    localStorage.setItem("refresh_token", response.data.refresh);
  }
  return response.data;
};

export const registerUser = async (name, email, password,phone, role) => {
  const response = await axiosInstance.post(`${API_URL}register/`, { 
    name, email, password,phone, role 
  });
  return response.data;
};

  
