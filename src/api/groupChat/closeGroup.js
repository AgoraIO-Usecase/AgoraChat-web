import WebIM from "../../utils/WebIM";
import getGroups from "./getGroups";
import getGroupInfo from "../groupChat/getGroupInfo";
export const closeGroup = (groupId, type, onClose) => {
	let option = {
		groupId: groupId,
	};

	if (type === "dissolve") {
		WebIM.conn.dissolveGroup(option).then((res) => {
			console.log(res);
			getGroups();
		});
	} else if (type === "quit") {
		WebIM.conn.quitGroup(option).then((res) => {
			console.log(res);
			getGroups();
		});
	}
	onClose && onClose();
};

export const rmGroupUser = (groupId, username, onClose) => {
	let option = {
		groupId: groupId,
		username: username,
	};
	WebIM.conn.removeSingleGroupMember(option).then((res) => {
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
	WebIM.conn.changeGroupOwner(option);
};
