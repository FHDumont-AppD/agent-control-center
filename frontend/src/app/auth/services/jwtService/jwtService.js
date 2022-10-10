import FuseUtils from "src/@internal/utils/FuseUtils";
import axios from "axios";
import jwtDecode from "jwt-decode";
import jwtServiceConfig from "./jwtServiceConfig";
import Swal from "sweetalert2";

/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    console.log("setInterceptors");
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (
            err.response.status === 401 &&
            err.config &&
            !err.config.__isRetryRequest
          ) {
            this.emit("onAutoLogout", "Invalid access_token");
            this.setSession(null);
          }

          let message = err.message || "Something wrong happened";

          console.log("==> error", err);
          // erro técnico
          if (err.code == "ERR_NETWORK") {
            message =
              "Are you connected to the Internet? Please check and try again!";
          } else if (err.code == "ERR_BAD_REQUEST") {
            if (err.response && err.response.data) {
              message = err.response.data.detail;
            } else {
              if ((err.message = "Request failed with status code 401")) {
                message = "Your token is expired.";
              } else {
                console.log("CHECK ERROR 1===", err);
              }
            }
          } else if (err.code == "ERR_BAD_RESPONSE") {
            if (err.response && err.response.data) {
              message = err.response.data.detail;
            } else {
              console.log("CHECK ERROR 2===", err);
            }
          } else {
            console.log("CHECK ERROR F===", err);
          }

          if (message.indexOf("should be higher than current") != -1) {
            message =
              "You should select a new version higher than current version";
          }

          Swal.fire({
            position: "top-end",
            icon: "error",
            text: message,
            showConfirmButton: true,
            timer: 5000,
            timerProgressBar: true,
          });

          throw err;
        });
      }
    );
  };

  handleAuthentication = () => {
    const access_token = this.getAccessToken();

    if (!access_token) {
      this.emit("onNoAccessToken");

      return;
    }

    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token);
      this.emit("onAutoLogin", true);
    } else {
      this.setSession(null);
      this.emit("onAutoLogout", "access_token expired");
    }
  };

  createUser = (data) => {
    return new Promise((resolve, reject) => {
      axios.post(jwtServiceConfig.signUp, data).then((response) => {
        if (response.data.user) {
          this.setSession(response.data.access_token);
          resolve(response.data.user);
          this.emit("onLogin", response.data.user);
        } else {
          reject(response.data.error);
        }
      });
    });
  };

  signInWithEmailAndPassword = (customerId, clientName, clientSecret) => {
    return new Promise((resolve, reject) => {
      axios
        .get(jwtServiceConfig.signIn, {
          data: {
            customerId,
            clientName,
            clientSecret,
          },
        })
        .then((response) => {
          if (response.data.user) {
            this.setSession(response.data.access_token);
            resolve(response.data.user);
            this.emit("onLogin", response.data.user);
          } else {
            reject(response.data.error);
          }
        });
    });
  };

  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(jwtServiceConfig.accessToken, {
          data: {
            access_token: this.getAccessToken(),
          },
        })
        .then((response) => {
          if (response.data.user) {
            this.setSession(response.data.access_token);
            resolve(response.data.user);
          } else {
            this.logout();
            reject(new Error("Failed to login with token."));
          }
        })
        .catch((error) => {
          this.logout();
          reject(new Error("Failed to login with token."));
        });
    });
  };

  updateUserData = (user) => {
    return axios.post(jwtServiceConfig.updateUser, {
      user,
    });
  };

  setSession = (access_token) => {
    if (access_token) {
      localStorage.setItem("jwt_access_token", access_token);
      axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    } else {
      localStorage.removeItem("jwt_access_token");
      delete axios.defaults.headers.common.Authorization;
    }
  };

  logout = () => {
    this.setSession(null);
    this.emit("onLogout", "Logged out");
  };

  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false;
    }
    const decoded = jwtDecode(access_token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn("access token expired");
      return false;
    }

    return true;
  };

  getAccessToken = () => {
    return window.localStorage.getItem("jwt_access_token");
  };
}

const instance = new JwtService();

export default instance;
