import store from "../../redux/store";
import { message } from "../../components/common/alert";
import i18next from "i18next";
import {
  contactsAction,
  setBlackList,
  updateRequestStatus,
  searchLoadAction
} from "../../redux/actions";
import { subFriendStatus } from "../presence/index";
import { getSilentModeForConversations } from "../notificationPush/index";
import { setMyUserInfo } from "../../redux/actions";
import { rootStore } from "chatuim2";
const getContacts = () => {
  rootStore.client.getContacts().then((res) => {
    const payload = {
      usernames: res.data
    };
    if (payload.usernames.length) {
      subFriendStatus(payload);
    }
    const conversationList = [];
    res.data.forEach((item) => {
      conversationList.push({
        id: item,
        type: "singleChat"
      });
    });
    getSilentModeForConversations({ conversationList });
    store.dispatch(contactsAction(res.data));
    store.dispatch(searchLoadAction(false));
  });
};

export const addContact = (userId, message) => {
  rootStore.client.addContact(userId, message);
};

export const getBlackList = () => {
  rootStore.client.getBlacklist().then((res) => {
    store.dispatch(setBlackList(res.data));
  });
};

export const addFromBlackList = (userId) => {
  let { blackList } = store.getState();
  if (blackList.includes(userId)) {
    message.warn(`${i18next.t("The user is in the blacklist")}`);
    return;
  }
  rootStore.client.addUsersToBlacklist({
    name: [userId]
  });
  blackList = blackList.concat(userId);
  store.dispatch(setBlackList(blackList));
};

export const removeFromBlackList = (userId, onClose) => {
  rootStore.client.removeFromBlackList({
    name: [userId]
  });
  let { blackList } = store.getState();
  blackList = blackList.filter((v) => v !== userId);
  store.dispatch(setBlackList(blackList));
  onClose && onClose();
};

export const deleteContact = (userId, onClose) => {
  rootStore.client.deleteContact(userId);
  rootStore.conversationStore.deleteConversation({
    chatType: "singleChat",
    conversationId: userId
  });
  let { blackList } = store.getState();
  blackList = blackList.filter((v) => v !== userId);
  store.dispatch(setBlackList(blackList));
  onClose && onClose();
};

export const acceptContactRequest = (userId) => {
  rootStore.client.acceptInvitation(userId);
  // .then(()=>{
  //     let conversationItem = {
  //         conversationType: "singleChat",
  //         conversationId: userId,
  //     };
  //     EaseApp.addConversationItem(conversationItem);
  // })
  store.dispatch(
    updateRequestStatus({ type: "contact", name: userId, status: "accepted" })
  );
  let { contacts } = store.getState();
  let newContacts = [...contacts, userId];
  store.dispatch(contactsAction(newContacts));
};

export const declineContactRequest = (userId) => {
  rootStore.client.declineInvitation(userId);
  store.dispatch(
    updateRequestStatus({ type: "contact", name: userId, status: "ignored" })
  );
};

export const editSelfInfoMessage = (obj) => {
  rootStore.client.updateUserInfo(obj).then((val) => {
    const res = val.data;
    store.dispatch(setMyUserInfo({ nickName: res?.nickname || "" }));
  });
};

export default getContacts;
