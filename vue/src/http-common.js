import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:2324",
  headers: {
    "Content-type": "application/json",
  }
});
