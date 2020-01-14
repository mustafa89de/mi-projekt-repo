import axios from 'axios';
import {ENDPOINTS} from "../constants";
import JWTService from "./JWTService";
import {router} from "../index";
import PushService from "./PushService";

class AuthService {
  constructor() {
    // if axios detects a 401 => logout
    axios.interceptors.response.use(
      response => response,
      error => {
        if (error && error.response && error.response.status === 401) this.logout();
        return Promise.reject(error);
      }
    );

    // if authenticated add auth header
    axios.interceptors.request.use(
      config => {
        if (this.isAuthenticated()) config.headers.authorization = JWTService.getJWT();
        return config;
      },
      error => Promise.reject(error)
    );
  }

  async login(email, password) {
    try {
      const res = await axios.post(ENDPOINTS.LOGIN, {
        email,
        password
      });
      JWTService.storeJWT(res.data.token);
      await PushService.subscribeToPush();
    } catch (err) {
      err.status = err.response.status;
      console.error(err.message);
      throw err;
    }
  }

  isAuthenticated() {
    return !!JWTService.getJWT();
  }

  getUser() {
    const {sub} = JWTService.getPayload();
    return {
      userId: sub
    };
  }

  async logout() {
    let subscribed = await PushService.hasSubscribed();
    if (subscribed){
      await PushService.unsubscribePush();
    }
    JWTService.removeJWT();
    if (router) {
      router.go();
    }
  }
}

export default new AuthService();
