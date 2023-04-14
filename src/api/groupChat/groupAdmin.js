
import WebIM from '../../utils/WebIM'
import store from '../../redux/store'
import { groupAdminsAction } from '../../redux/actions'
import { getGroupWrite } from './groupWhite'
import { rootStore } from 'chatuim2'
export const getGroupAdmins = (groupId) => {
    let options = {
        groupId: groupId
    };
    rootStore.client.getGroupAdmin(options).then((res) => {
        console.log('res>>>', res)
        store.dispatch(groupAdminsAction(res.data))
        getGroupWrite(groupId)
    })
}

export const onChengeGroupAdmin = (groupId, userName, type, onClose) => {
    let options = {
        groupId: groupId,
        username: userName
    };
    if (type === 'make') {
        rootStore.client.setAdmin(options).then((res) => {
            console.log(res)
            getGroupAdmins(groupId)
        })
    } else if (type === 'move') {
        rootStore.client.removeAdmin(options).then((res) => {
            console.log(res)
            getGroupAdmins(groupId)
        })
    }
    onClose && onClose();
}
