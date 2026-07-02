import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { rootStore } from "../eventHandler";
import type { RootState } from "./store";
import { appId } from "../config";
export const loginSlice = createSlice({
  name: "login",
  initialState: {
    phoneNumber: "",
    chatToken: "",
    password: "",
    userId: "",
    agoraUid: "",
    loggedIn: false,
    appId: appId,
    useDNS: true,
  },
  reducers: {
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload;
    },
    setChatToken: (state, action: PayloadAction<string>) => {
      state.chatToken = action.payload;
    },

    loginWithToken: (
      state,
      action: PayloadAction<{
        userId: string;
        chatToken: string;
        agoraUid: string;
      }>,
    ) => {
      const { client } = rootStore;
      client.open({
        user: action.payload.userId,
        agoraToken: action.payload.chatToken,
      });
      state.userId = action.payload.userId;
      state.chatToken = action.payload.chatToken;
      state.agoraUid = action.payload.agoraUid;
    },

    loginWithPassword: (
      state,
      action: PayloadAction<{ userId: string; password: string }>,
    ) => {
      const { client } = rootStore;
      client.open({
        user: action.payload.userId,
        pwd: action.payload.password,
      });
      state.userId = action.payload.userId;
      state.password = action.payload.password;
    },

    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
      if (action.payload && state.userId) {
        window.sessionStorage.setItem(
          "webImAuth",
          JSON.stringify({
            userId: state.userId,
            chatToken: state.chatToken,
            password: state.password,
            agoraUid: state.agoraUid,
          }),
        );
      }
    },

    logout: (state) => {
      const { client } = rootStore;
      rootStore.clear();
      client.close();
      state.loggedIn = false;
      sessionStorage.removeItem("webImAuth");
    },

    setSDKConfig: (
      state,
      action: PayloadAction<{ appId: string; useDNS: boolean }>,
    ) => {
      state.appId = action.payload.appId;
      state.useDNS = action.payload.useDNS;
    },
  },
});

export const {
  setPhoneNumber,
  setChatToken,
  loginWithToken,
  loginWithPassword,
  setLoggedIn,
  logout,
  setSDKConfig,
} = loginSlice.actions;

export default loginSlice.reducer;
export const selectState = (state: RootState) => state.login;
