import axios from "axios";
import { rootStore } from "agora-chat-uikit";
import { appServer } from "../config";
// username -> chat user id
export const getRtcToken = (params: {
  channelName: string | number;
  username: string;
  agoraUid: string;
}) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + rootStore.client.context.accessToken;
  let { username, channelName, agoraUid } = params;
  // const url = `${appServer}/token/rtc/channel/${channelName}/agorauid/${agoraUid}?userAccount=${username}`;

  const url = `${appServer}/app/chat/token/rtc/channel/${channelName}/agorauid/${agoraUid}?userAccount=${username}`;

  return axios.get(url).then(function (response) {
    return response.data;
  });
};

export const getRtcChannelMembers = (params: {
  username: string;
  channelName: string;
}) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + rootStore.client.context.accessToken;
  let { username, channelName } = params;

  // const url = `${appServer}/agora/channel/mapper?channelName=${channelName}&userAccount=${username}`;
  const url = `${appServer}/app/chat/agora/channel/mapper?channelName=${channelName}`;
  return axios
    .get(url)
    .then(function (response) {
      let members = response.data.result;
      return members;
    })
    .catch(function (error) {
      console.log(error);
    });
};
