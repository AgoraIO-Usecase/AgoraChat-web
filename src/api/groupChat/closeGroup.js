

import WebIM from '../../utils/WebIM'
import getGroups from './getGroups'
import getGroupInfo from '../groupChat/getGroupInfo'
export const closeGroup = (groupId, type, onClose) => {
    let option = {
        groupId: groupId
    };

    if (type === "dissolve") {
        WebIM.conn.dissolveGroup(option).then((res) => {
            console.log(res)
            getGroups()
            onClose && onClose()
        })
    } else if (type === "quit") {
        WebIM.conn.quitGroup(option).then((res) => {
            console.log(res)
            getGroups()
            onClose && onClose()
        })
    }
}

export const rmGroupUser = (groupId, username) => {
    let option = {
        groupId: groupId,
        username: username,
    };
    WebIM.conn.removeSingleGroupMember(option).then((res) => {
        console.log('rmGroupUser success >>>', res);
        getGroupInfo(groupId, 'rmGroupUser')
    });
}
