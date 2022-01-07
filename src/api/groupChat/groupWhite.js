
import WebIM from '../../utils/WebIM'
import store from '../../redux/store'
import { groupAllowAction } from '../../redux/actions'
export const getGroupWrite = (groupId) => {
    let options = {
        groupId: groupId
    }
    WebIM.conn.getGroupWhitelist(options).then((res) => {
        store.dispatch(groupAllowAction(res.data))
    })
}

export const rmGroupWhiteUser = (groupId, userName) => {
    let options = {
        groupId: groupId,
        userName: userName
    };
    WebIM.conn.rmUsersFromGroupWhitelist(options).then((res) => {
        console.log('move mute success>>>', res);
        getGroupWrite(groupId)
    })
}

export const addGroupWhiteUser = (groupId, userName) => {
    let options = {
        groupId: groupId,
        users: [userName]
    };
    WebIM.conn.addUsersToGroupWhitelist(options).then((res) => {
        console.log('make mute success>>>', res);
        getGroupWrite(groupId)
    })
}