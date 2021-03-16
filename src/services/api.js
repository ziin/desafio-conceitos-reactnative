import axios from "axios";

const api = axios.create({
  // Android cannot connect with localhost
  baseURL: "http://192.168.0.104:3333",
});

export default api;
