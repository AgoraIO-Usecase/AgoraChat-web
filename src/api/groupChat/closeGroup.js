import getGroups from "./getGroups";
import getGroupInfo from "../groupChat/getGroupInfo";
import { rootStore } from "agora-chat-uikit";
import { getLocalStorageData } from '../../utils/notification'
export const closeGroup = (groupId, type, onClose) => {
  let option = {
    groupId: groupId
  };

  if (type === "dissolve") {
    rootStore.client.dissolveGroup(option).then((res) => {
      getGroups();
    });
  } else if (type === "quit") {
    rootStore.client.quitGroup(option).then((res) => {
      getGroups();
    });
  }

  if (getLocalStorageData().deleteSwitch) {
    rootStore.conversationStore.deleteConversation({
      chatType: "groupChat",
      conversationId: groupId
    });
  }

  onClose && onClose();
};

export const rmGroupUser = (groupId, username, onClose) => {
  let option = {
    groupId: groupId,
    username: username
  };
  rootStore.client.removeSingleGroupMember(option).then((res) => {
    getGroupInfo(groupId, "rmGroupUser");
    onClose && onClose();
  });
};

export const transferOwner = (groupId, userId, onClose, type) => {
  let option = {
    groupId: groupId,
    newOwner: userId,
    success: (res) => {
      if (type === "quit") {
        closeGroup(groupId, type, onClose);
      }
      onClose && onClose();
    }
  };
  rootStore.client.changeGroupOwner(option);
};
