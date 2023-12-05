
import store from '../../redux/store'
import { groupAllowAction } from '../../redux/actions'
import { rootStore } from 'agora-chat-uikit'
export const getGroupWrite = (groupId) => {
    let options = {
        groupId: groupId
    }
    rootStore.client.getGroupWhitelist(options).then((res) => {
        console.log("getGroupWhitelist>>>", res);
        store.dispatch(groupAllowAction(res.data))
    })
}

export const rmGroupWhiteUser = (groupId, userName, onClose) => {
    let options = {
        groupId: groupId,
        userName: userName
    };
    rootStore.client.rmUsersFromGroupWhitelist(options).then((res) => {
        getGroupWrite(groupId)
        onClose && onClose();
    })
}

export const addGroupWhiteUser = (groupId, userName, onClose) => {
    let options = {
        groupId: groupId,
        users: [userName]
    };
    rootStore.client.addUsersToGroupWhitelist(options).then((res) => {
        getGroupWrite(groupId);
        onClose && onClose();
    })
}
