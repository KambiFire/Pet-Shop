import axios from "axios";

const PORT = process.env.REACT_APP_SERVER_PORT;
const API_URL = `http://localhost:${PORT}/api/auth/`;

class AuthService {
  login(username: string, password: string) {
    return axios
      .post(API_URL + "signin", {
        username,
        password,
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username: string, email: string, password: string) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password,
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}

export default new AuthService();
