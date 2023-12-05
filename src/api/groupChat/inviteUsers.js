import { rootStore } from 'agora-chat-uikit'
export const inviteUsersToGroup = (groupId, data, onClose) => {
	let option = {
		users: data,
		groupId,
	};
	rootStore.client.inviteUsersToGroup(option).then((res) => {
		console.log("inviteUsersToGroup>>>", res);
		onClose && onClose();
	});
};
