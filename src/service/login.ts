import axios from "axios";
import { appServer } from "../config";

export const getToken = (agoraId: string, password: string) => {
  return axios.post(`${appServer}/app/chat/user/login`, {
    userAccount: agoraId,
    userPassword: password,
  });
};
