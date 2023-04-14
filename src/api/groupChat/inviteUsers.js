import WebIM from "../../utils/WebIM";
import store from "../../redux/store";
import { rootStore } from 'chatuim2'
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
