import WebIM from "../../utils/WebIM";
import getGroups from "./getGroups";
import getGroupInfo from "../groupChat/getGroupInfo";
import { EaseApp } from 'agora-chat-uikit'
import { getLocalStorageData } from '../../utils/notification'
import { Chat, ConversationList, RootProvider, rootStore } from 'chatuim2'
export const closeGroup = (groupId, type, onClose) => {
	let option = {
		groupId: groupId,
	};

	if (type === "dissolve") {
		rootStore.client.dissolveGroup(option).then((res) => {
			console.log(res);
			if (getLocalStorageData().deleteSwitch) {
				EaseApp.deleteSessionAndMessage({ sessionType: 'groupChat', sessionId: groupId })
			}
			getGroups();
		});
	} else if (type === "quit") {
		rootStore.client.quitGroup(option).then((res) => {
			console.log(res);
			if (getLocalStorageData().deleteSwitch) {
				EaseApp.deleteSessionAndMessage({ sessionType: 'groupChat', sessionId: groupId })
			}
			getGroups();
		});
	}
	rootStore.conversationStore.deleteConversation({
		chatType: 'groupChat',
		conversationId: groupId
	});
	onClose && onClose();
};

export const rmGroupUser = (groupId, username, onClose) => {
	let option = {
		groupId: groupId,
		username: username,
	};
	rootStore.client.removeSingleGroupMember(option).then((res) => {
		console.log("rmGroupUser success >>>", res);
		getGroupInfo(groupId, "rmGroupUser");
		onClose && onClose();
	});
};

export const transferOwner = (groupId, userId, onClose, type) => {
	let option = {
		groupId: groupId,
		newOwner: userId,
		success: (res) => {
			console.log("transferOwner success >>>", res);
			if (type === "quit") {
				closeGroup(groupId, type, onClose);
			}
			onClose && onClose();
		},
	};
	rootStore.client.changeGroupOwner(option);
};
