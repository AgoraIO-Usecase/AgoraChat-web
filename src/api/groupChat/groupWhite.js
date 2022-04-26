
import WebIM from '../../utils/WebIM'
import store from '../../redux/store'
import { groupAllowAction } from '../../redux/actions'
export const getGroupWrite = (groupId) => {
    let options = {
        groupId: groupId
    }
    WebIM.conn.getGroupWhitelist(options).then((res) => {
        console.log("getGroupWhitelist>>>",res);
        store.dispatch(groupAllowAction(res.data))
    })
}

export const rmGroupWhiteUser = (groupId, userName,onClose) => {
    let options = {
        groupId: groupId,
        userName: userName
    };
    WebIM.conn.rmUsersFromGroupWhitelist(options).then((res) => {
        getGroupWrite(groupId)
        onClose && onClose();
    })
}

export const addGroupWhiteUser = (groupId, userName,onClose) => {
    let options = {
        groupId: groupId,
        users: [userName]
    };
    WebIM.conn.addUsersToGroupWhitelist(options).then((res) => {
        getGroupWrite(groupId);
        onClose && onClose();
    })
}
