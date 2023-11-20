
import getGroups from './getGroups'
import { message } from '../../components/common/alert'
import i18next from "i18next";
import store from "../../redux/store";
import { closeGroupChatAction } from "../../redux/actions";
import { rootStore } from 'chatuim2'
const createGroup = (
	groupInfo,
	member,
	onClearValue,
	onClose,
	handleClickSession
) => {
	const {
		groupNameValue,
		groupDescriptionValue,
		groupPublicChecked,
		groupApprovalChecked,
		groupInviteChecked,
		groupMaximumValue,
		inviteNeedConfirm
	} = groupInfo;
	let options = {
		data: {
			groupname: groupNameValue,
			desc: groupDescriptionValue,
			members: member,
			public: groupPublicChecked,
			approval: groupApprovalChecked,
			allowinvites: groupInviteChecked,
			inviteNeedConfirm: inviteNeedConfirm,
			maxusers: groupMaximumValue
		},
	};
	console.log(options)
	rootStore.client.createGroupNew(options).then((res) => {
		console.log("createGroupNew>>>", res);
		message.success(i18next.t("created success"));
		getGroups();
		onClearValue();
		onClose();
		store.dispatch(closeGroupChatAction(false));
		handleClickSession(res.data.groupid);
	});
};

export default createGroup;