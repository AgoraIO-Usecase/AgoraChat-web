import { rootStore, eventHandler } from "agora-chat-uikit";
import { setLoggedIn } from "./store/loginSlice";
import { notification } from "./utils/notification";
import toast from "react-hot-toast";
import i18next from "./i18n";
const listener = (store: any) => {
  const { client } = rootStore;
  const dispatch = store.dispatch;

  client.addEventHandler("sdkEvent", {
    onConnected: () => {
      dispatch(setLoggedIn(true));
    },
    onDisconnected: () => {
      dispatch(setLoggedIn(false));
    },
    onTextMessage: (message: any) => {
      notification("New message", message, store);
    },
    onImageMessage: (message: any) => {
      notification("New message", message, store);
    },
    onFileMessage: (message: any) => {
      notification("New message", message, store);
    },
    onAudioMessage: (message: any) => {
      notification("New message", message, store);
    },
    onVideoMessage: (message: any) => {
      notification("New message", message, store);
    },
    onCustomMessage: (message: any) => {
      notification("New message", message, store);
    },

    onContactAgreed: (data: any) => {
      const from =
        rootStore.addressStore.appUsersInfo[data.from]?.nickname ?? data.from;
      toast.success(`You have added ${from} as a contact.`);
    },
    onContactAdded: (data: any) => {
      const from =
        rootStore.addressStore.appUsersInfo[data.from]?.nickname ?? data.from;
      toast.success(`You have added ${from} as a contact.`);
    },
  });

  eventHandler.addEventHandler("uikitEvent", {
    onError: (error) => {},
    addReaction: {
      error: (error) => {
        if (error.type === 50) {
          toast.error(`Reaction ${i18next.t("Exceeded maximum number")}`);
        }
      },
    },
    addContact: {
      success: () => {
        toast.success(i18next.t("Friend request sent"));
      },
      error: (error) => {
        if (
          error.type === 204 &&
          error.message === "Service resource not found"
        ) {
          toast.error(i18next.t("User does not exist"));
        } else {
          toast.error(i18next.t("Request failed"));
        }
      },
    },
    recallMessage: {
      success: () => {
        toast.success(i18next.t("Recall message successfully"));
      },
      error: (error) => {
        toast.error(i18next.t("Recall message failed"));
      },
    },
    reportMessage: {
      success: () => {
        toast.success(i18next.t("Reported successfully"));
      },
      error: (error) => {
        toast.error(i18next.t("Report failed"));
      },
    },
    sendMessage: {
      error: (error) => {
        if (error.type === 507) {
          toast.error(i18next.t("You have been banned from sending messages"));
        } else if (
          error.type === 602 &&
          error.message === "not in group or chatroom"
        ) {
          toast.error(
            i18next.t(
              "Message sending failed, you are no longer in the current group"
            )
          );
        }
      },
    },
  });
};

export { rootStore };

export default listener;
