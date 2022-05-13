
import WebIM from '../../utils/WebIM'
import store from '../../redux/store'
import { groupAdminsAction } from '../../redux/actions'
import { getGroupWrite } from './groupWhite'
export const getGroupAdmins = (groupId) => {
    let options = {
        groupId: groupId
    };
    WebIM.conn.getGroupAdmin(options).then((res) => {
        console.log('res>>>', res)
        store.dispatch(groupAdminsAction(res.data))
        getGroupWrite(groupId)
    })
}

export const onChengeGroupAdmin = (groupId, userName, type,onClose) => {
    let options = {
        groupId: groupId,
        username: userName
    };
    if (type === 'make') {
        WebIM.conn.setAdmin(options).then((res) => {
            console.log(res)
            getGroupAdmins(groupId)
        })
    } else if (type === 'move') {
        WebIM.conn.removeAdmin(options).then((res) => {
            console.log(res)
            getGroupAdmins(groupId)
        })
    }
    onClose && onClose();
}
