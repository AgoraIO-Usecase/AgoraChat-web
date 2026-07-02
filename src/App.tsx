import { useEffect, FC } from "react";
import "./index.css";
import { observer } from "mobx-react-lite";
import { Toaster } from "react-hot-toast";
import { rootStore, UIKitProvider, useSDK } from "agora-chat-uikit";
import "agora-chat-uikit/style.css";
import "./App.css";
import AppRoutes from "./routes/routes";
import { store } from "./store/store";
import listener from "./eventHandler";
import i18next from "./i18n";
import { useAppSelector, useAppDispatch } from "./hooks";
import { updateAppConfig } from "./store/appConfigSlice";
// @ts-ignore Used for debugging code
window.rootStore = rootStore;

const ChatApp: FC<any> = () => {
  const state = useAppSelector((state) => state.appConfig);
  const loginState = useAppSelector((state) => state.login);

  // close Chat and RTC log
  const { AgoraRTC, ChatSDK } = useSDK();
  ChatSDK.logger.disableAll();
  // AgoraRTC.setLogLevel(4);

  useEffect(() => {
    listener(store);
  }, [loginState.appId, loginState.useDNS]);

  const dispatch = useAppDispatch();
  useEffect(() => {
    const localGeneralConfig = localStorage.getItem("generalConfig");
    if (localGeneralConfig) {
      const config = JSON.parse(localGeneralConfig);
      dispatch(updateAppConfig(config));
      // i18next.changeLanguage(config.language);
    }
  }, []);

  return (
    <UIKitProvider
      initConfig={{
        appId: loginState.appId,
        useUserInfo: true,
        translationTargetLanguage: state.translationTargetLanguage,
      }}
      features={{
        conversationList: {
          search: true,
          item: {
            moreAction: true,
            deleteConversation: true,
            presence: true,
          },
        },
        chat: {
          header: {
            threadList: state.thread,
            audioCall: true,
            videoCall: true,
          },
          message: {
            status: true,
            reaction: state.reaction,
            thread: state.thread,
            recall: true,
            translate: state.translation,
            edit: true,
            delete: true,
            report: true,
            pin: true,
          },
          messageInput: {
            typing: state.typing,
          },
        },
      }}
      theme={{
        primaryColor: state.color.h,
        mode: state.dark ? "dark" : "light",
        bubbleShape: state.theme === "classic" ? "square" : "round",
        avatarShape: state.theme === "classic" ? "square" : "circle",
        componentsShape: state.theme === "classic" ? "square" : "round",
      }}
      local={{
        lng: "en",
      }}
    >
      <AppRoutes></AppRoutes>
      <Toaster></Toaster>
    </UIKitProvider>
  );
};

export default observer(ChatApp);
