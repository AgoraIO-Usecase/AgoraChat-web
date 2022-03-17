import WebIM from "../../utils/WebIM";
import store from "../../redux/store";

export const inviteUsersToGroup = (groupId, data, onClose) => {
	let option = {
		users: data,
		groupId,
	};
	WebIM.conn.inviteUsersToGroup(option).then((res) => {
		console.log("inviteUsersToGroup>>>", res);
	});
};
