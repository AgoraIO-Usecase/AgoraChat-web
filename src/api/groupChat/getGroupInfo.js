
import WebIM from '../../utils/WebIM'
import store from '../../redux/store'
import { groupsInfoAction } from '../../redux/actions'
import { getGroupNotice } from './groupNotice'
import { getGroupAdmins } from './groupAdmin'
import { getGroupMuted } from './groupMute'
import { getGroupBlock } from './groupBlock'
import { getGroupWrite } from './groupWhite'
const getGroupInfo = (groupId, type) => {
    let options = {
        groupId: groupId
    };
    WebIM.conn.getGroupInfo(options).then((res) => {
        let id = res.data[0].id
        if (!type) {
            getGroupNotice(id)
            getGroupAdmins(id)
            getGroupMuted(id)
            getGroupBlock(id)
            getGroupWrite(id)
        }
        store.dispatch(groupsInfoAction(res.data[0]))
    })
}


export const modifyGroupInfo = (newGroupName, newDescription, handleClose) => {
    let state = store.getState();
	let groupId = state.groups.groupsInfo?.id;
    let groupName = state.groups.groupsInfo?.name || "";
	let groupDescription = state.groups.groupsInfo?.description || "";
	let option = {
		groupId: groupId,
		groupName: newGroupName ? newGroupName : groupName,
		description: newDescription ? newDescription : groupDescription,
	};
	WebIM.conn.modifyGroup(option).then((res) => {
		console.log("modifyGroupInfo>>>", res);
        getGroupInfo(groupId);
        handleClose && handleClose();
	});
};


export default getGroupInfo;