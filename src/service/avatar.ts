import axios from "axios";
import { rootStore } from "agora-chat-uikit";
import { appServer } from "../config";
export const uploadImage = (formData: FormData) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + rootStore.client.context.accessToken;
  return axios
    .post(
      `${appServer}/app/chat/user/${rootStore.client.user}/avatar/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then((response) => {
      return rootStore.client
        .updateOwnUserInfo("avatarurl", response.data.avatarUrl)
        .then((res: any) => {
          return response.data.avatarUrl;
        });
    })
    .catch((error) => {
      console.error("uploadImage fail", error);
    });
};

async function sendRequest(groupId: string) {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + rootStore.client.context.accessToken;
  return await axios
    .get(`${appServer}/app/chat/group/${groupId}/avatarurl`)
    .then((response) => {
      return response.data.avatarUrl;
    })
    .catch(() => {
      return "";
    });
}

export const getGroupAvatar = async (groupIds: string[]) => {
  let result: { [key: string]: string } = {};
  for (let groupId of groupIds) {
    result[groupId] = await sendRequest(groupId);
  }
  return result;
};
